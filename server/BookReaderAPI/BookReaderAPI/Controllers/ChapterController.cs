using BookReaderAPI.Data;
using BookReaderAPI.DTOs;
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
        public IActionResult Insert([FromBody] Chapter body)
        {
            try
            {
                int userId = Authenticate();

                body = Chapter.Validate(body);
                AuthorizeBookAuthor(userId, body.BookId);

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
                int userId = Authenticate();

                var ch = _context.GetById<Chapter>(id);
                if (!ch.Any()) throw new NotFoundException("Data not found");

                AuthorizeBookAuthor(userId, ch.First().BookId);

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
                int userId = Authenticate();
                
                var ch = _context.GetById<Chapter>(id);
                if (!ch.Any()) throw new NotFoundException("Data not found");

                AuthorizeBookAuthor(userId, ch.First().BookId);

                var data = _context.Delete<Chapter>(id);

                var result = GetAPIResult(200, data);
                return Ok(result);
            }
            catch (Exception e)
            {
                return HandleException(e);
            }
        }


        [HttpGet("book/{bookId}")]
        public IActionResult GetAllChaptersInABook(int bookId)
        {
            try
            {
                var data = _context.ExecQuery(
                    Chapter.GetAllChaptersInABook(),
                    new DbParams { Name = "BookId", Value = bookId }
                );

                List<ChapterDTO> chapters = new();
                // serialize data to Chapter
                foreach (var item in data)
                {
                    chapters.Add(new ChapterDTO
                    {
                        Id = item.id,
                        Title = item.title,
                        NumOfWords = item.num_of_words,
                        Status = item.status,
                        BookId = item.book_id,
                        Ordering = item.ordering,
                        CreatedAt = item.created_at,
                        UpdatedAt = item.updated_at
                    });
                }

                var result = GetAPIResult(200, chapters);
                return Ok(result);
            }
            catch (Exception e)
            {
                return HandleException(e);
            }
        }
    }
}
