using BookReaderAPI.Data;
using BookReaderAPI.DTOs;
using BookReaderAPI.Entities;
using BookReaderAPI.Exceptions;
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BookReaderAPI.Controllers
{
    public class UserController : APIController
    {
        private PasswordHasher<User> _pwHasher = new();
        private IConfiguration _config;

        public UserController(IConfiguration config) : base(config) 
        {
            _config = config;
        }

        // get all books authored by user
        [HttpGet("{username}/books")]
        public IActionResult GetBookAuthors(string username)
        {
            try
            {
                var books = _context.ExecQuery(
                    Entities.User.GetAuthoredBooks(),
                    new DbParams { Name = "Username", Value = username });

                //// serialize to User objects
                List<BookDTO> booksDTO = new();
                foreach (var book in books)
                {
                    var likes = _context.ExecQuery(
                        Like.CountAllUsersWhoLikesABook(),
                        new DbParams { Name = "BookId", Value = book.id });
                    Int64 likesCount = likes.First().likes_count;

                    booksDTO.Add(new BookDTO
                    {
                        Id = book.id,
                        Title = book.title,
                        Tagline = book.tagline,
                        Description = book.description,
                        Genre = book.genre,
                        CoverImgFileId = book.cover_img_file_id,
                        Views = book.views,
                        Likes = likesCount,
                        //Comments = book.comments,
                        CreatedAt = book.created_at,
                        UpdatedAt = book.updated_at
                    });
                }

                return Ok(GetAPIResult(booksDTO));
            }
            catch (Exception e)
            {
                return HandleException(e);
            }
        }

        // get all liked books by user
        [HttpGet("{username}/likes")]
        public IActionResult GetAllLikedBooks(string username)
        {
            try
            {
                var queryResult = _context.ExecQuery(
                    Like.GetAllLikedBooksByUser(),
                    new DbParams { Name = "Username", Value = username }
                );

                List<BookDTO> books = new();
                foreach (var item in queryResult)
                {
                    var likes = _context.ExecQuery(
                        Like.CountAllUsersWhoLikesABook(),
                        new DbParams { Name = "BookId", Value = item.id }
                    );
                    var likesCount = likes.First().likes_count;

                    books.Add(new BookDTO
                    {
                        Id = item.id,
                        Genre = item.genre,
                        Title = item.title,
                        Tagline = item.tagline,
                        Description = item.description,
                        CoverImgFileId = item.cover_img_file_id,
                        Views = item.views,
                        Likes = likesCount,
                        //Comments = item.comments,
                        UpdatedAt = item.updated_at,
                        CreatedAt = item.created_at
                    });
                }

                var result = GetAPIResult(books);
                return Ok(result);
            }
            catch (Exception e)
            {
                return HandleException(e);
            }
        }

        // like or unlike a book
        [HttpPost("like")]
        public IActionResult LikeOrUnlikeBook([FromBody] Like like)
        {
            try
            {
                int userId = Authenticate();
                int bookId = like.BookId;

                string message = "";

                var checkBook = _context.GetById<Book>(bookId);
                if (!checkBook.Any()) throw new BadRequestException("Book id not found");

                like.UserId = userId;
                var checkLike = _context.ExecQuery(
                    Like.CheckIfUserLikesBook(),
                    new DbParams { Name = "UserId", Value = userId },
                    new DbParams { Name = "BookId", Value = bookId }
                );

                if (!checkLike.Any())
                {
                    _context.Insert<Like>(like);
                    message = "liked";
                }
                else
                {
                    var likeId = checkLike.First().id;
                    _context.Delete<Like>(likeId);
                    message = "unliked";
                }

                return Ok(GetAPIResult(message));
            }
            catch (Exception e)
            {
                return HandleException(e);
            }
        }

        // get current user
        [HttpGet]
        public IActionResult GetCurrUser()
        {
            try
            {
                Authenticate();
                return this.GetByUsername(User.Identity!.Name!);
            }
            catch (Exception e)
            {
                return HandleException(e);
            }
        }

        // get user by username
        [HttpGet("{username}")]
        public IActionResult GetByUsername(string username)
        {
            try
            {
                var user = _context.ExecQuery(
                    Entities.User.GetByUsernameQuery(),
                    new DbParams { Name = "Username", Value = username, Type = "str" }
                );
                if (user == null || !user.Any()) throw new NotFoundException("Data not found");

                var userData = user.First();

                // remove password from the response body -- we want to keep it secret
                var userDTO = new UserDTO
                {
                    Id = userData.id,
                    Username = userData.username,
                    FirstName = userData.first_name,
                    LastName = userData.last_name,
                    ProfilePicBase64 = userData.base64,
                    CreatedAt = userData.created_at,
                    UpdatedAt = userData.updated_at
                };

                var result = GetAPIResult(userDTO);
                return Ok(result);
            }
            catch (Exception e)
            {
                return HandleException(e);
            }
        }


        [HttpPost("register")]
        public IActionResult Register([FromBody] User body)
        {
            try
            {
                // validate input
                body = Entities.User.Validate(body);
                var userData = _context.ExecQuery(
                    Entities.User.GetByUsernameQuery(),
                    new DbParams { Name = "Username", Value = body.Username!, Type = "str" }
                );
                if (userData.Any())
                    throw new BadRequestException("Username already in use");

                // hash password
                body.Password = _pwHasher.HashPassword(body, body.Password!);

                var data = _context.Insert<User>(body);

                // remove password from the response body -- we want to keep it secret
                var user = data.FirstOrDefault();
                var userDTO = new UserDTO
                {
                    Id = user!.Id,
                    Username = user.Username,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    CreatedAt = user.CreatedAt,
                    UpdatedAt = user.UpdatedAt
                };

                APIResult result = GetAPIResult(userDTO, 201);
                return Created(string.Empty, result);
            }
            catch (Exception e)
            {
                return HandleException(e);
            }
        }


        [HttpPost("login")]
        public IActionResult Login([FromBody] User userBody)
        {
            try
            {
                // check null
                var password = userBody.Password;
                var username = userBody.Username;
                if (username == null)
                {
                    throw new BadRequestException("Username is required");
                }
                else if (password == null)
                {
                    throw new BadRequestException("Password is required");
                }

                // check username
                var userData = _context.ExecQuery(
                    Entities.User.GetByUsernameQuery(),
                    new DbParams { Name = "Username", Value = username, Type = "str" }
                );
                if (userData.Count() == 0)
                    throw new BadRequestException("Incorrect username or password");

                // check password
                var userObj = userData.First();
                var verifResult = _pwHasher.VerifyHashedPassword(userBody, userObj.password, password);
                if (verifResult == PasswordVerificationResult.Failed)
                {
                    throw new BadRequestException("Incorrect username or password");
                }

                // generate token
                string userId = userObj.id.ToString();
                var token = GenerateToken(userId, username, userObj.first_name, userObj.last_name);
                var result = GetAPIResult(token);

                return Ok(result);
            }
            catch (Exception e)
            {
                return HandleException(e);
            }
        }


        [NonAction]
        private string GenerateToken(string userId, string username, string firstname, string lastname)
        {
            // firstly here, we've got a `Claim` type.
            // this is the data (username, password) that is sent after the user logins.
            // we know for sure that the data is 100% correct,
            // because that is already checked by the Login() method and therefore
            // this method will not be called if the input validation fails in Login().
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, userId),
                new Claim(ClaimTypes.Name, username),
                new Claim(ClaimTypes.Name, firstname),
                new Claim(ClaimTypes.Name, lastname)
            };

            // after we generate the claim data, we encode the data into a JWT.
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JWTSettings:TokenKey"]!));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

            var tokenOptions = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddDays(7),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(tokenOptions);
        }
    }
}
