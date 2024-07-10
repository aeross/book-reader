using BookReaderAPI.Data;
using System.Data;

namespace BookReaderAPI.Entities
{
    public class Book : Entity, IEntity
    {
        public int Id { get; set; }
        public string? Genre { get; set; }
        public required string Title { get; set; }
        public string? Tagline { get; set; }
        public string? Description { get; set; }

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
            VALUES (@genre, @title, @tagline, @description, @cover_img_file_id, now(), now());
            ";
        }

        static string IEntity.UpdateQuery()
        {
            return @"
            UPDATE public.books
            SET genre = @genre,
                title = @title,
                tagline = @tagline,
                description = @description,
                cover_img_file_id = @cover_img_file_id,
                updated_at = @now
            WHERE id = @id;
            ";
        }

        static string IEntity.DeleteQuery()
        {
            return "DELETE FROM public.books WHERE id = @id";
        }


        static dynamic IEntity.Create(IDataRecord record)
        {
            Book b = new Book
            {
                Id = (int)record["id"],
                Genre = DbContext.ConvertFromDBVal<string>(record["genre"]),
                Title = DbContext.ConvertFromDBVal<string>(record["title"]),
                Tagline = DbContext.ConvertFromDBVal<string>(record["tagline"]),
                Description = DbContext.ConvertFromDBVal<string>(record["description"])
            };
            return b;
        }
    }
}
