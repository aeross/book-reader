using BookReaderAPI.Data;
using BookReaderAPI.Entities;
using Microsoft.AspNetCore.Mvc;
using Npgsql;

namespace BookReaderAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private DbContext _context;

        public WeatherForecastController(IConfiguration config)
        {
            _context = new DbContext(config);
        }

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
            return _context.Insert(book);
        }

        [HttpPut("{id}")]
        public IEnumerable<dynamic> Update(int id, [FromBody] Book book)
        {
            return _context.Update(id, book);
        }

        //[HttpGet("{id}")]
        //public IEnumerable<Book> GetById(int id)
        //{
        //    return _context.GetBookById(id);
        //}

        //[HttpPost]
        //public IActionResult Insert([FromBody] Book book)
        //{
        //    _context.InsertBook(book);
        //    return Created();
        //}
    }
}
