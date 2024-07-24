using BookReaderAPI.Data;
using BookReaderAPI.Entities;
using Microsoft.AspNetCore.Mvc;

namespace BookReaderAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class BookController : APIController
    {

        public BookController(IConfiguration config) : base(config) { }

        [HttpGet]
        public IEnumerable<dynamic> Get()
        {
            return _context.Get<Book>();
        }

        [HttpGet("{id}")]
        public IEnumerable<dynamic> GetById(int id)
        {
            return _context.GetById<Book>(id);
        }

        [HttpPost]
        public IEnumerable<dynamic> Insert([FromBody] Book book)
        {
            return _context.Insert<Book>(book);
        }

        [HttpPut("{id}")]
        public IEnumerable<dynamic> Update(int id, [FromBody] Book book)
        {
            return _context.Update<Book>(id, book);
        }

        [HttpDelete("{id}")]
        public IEnumerable<dynamic> Delete(int id)
        {
            return _context.Delete<Book>(id);
        }
    }
}
