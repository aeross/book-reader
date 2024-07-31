using BookReaderAPI.Data;
using BookReaderAPI.DTOs;
using BookReaderAPI.Entities;
using BookReaderAPI.Exceptions;
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

                var result = GetAPIResult(200, data);
                return Ok(result);
            }
            catch (Exception e)
            {
                return HandleException(e);
            }
        }

        /// <summary>
        /// Uploads file for the User entity.
        /// </summary>
        [HttpPost("upload-user")]
        public IActionResult UploadUser([FromBody] string base64)
        {
            try
            {
                Authenticate();

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

                if (user.ProfilePicFileId == null)
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

                var result = GetAPIResult(200, "File uploaded");
                return Ok(result);
            }
            catch (Exception e)
            {
                return HandleException(e);
            }
        }

        /// <summary>
        /// Uploads file for the Book entity.
        /// </summary>
        [HttpPost("upload-book")]
        public IActionResult UploadBook(int id, string base64)
        {
            try
            {
                var bookList = _context.GetById<Book>(id);
                if (!bookList.Any()) throw new NotFoundException("Book not found");
                var book = bookList.First() as Book;

                if (book!.CoverImgFileId == null)
                {
                    var file = _context.Insert(new Entities.File { Base64 = base64 });
                    var fileId = (file.First() as Entities.File)!.Id;
                    book.CoverImgFileId = fileId;

                    _context.Update(book.Id, book);
                }
                else
                {
                    int fileId = book.CoverImgFileId ?? default;
                    _context.Update(fileId, new Entities.File { Base64 = base64 });
                }

                var result = GetAPIResult(200, "File uploaded");
                return Ok(result);
            }
            catch (Exception e)
            {
                return HandleException(e);
            }
        }
    }
}
