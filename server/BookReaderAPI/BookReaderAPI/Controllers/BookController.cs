using BookReaderAPI.Data;
using BookReaderAPI.Entities;
using BookReaderAPI.Exceptions;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Security.Claims;

namespace BookReaderAPI.Controllers
{
    public class BookController : APIController
    {
        public BookController(IConfiguration config) : base(config) { }

        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                var data = _context.Get<Book>();
                var result = GetAPIResult(200, data);
                return Ok(result);
            }
            catch (Exception e)
            {
                return HandleException(e);
            }
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            try
            {
                var data = _context.GetById<Book>(id);
                if (!data.Any()) throw new NotFoundException("Data not found");

                var result = GetAPIResult(200, data);
                return Ok(result);
            }
            catch (Exception e)
            {
                return HandleException(e);
            }
        }

        [HttpPost]
        public IActionResult Insert([FromBody] Book body)
        {
            try
            {
                var userId = Authenticate();

                var data = _context.Insert<Book>(body);
                _context.ExecQuery(
                    Book.InsertBookAuthor(),
                    new DbParams { Name = "BookId", Value = data.First().Id.ToString(), Type = "int" },
                    new DbParams { Name = "UserId", Value = userId, Type = "int" }
                );

                var result = GetAPIResult(201, data);
                return Created(string.Empty, result);
            }
            catch (Exception e)
            {
                return HandleException(e);
            }
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Book body)
        {
            try
            {
                AuthorizeBookAuthor(id);

                var data = _context.Update<Book>(id, body);

                var result = GetAPIResult(200, data);
                return Ok(result);
            }
            catch (Exception e)
            {
                return HandleException(e);
            }
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            try
            {
                AuthorizeBookAuthor(id);

                var data = _context.Delete<Book>(id);

                var result = GetAPIResult(200, data);
                return Ok(result);
            }
            catch (Exception e)
            {
                return HandleException(e);
            }
        }


        [HttpGet("authors/{bookId}")]
        public IActionResult GetBookAuthors(int bookId)
        {
            try
            {
                var authors = _context.ExecQuery(
                    Book.GetBookAuthors(),
                    new DbParams { Name = "BookId", Value = bookId });

                if (!authors.Any()) throw new NotFoundException("Data not found");

                return Ok(GetAPIResult(200, authors));
            }
            catch (Exception e)
            {
                return HandleException(e);
            }
        }
    }
}
