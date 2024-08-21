using BookReaderAPI.Data;
using BookReaderAPI.Entities;
using BookReaderAPI.Exceptions;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Security.Claims;

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
            if (errorType.IsSubclassOf(typeof(APIException)))
            {
                var code = ((APIException)e).ErrorCode;
                return StatusCode(code, GetAPIResult(e.Message, code));
            }
            else
            {
                return StatusCode(500, GetAPIResult(e.Message + " Stack Trace " + e.StackTrace, 500));
            }
        }

        [NonAction]
        protected APIResult GetAPIResult(dynamic? data = null, int code = 200)
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

        /// <summary>
        /// Call this method at the very top when you need to protect an endpoint with authentication.
        /// </summary>
        /// <exception cref="UnauthorizedException"></exception>
        /// <returns>The authenticated user id.</returns>
        [NonAction]
        protected int Authenticate()
        {
            if (User.Identity == null) throw new UnauthorizedException("Invalid user identity");
            var identity = (ClaimsIdentity)User.Identity;

            bool isAuthd = identity.IsAuthenticated;
            if (!isAuthd) throw new UnauthorizedException("Invalid token");

            var claims = identity.Claims;
            var userId = claims.First(claim => claim.Type.Equals(ClaimTypes.NameIdentifier)).Value;
            return Convert.ToInt32(userId);
        }

        /// <summary>
        /// Checks whether the book with book id = bookId is owned by the user with user id = userId.
        /// </summary>
        /// <exception cref="NotFoundException"></exception>
        /// <exception cref="UnauthorizedException"></exception>
        [NonAction]
        protected Book AuthorizeBookAuthor(int userId, int bookId)
        {
            var book = _context.GetById<Book>(bookId);
            if (!book.Any()) throw new NotFoundException("Data not found");

            var ownsBook = _context.ExecQuery(
                Book.CheckBookOwnedByAuthor(),
                new DbParams { Name = "BookId", Value = bookId },
                new DbParams { Name = "UserId", Value = userId }
            );

            if (!ownsBook.Any())
            {
                throw new ForbiddenException("You have no access");
            }

            return book.First();
        }

        [NonAction]
        protected Readlist AuthorizeReadlistOwner(int userId, int readlistId)
        {
            var readlist = _context.GetById<Readlist>(readlistId);
            if (!readlist.Any()) throw new NotFoundException("Readlist not found");

            var ownsReadlist = _context.ExecQuery(
                Readlist.CheckReadlistOwnedByUser(),
                new DbParams { Name = "ReadlistId", Value = readlistId },
                new DbParams { Name = "UserId", Value = userId }
            );

            if (!ownsReadlist.Any())
            {
                throw new ForbiddenException("You have no access");
            }

            return readlist.First();
        }


        /// <summary>
        /// Gets the base64 value for a certain entity that has a file id.
        /// </summary>
        /// <param name="fileId">The file id.</param>
        /// <returns></returns>
        [NonAction]
        protected string GetBase64(int? fileId)
        {
            string base64 = "";
            if (fileId != null && fileId != 0)
            {
                var data = _context.GetById<Entities.File>(fileId ?? default);
                if (data.Any())
                {
                    Entities.File file = data.First();
                    base64 = file.Base64 ?? "";
                }
            }

            return base64;
        }
    }
}
