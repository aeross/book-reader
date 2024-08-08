using BookReaderAPI.Data;
using System.Data;

namespace BookReaderAPI.Entities
{
    public class Book : IEntity
    {
        public int Id { get; set; }
        public string? Genre { get; set; }
        public string? Title { get; set; }
        public string? Tagline { get; set; }
        public string? Description { get; set; }
        public int? CoverImgFileId { get; set; }
        public Int64? Views { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        static string IEntity.GetQuery()
        {
            return "SELECT * FROM public.books ORDER BY RANDOM() LIMIT 10";
        }

        static string IEntity.GetByIdQuery()
        {
            return "SELECT * FROM public.books WHERE id = @id";
        }

        static string IEntity.InsertQuery()
        {
            return @"
            INSERT INTO public.books(genre, title, tagline, description, ""views"", created_at, updated_at)
            VALUES (@Genre, @Title, @Tagline, @Description, 0, now(), now())
            RETURNING *;
            ";
        }

        /// <summary>
        /// can't update the cover_img_file_id here, use UpdateFile instead
        /// </summary>
        static string IEntity.UpdateQuery()
        {
            return @"
            UPDATE public.books
            SET genre = @Genre,
                title = @Title,
                tagline = @Tagline,
                description = @Description,
                updated_at = now()
            WHERE id = @id
            RETURNING *;
            ";
        }

        static string IEntity.DeleteQuery()
        {
            return "DELETE FROM public.books WHERE id = @id RETURNING *";
        }


        // non-standard CRUD queries

        /// <summary>
        /// params: @id int, @CoverImgFileId int
        /// </summary>
        public static string UpdateFile()
        {
            return @"
            UPDATE public.books
            SET cover_img_file_id = @CoverImgFileId,
                updated_at = now()
            WHERE id = @id
            RETURNING *;
            ";
        }

        /// <summary>
        /// params: @UserId int, @BookId int
        /// </summary>
        public static string InsertBookAuthor()
        {
            return @"
            INSERT INTO public.authors(user_id, book_id, created_at, updated_at)
            VALUES (@UserId, @BookId, now(), now());
            ";
        }

        /// <summary>
        /// params: @BookId int
        /// </summary>
        public static string GetBookAuthors()
        {
            return @"
            SELECT users.* FROM public.books 
                INNER JOIN public.authors ON books.id = authors.book_id
                INNER JOIN public.users ON authors.user_id = users.id
            WHERE books.id = @BookId;
            ";
        }

        /// <summary>
        /// params: @UserId int, @BookId int
        /// </summary>
        public static string CheckBookOwnedByAuthor()
        {
            return @"
            SELECT authors.* FROM public.books 
                INNER JOIN public.authors ON books.id = authors.book_id
            WHERE books.id = @BookId AND authors.user_id = @UserId;
            ";
        }

        /// <summary>
        /// params: @id int
        /// </summary>
        public static string IncrementViews()
        {
            return @"
            UPDATE public.books
            SET ""views"" = ""views"" + 1
            WHERE id = @id;
            ";
        }


        static dynamic IEntity.Create(IDataRecord record)
        {
            Book b = new Book
            {
                Id = (int)record["id"],
                Genre = DbContext.ConvertFromDBVal<string>(record["genre"]),
                Title = DbContext.ConvertFromDBVal<string>(record["title"]),
                Tagline = DbContext.ConvertFromDBVal<string>(record["tagline"]),
                Description = DbContext.ConvertFromDBVal<string>(record["description"]),
                CoverImgFileId = DbContext.ConvertFromDBVal<int>(record["cover_img_file_id"]),
                Views = DbContext.ConvertFromDBVal<Int64>(record["views"]),
                CreatedAt = DbContext.ConvertFromDBVal<DateTime>(record["created_at"]),
                UpdatedAt = DbContext.ConvertFromDBVal<DateTime>(record["updated_at"])
            };
            return b;
        }
    }
}
