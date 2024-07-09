using System.Data;

namespace BookReaderAPI.Entities
{
    public class Book
    {
        public int Id { get; set; }
        public string? Genre { get; set; }
        public required string Title { get; set; }
        public string? Tagline { get; set; }
        public string? Description { get; set; }

        public static string GetQuery()
        {
            return "SELECT * FROM public.books";
        }

        public static string GetByIdQuery()
        {
            return "SELECT * FROM public.books WHERE id = @id";
        }

        public static string InsertQuery()
        {
            return @"
            INSERT INTO public.books(genre, title, tagline, description, cover_img_file_id, created_at, updated_at)
            VALUES (@genre, @title, @tagline, @description, @cover_img_file_id, now(), now());
            ";
        }

        public static string UpdateQuery()
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

        public static string DeleteQuery()
        {
            return "DELETE FROM public.books WHERE id = @id";
        }

        public static Book Create(IDataRecord record)
        {
            return new Book
            {
                Id = (int)record["id"],
                Genre = Entity.ConvertFromDBVal<string>(record["genre"]),
                Title = Entity.ConvertFromDBVal<string>(record["title"]),
                Tagline = Entity.ConvertFromDBVal<string>(record["tagline"]),
                Description = Entity.ConvertFromDBVal<string>(record["description"])
            };
        }
    }
}
