using BookReaderAPI.Data;
using BookReaderAPI.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace BookReaderAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class APIController : ControllerBase
    {
        protected DbContext _context;

        public APIController(IConfiguration config)
        {
            _context = new DbContext(config);
        }

        [NonAction]
        protected IActionResult HandleException(Exception e)
        {
            Console.WriteLine(e);

            var errorType = e.GetType();
            if (errorType.Equals(typeof(BadRequestException)))
            {
                return BadRequest(e.Message);
            }

            return StatusCode(500, e.Message);
        }
    }
}
