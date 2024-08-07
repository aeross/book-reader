using BookReaderAPI.Data;
using BookReaderAPI.DTOs;
using BookReaderAPI.Entities;
using BookReaderAPI.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace BookReaderAPI.Controllers
{
    public class ReadlistController : APIController
    {
        public ReadlistController(IConfiguration config) : base(config) { }

        [HttpGet]
        public IActionResult Get(int id)
        {
            try
            {
                int userId = Authenticate();

                // get readlist
                var data = _context.ExecQuery(
                    Readlist.GetReadlists(),
                    new DbParams { Name = "Username", Value = User.Identity!.Name, Type = "string" }
                );

                List<ReadlistDTO> output = [];
                foreach (var readlist in data)
                {
                    // get booklist
                    data = _context.ExecQuery(
                        Readlist.GetAllBooksInAReadlist(),
                        new DbParams { Name = "ReadlistId", Value = readlist.id, Type = "int" }
                    );

                    // convert to DTO
                    List<Book> books = [];
                    foreach (var book in data)
                    {
                        books.Add(new Book
                        {
                            Id = book.id,
                            Genre = book.genre,
                            Title = book.title,
                            Tagline = book.tagline,
                            Description = book.description,
                            CoverImgFileId = book.cover_img_file_id,
                            Views = book.views,
                            CreatedAt = book.created_at,
                            UpdatedAt = book.updated_at,
                        });
                    }

                    var readlistDTO = new ReadlistDTO
                    {
                        Id = readlist.id,
                        UserId = readlist.user_id,
                        Title = readlist.title,
                        Description = readlist.description,
                        CreatedAt = readlist.created_at,
                        UpdatedAt = readlist.updated_at,
                        Books = books
                    };
                    output.Add(readlistDTO);
                }

                var result = GetAPIResult(output);
                return Ok(result);
            }
            catch (Exception e)
            {
                return HandleException(e);
            }
        }

        [HttpGet("{username}")]
        public IActionResult GetById(string username)
        {
            try
            {
                var data = _context.ExecQuery(
                    Readlist.GetReadlists(),
                    new DbParams { Name = "Username", Value = username }
                );

                List<ReadlistDTO> output = [];
                foreach (var readlist in data)
                {
                    // get booklist
                    data = _context.ExecQuery(
                        Readlist.GetAllBooksInAReadlist(),
                        new DbParams { Name = "ReadlistId", Value = readlist.id, Type = "int" }
                    );

                    // convert to DTO
                    List<Book> books = [];
                    foreach (var book in data)
                    {
                        books.Add(new Book
                        {
                            Id = book.id,
                            Genre = book.genre,
                            Title = book.title,
                            Tagline = book.tagline,
                            Description = book.description,
                            CoverImgFileId = book.cover_img_file_id,
                            Views = book.views,
                            CreatedAt = book.created_at,
                            UpdatedAt = book.updated_at,
                        });
                    }

                    var readlistDTO = new ReadlistDTO
                    {
                        Id = readlist.id,
                        UserId = readlist.user_id,
                        Title = readlist.title,
                        Description = readlist.description,
                        CreatedAt = readlist.created_at,
                        UpdatedAt = readlist.updated_at,
                        Books = books
                    };
                    output.Add(readlistDTO);
                }

                var result = GetAPIResult(output);
                return Ok(result);
            }
            catch (Exception e)
            {
                return HandleException(e);
            }
        }

        [HttpPost]
        public IActionResult Insert([FromBody] Readlist body)
        {
            try
            {
                var userId = Authenticate();
                body.UserId = userId;

                var data = _context.Insert<Readlist>(body);

                var result = GetAPIResult(data, 201);
                return Created(string.Empty, result);
            }
            catch (Exception e)
            {
                return HandleException(e);
            }
        }

        [HttpPost("add-book")]
        public IActionResult AddBookToReadlist([FromBody] Booklist body)
        {
            try
            {
                int userId = Authenticate();
                AuthorizeReadlistOwner(userId, body.ReadlistId);

                var checkBook = _context.GetById<Book>(body.BookId);
                if (!checkBook.Any()) throw new NotFoundException("Book not found");

                var book = _context.ExecQuery(
                    Booklist.CheckBookInReadlist(),
                    new DbParams { Name = "ReadlistId", Value = body.ReadlistId },
                    new DbParams { Name = "BookId", Value = body.BookId }
                );
                if (book.Any()) throw new BadRequestException("Book already exists in this readlist");
                _context.Insert(body);

                return Ok(GetAPIResult("Book added"));
            }
            catch (Exception e)
            {
                return HandleException(e);
            }
        }

        [HttpDelete("delete-book")]
        public IActionResult DeleteBookFromReadlist([FromBody] Booklist body)
        {
            try
            {
                int userId = Authenticate();
                AuthorizeReadlistOwner(userId, body.ReadlistId);

                var deletedBook = _context.ExecQuery(
                    Booklist.DeleteBookFromReadlist(), 
                    new DbParams { Name = "ReadlistId", Value = body.ReadlistId },
                    new DbParams { Name = "BookId", Value = body.BookId }
                );
                if (!deletedBook.Any()) throw new BadRequestException("Book not found in readlist");

                return Ok(GetAPIResult("Book deleted"));
            }
            catch (Exception e)
            {
                return HandleException(e);
            }
        }
    }
}
