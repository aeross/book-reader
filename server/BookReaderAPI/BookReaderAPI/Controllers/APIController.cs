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
                return BadRequest(GetAPIResult(400, e.Message));
            }
            else if (errorType.Equals(typeof(NotFoundException)))
            {
                return NotFound(GetAPIResult(404, e.Message));
            }

            return StatusCode(500, GetAPIResult(500, e.Message));
        }

        [NonAction]
        protected APIResult GetAPIResult(int code, dynamic? data = null)
        {
            string message = code switch
            {
                200 => "Success",
                201 => "Created",
                204 => "No Content",
                400 => "Bad Request",
                401 => "Unauthorized",
                403 => "Forbidden",
                404 => "Not Found",
                405 => "Method Not Allowed",
                500 => "Internal Server Error",
                _ => throw new ArgumentException("Invalid status code"),
            };
            return new APIResult(code, message, data);
        }
    }
}
