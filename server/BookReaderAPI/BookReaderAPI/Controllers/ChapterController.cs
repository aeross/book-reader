using BookReaderAPI.Data;
using BookReaderAPI.Entities;
using Microsoft.AspNetCore.Mvc;

namespace BookReaderAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ChapterController : APIController
    {

        public ChapterController(IConfiguration config) : base(config) { }

        [HttpGet]
        public IActionResult Get()
        {
            var result = _context.Get<Chapter>();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var result = _context.GetById<Chapter>(id);
            return Ok(result);
        }

        [HttpPost]
        public IActionResult Insert([FromBody] Chapter c)
        {
            try
            {
                c = Chapter.Validate(c);
                var result = _context.Insert<Chapter>(c);
                return Created(string.Empty, result);

            }
            catch (Exception e)
            {
                return HandleException(e);
            }
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Chapter c)
        {
            try
            {
                c = Chapter.Validate(c);
                var result = _context.Update<Chapter>(id, c);
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
            var result = _context.Delete<Chapter>(id);
            return Ok(result);
        }
    }
}
