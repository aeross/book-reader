using BookReaderAPI.Data;
using BookReaderAPI.Entities;
using Microsoft.AspNetCore.Mvc;

namespace BookReaderAPI.Controllers
{
    public class BookController : APIController
    {
        public BookController(IConfiguration config) : base(config) { }

        [HttpGet]
        public IActionResult Get()
        {
            var result = _context.Get<Book>();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var result = _context.GetById<Book>(id);
            return Ok(result);
        }

        [HttpPost]
        public IActionResult Insert([FromBody] Book book)
        {
            var result = _context.Insert<Book>(book);
            return Created(string.Empty, result);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Book book)
        {
            var result = _context.Update<Book>(id, book);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var result = _context.Delete<Book>(id);
            return Ok(result);
        }
    }
}
