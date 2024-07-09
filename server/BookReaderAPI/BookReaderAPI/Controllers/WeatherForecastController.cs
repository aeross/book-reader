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

        private Entity _entity;

        public WeatherForecastController(IConfiguration config)
        {
            _entity = new Entity(config);
        }

        [HttpGet]
        public IEnumerable<Book> Get()
        {
            return _entity.GetBooks();
        }
    }
}
