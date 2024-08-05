using BookReaderAPI.DTOs;
using BookReaderAPI.Entities;

namespace BookReaderAPI.Extensions
{
    public static class DTOExtension
    {
        public static BookDTO ToDTO(this Book book, Int64 likes = 0, Int64 comments = 0)
        {
            return new BookDTO
            {
                Id = book.Id,
                Genre = book.Genre,
                Title = book.Title,
                Tagline = book.Tagline,
                Description = book.Description,
                CoverImgFileId = book.CoverImgFileId,
                Views = book.Views,
                Likes = likes,
                Comments = comments,
                CreatedAt = book.CreatedAt,
                UpdatedAt = book.UpdatedAt,
            };
        }

        public static ReadlistDTO ToDTO(this Readlist readlist, List<Book> books)
        {
            return new ReadlistDTO
            {
                Id = readlist.Id,
                UserId = readlist.UserId,
                Title = readlist.Title,
                Description = readlist.Description,
                CreatedAt = readlist.CreatedAt,
                UpdatedAt = readlist.UpdatedAt,
                Books = books
            };
        }

    }
}
