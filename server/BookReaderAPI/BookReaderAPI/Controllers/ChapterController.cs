using BookReaderAPI.Data;
using BookReaderAPI.Entities;
using BookReaderAPI.Exceptions;
using Microsoft.AspNetCore.Mvc;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace BookReaderAPI.Controllers
{
    public class ChapterController : APIController
    {
        public ChapterController(IConfiguration config) : base(config) { }

        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                var data = _context.Get<Chapter>();
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
                var data = _context.GetById<Chapter>(id);
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
        public IActionResult Insert([FromBody] Chapter body)
        {
            try
            {
                body = Chapter.Validate(body);

                // enforce unique constraint
                string query = Chapter.GetByBookQuery();
                var chapter = _context.ExecQuery(
                    query,
                    new DbParams { Name = "BookId", Value = body.BookId.ToString(), Type = "int" },
                    new DbParams { Name = "Ordering", Value = body.Ordering.ToString(), Type = "int" }
                );

                if (chapter.Count() > 0) throw new BadRequestException("Duplicate value for (BookId, Ordering) is not allowed");

                var data = _context.Insert<Chapter>(body);

                var result = GetAPIResult(201, data);
                return Created(string.Empty, result);
            }
            catch (Exception e)
            {
                return HandleException(e);
            }
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Chapter body)
        {
            try
            {
                body = Chapter.Validate(body);
                var data = _context.Update<Chapter>(id, body);

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
                var data = _context.Delete<Chapter>(id);
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
