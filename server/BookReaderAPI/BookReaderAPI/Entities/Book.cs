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
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        static string IEntity.GetQuery()
        {
            return "SELECT * FROM public.books";
        }

        static string IEntity.GetByIdQuery()
        {
            return "SELECT * FROM public.books WHERE id = @id";
        }

        static string IEntity.InsertQuery()
        {
            return @"
            INSERT INTO public.books(genre, title, tagline, description, cover_img_file_id, created_at, updated_at)
            VALUES (@Genre, @Title, @Tagline, @Description, @CoverImgFileId, now(), now())
            RETURNING *;
            ";
        }

        static string IEntity.UpdateQuery()
        {
            return @"
            UPDATE public.books
            SET genre = @Genre,
                title = @Title,
                tagline = @Tagline,
                description = @Description,
                cover_img_file_id = @CoverImgFileId,
                updated_at = now()
            WHERE id = @id
            RETURNING *;
            ";
        }

        static string IEntity.DeleteQuery()
        {
            return "DELETE FROM public.books WHERE id = @id RETURNING *";
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
                CreatedAt = DbContext.ConvertFromDBVal<DateTime>(record["created_at"]),
                UpdatedAt = DbContext.ConvertFromDBVal<DateTime>(record["updated_at"])
            };
            return b;
        }
    }
}
