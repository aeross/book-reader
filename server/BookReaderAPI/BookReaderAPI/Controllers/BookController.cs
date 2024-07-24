using BookReaderAPI.Data;
using BookReaderAPI.Entities;
using BookReaderAPI.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace BookReaderAPI.Controllers
{
    public class BookController : APIController
    {
        public BookController(IConfiguration config) : base(config) { }

        [HttpGet]
        public IActionResult Get()
        {
            var data = _context.Get<Book>();
            var result = GetAPIResult(200, data);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            try
            {
                var data = _context.GetById<Book>(id);
                if (data.Count() == 0) throw new NotFoundException("Data not found");

                var result = GetAPIResult(200, data);
                return Ok(result);
            }
            catch (Exception e)
            {
                return HandleException(e);
            }
        }

        [HttpPost]
        public IActionResult Insert([FromBody] Book b)
        {
            try
            {
                var data = _context.Insert<Book>(b);

                var result = GetAPIResult(201, data);
                return Created(string.Empty, result);
            }
            catch (Exception e)
            {
                return HandleException(e);
            }
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Book b)
        {
            try
            {
                var data = _context.Update<Book>(id, b);

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
                var data = _context.Delete<Book>(id);
                if (data.Count() == 0) throw new NotFoundException("Data not found");

                var result = GetAPIResult(200, data);
                return Ok(result);
            }
            catch (Exception e)
            {
                return HandleException(e);
            }
        }
    }
}
