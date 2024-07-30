using BookReaderAPI.Data;
using BookReaderAPI.DTOs;
using BookReaderAPI.Entities;
using BookReaderAPI.Exceptions;
using Microsoft.AspNetCore.Authorization;
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
                if (user == null || user.Count() == 0) throw new NotFoundException("Data not found");

                var userData = user.First();

                // remove password from the response body -- we want to keep it secret
                var userDTO = new UserDTO
                {
                    Id = userData.id,
                    Username = userData.username,
                    FirstName = userData.first_name,
                    LastName = userData.last_name,
                    ProfilePicFileId = userData.profile_pic_file_id,
                    CreatedAt = userData.created_at,
                    UpdatedAt = userData.updated_at
                };

                var result = GetAPIResult(200, userDTO);
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
                if (userData.Count() > 0)
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
                    ProfilePicFileId = user.ProfilePicFileId,
                    CreatedAt = user.CreatedAt,
                    UpdatedAt = user.UpdatedAt
                };

                APIResult result = GetAPIResult(201, userDTO);
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
                var token = GenerateToken(username, userObj.first_name, userObj.last_name);
                var result = GetAPIResult(200, token);

                return Ok(result);
            }
            catch (Exception e)
            {
                return HandleException(e);
            }
        }


        [NonAction]
        private string GenerateToken(string username, string firstname, string lastname)
        {
            // firstly here, we've got a `Claim` type.
            // this is the data (username, password) that is sent after the user logins.
            // we know for sure that the data is 100% correct,
            // because that is already checked by the Login() method and therefore
            // this method will not be called if the input validation fails in Login().
            var claims = new List<Claim>
            {
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
