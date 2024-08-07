using BookReaderAPI.Data;
using BookReaderAPI.DTOs;
using BookReaderAPI.Entities;
using BookReaderAPI.Exceptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Buffers.Text;
using System.Security.Claims;

namespace BookReaderAPI.Controllers
{
    public class FileController : APIController
    {
        private IConfiguration _config;

        public FileController(IConfiguration config) : base(config)
        {
            _config = config;
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            try
            {
                var data = _context.GetById<Entities.File>(id);
                if (!data.Any()) throw new Exception("Data not found");

                var result = GetAPIResult(data);
                return Ok(result);
            }
            catch (Exception e)
            {
                return HandleException(e);
            }
        }

        /// <summary>
        /// Uploads profile pic file for the User entity.
        /// </summary>
        [HttpPost("user")]
        public IActionResult UploadsUser([FromBody] Entities.File fReq)
        {
            try
            {
                Authenticate();

                string base64 = fReq.Base64 ?? "";
                if (string.IsNullOrEmpty(base64)) throw new BadRequestException("Base64 is required");

                var userList = _context.ExecQuery(
                    Entities.User.GetByUsernameQuery(),
                    new DbParams { Name = "Username", Value = User.Identity!.Name!, Type = "str" }
                );
                var userData = userList.First();
                var user = new User
                {
                    Id = userData.id,
                    FirstName = userData.first_name,
                    LastName = userData.last_name,
                    ProfilePicFileId = userData.profile_pic_file_id
                };

                if (user.ProfilePicFileId == null || user.ProfilePicFileId == 0)
                {
                    var file = _context.Insert(new Entities.File { Base64 = base64 });
                    var fileId = (file.First() as Entities.File)!.Id;
                    user.ProfilePicFileId = fileId;

                    _context.Update(user.Id, user);
                }
                else
                {
                    int fileId = user.ProfilePicFileId ?? default;
                    _context.Update(fileId, new Entities.File { Base64 = base64 });
                }

                var result = GetAPIResult("File uploaded");
                return Ok(result);
            }
            catch (Exception e)
            {
                return HandleException(e);
            }
        }

        /// <summary>
        /// Uploads cover image file for the Book entity.
        /// </summary>
        [HttpPost("book/{bookId}")]
        public IActionResult UploadBook(int bookId, [FromBody] Entities.File fReq)
        {
            try
            {
                int userId = Authenticate();
                var book = AuthorizeBookAuthor(userId, bookId);

                string base64 = fReq.Base64 ?? "";
                if (string.IsNullOrEmpty(base64)) throw new BadRequestException("Base64 is required");

                if (book!.CoverImgFileId == null || book!.CoverImgFileId == 0)
                {
                    var file = _context.Insert(new Entities.File { Base64 = base64 });
                    var fileId = (file.First() as Entities.File)!.Id;

                    _context.ExecQuery(
                        Book.UpdateFile(), 
                        new DbParams { Name = "CoverImgFileId", Value = fileId });
                }
                else
                {
                    int fileId = book.CoverImgFileId ?? default;
                    _context.Update(fileId, new Entities.File { Base64 = base64 });
                }

                var result = GetAPIResult("File uploaded");
                return Ok(result);
            }
            catch (Exception e)
            {
                return HandleException(e);
            }
        }


        /// <summary>
        /// Deletes profile pic file from the User entity.
        /// </summary>
        [HttpDelete("user")]
        public IActionResult DeleteUser()
        {
            try
            {
                var userIdStr = Authenticate();
                string msgOutput = "File deleted";

                int userId = Convert.ToInt32(userIdStr);
                var userList = _context.GetById<User>(userId);
                User user = userList.First();

                if (user.ProfilePicFileId == null || user.ProfilePicFileId == 0)
                {
                    msgOutput = "Nothing to delete";
                }
                else
                {
                    int fileId = user.ProfilePicFileId ?? default;
                    user.ProfilePicFileId = null;

                    // delete from users first, bcs of FK constraint
                    _context.Update(userId, user);

                    // then from files
                    _context.Delete<Entities.File>(fileId);
                }

                var result = GetAPIResult(msgOutput);
                return Ok(result);
            }
            catch (Exception e)
            {
                return HandleException(e);
            }
        }

        /// <summary>
        /// Deletes cover image file for the Book entity.
        /// </summary>
        [HttpDelete("book/{bookId}")]
        public IActionResult DeleteBook(int bookId)
        {
            try
            {
                int userId = Authenticate();
                var book = AuthorizeBookAuthor(userId, bookId);
                string msgOutput = "File deleted";

                if (book!.CoverImgFileId == null || book!.CoverImgFileId == 0)
                {
                    msgOutput = "Nothing to delete";
                }
                else
                {
                    int fileId = book.CoverImgFileId ?? default;
                    book.CoverImgFileId = null;

                    // delete from books first, bcs of FK constraint
                    _context.ExecQuery(
                        Book.UpdateFile(),
                        new DbParams { Name = "CoverImgFileId", Value = null }
                    );

                    // then from files
                    _context.Delete<Entities.File>(fileId);
                }

                var result = GetAPIResult(msgOutput);
                return Ok(result);
            }
            catch (Exception e)
            {
                return HandleException(e);
            }
        }
    }
}
