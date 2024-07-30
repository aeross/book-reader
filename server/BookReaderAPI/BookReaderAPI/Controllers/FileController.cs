using BookReaderAPI.Entities;
using BookReaderAPI.Exceptions;
using Microsoft.AspNetCore.Mvc;
using System.Buffers.Text;

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
                if (data.Count() == 0) throw new Exception("Data not found");

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
        public IActionResult UploadUser(int id, string base64)
        {
            try
            {
                // upload file for user
                // if the file already exists, replace it
                

                var result = GetAPIResult(200);
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
                if (bookList.Count() == 0) throw new NotFoundException("Book not found");
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

                var result = GetAPIResult(200, "Updated");
                return Ok(result);
            }
            catch (Exception e)
            {
                return HandleException(e);
            }
        }
    }
}
