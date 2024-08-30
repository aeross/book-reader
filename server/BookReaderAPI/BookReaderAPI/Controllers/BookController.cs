using BookReaderAPI.Data;
using BookReaderAPI.DTOs;
using BookReaderAPI.Entities;
using BookReaderAPI.Exceptions;
using BookReaderAPI.Extensions;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.Net;
using System.Security.Claims;

namespace BookReaderAPI.Controllers
{
    public class BookController : APIController
    {
        public BookController(IConfiguration config) : base(config) { }


        [HttpGet]
        public IActionResult Get([FromQuery] string search = "", string sort = "", string filter = "",
            int page = 1, int limit = 5)
        {
            try
            {
                string query = Book.GetWithFilterQuery(ref search, sort, filter, page, limit);
                // execute query
                Console.WriteLine(query);
                var data = _context.ExecQuery(query,
                    new DbParams { Name = "Search", Value = search },
                    new DbParams { Name = "Filter", Value = filter });

                List<BookDTO> booksDTO = [];

                foreach (var book in data)
                {
                    string? base64 = null;
                    if (book.cover_img_file_id != null)
                    {
                        base64 = GetBase64((int)book.cover_img_file_id);
                    }
                    Console.WriteLine((string)book.id);

                    booksDTO.Add(new BookDTO
                    {
                        Id = book.id,
                        Genre = book.genre,
                        Title = book.title,
                        Tagline = book.tagline,
                        Description = book.description,
                        Views = book.views,
                        Likes = book.likes_count,
                        CoverImgFileId = book.cover_img_file_id,
                        CoverImgBase64 = base64,
                        CreatedAt = book.created_at,
                        UpdatedAt = book.updated_at,
                    });
                }

                var result = GetAPIResult(booksDTO);
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
                var data = _context.GetById<Book>(id);
                if (!data.Any()) throw new NotFoundException("Data not found");

                var likes = _context.ExecQuery(
                    Like.CountAllUsersWhoLikesABook(),
                    new DbParams { Name = "BookId", Value = id }
                );
                Int64 likesCount = likes.First().likes_count;

                Book book = data.First();
                string base64 = GetBase64(book.CoverImgFileId);
                BookDTO bookDTO = book.ToDTO(coverImgBase64: base64, likes: likesCount);

                var result = GetAPIResult(bookDTO);
                return Ok(result);
            }
            catch (Exception e)
            {
                return HandleException(e);
            }
        }

        [HttpGet("random")]
        public IActionResult GetRandom()
        {
            try
            {
                var data = _context.Get<Book>();

                List<BookDTO> booksDTO = [];
                foreach (Book book in data)
                {
                    var likes = _context.ExecQuery(
                    Like.CountAllUsersWhoLikesABook(),
                    new DbParams { Name = "BookId", Value = book.Id }
                    );
                    Int64 likesCount = likes.First().likes_count;

                    string base64 = GetBase64(book.CoverImgFileId);

                    booksDTO.Add(book.ToDTO(coverImgBase64: base64, likes: likesCount));
                }

                var result = GetAPIResult(booksDTO);
                return Ok(result);
            }
            catch (Exception e)
            {
                return HandleException(e);
            }
        }

        [HttpPost]
        public IActionResult Insert([FromBody] Book body)
        {
            try
            {
                var userId = Authenticate();

                var data = _context.Insert<Book>(body);
                _context.ExecQuery(
                    Book.InsertBookAuthor(),
                    new DbParams { Name = "BookId", Value = data.First().Id.ToString(), Type = "int" },
                    new DbParams { Name = "UserId", Value = userId, Type = "int" }
                );

                var result = GetAPIResult(data, 201);
                return Created(string.Empty, result);
            }
            catch (Exception e)
            {
                return HandleException(e);
            }
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Book body)
        {
            try
            {
                int userId = Authenticate();
                AuthorizeBookAuthor(userId, id);

                var data = _context.Update<Book>(id, body);

                var result = GetAPIResult(data);
                return Ok(result);
            }
            catch (Exception e)
            {
                return HandleException(e);
            }
        }

        [HttpPatch("{id}")]
        public IActionResult AddViews(int id)
        {
            try
            {
                _context.ExecQuery(Book.IncrementViews(), new DbParams { Name = "id", Value = id });

                var result = GetAPIResult("Views added");
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
                Book bookToBeDeleted = AuthorizeBookAuthor(userId, id);

                // delete from authors
                _context.ExecQuery(
                    "DELETE FROM public.authors WHERE book_id = @id;",
                    new DbParams { Name = "id", Value = id }
                );

                // delete from likes
                _context.ExecQuery(
                    "DELETE FROM public.likes WHERE book_id = @id;",
                    new DbParams { Name = "id", Value = id }
                );

                // delete from booklists
                _context.ExecQuery(
                    "DELETE FROM public.booklists WHERE book_id = @id;",
                    new DbParams { Name = "id", Value = id }
                );

                // delete from books
                var data = _context.Delete<Book>(id);

                // delete from files
                if (!(bookToBeDeleted!.CoverImgFileId == null || bookToBeDeleted!.CoverImgFileId == 0))
                {
                    int fileId = bookToBeDeleted.CoverImgFileId ?? default;
                    _context.Delete<Entities.File>(fileId);
                }


                var result = GetAPIResult(data);
                return Ok(result);
            }
            catch (Exception e)
            {
                return HandleException(e);
            }
        }


        [HttpGet("get-authors/{bookId}")]
        public IActionResult GetBookAuthors(int bookId)
        {
            try
            {
                var authors = _context.ExecQuery(
                    Book.GetBookAuthors(),
                    new DbParams { Name = "BookId", Value = bookId });

                if (!authors.Any()) throw new NotFoundException("Data not found");

                // serialize to User objects
                List<UserDTO> users = new();
                foreach (var item in authors)
                {
                    string? base64 = null;
                    if (item.profile_pic_file_id != null)
                    {
                        base64 = GetBase64((int)item.profile_pic_file_id);
                    }
                    users.Add(new UserDTO
                    {
                        Id = item.id,
                        Username = item.username,
                        FirstName = item.first_name,
                        LastName = item.last_name,
                        ProfilePicBase64 = base64,
                        CreatedAt = item.created_at,
                        UpdatedAt = item.updated_at
                    });
                }

                return Ok(GetAPIResult(users));
            }
            catch (Exception e)
            {
                return HandleException(e);
            }
        }
    }
}
