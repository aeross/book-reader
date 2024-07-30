using BookReaderAPI.Data;
using BookReaderAPI.Exceptions;
using System.Data;

namespace BookReaderAPI.Entities
{
    public class File : IEntity
    {
        public int Id { get; set; }
        public string? Base64 { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        static string IEntity.GetQuery()
        {
            return "SELECT * FROM public.files";
        }

        static string IEntity.GetByIdQuery()
        {
            return "SELECT * FROM public.files WHERE id = @id";
        }

        static string IEntity.InsertQuery()
        {
            return @"
            INSERT INTO public.files(base_64)
            VALUES (@Base64, now(), now())
            RETURNING *;
            ";
        }

        static string IEntity.UpdateQuery()
        {
            return @"
            UPDATE public.files
            SET base_64 = @Base64,
                updated_at = now()
            WHERE id = @id
            RETURNING *;
            ";
        }

        static string IEntity.DeleteQuery()
        {
            return "DELETE FROM public.files WHERE id = @id RETURNING *";
        }

        static dynamic IEntity.Create(IDataRecord record)
        {
            File b = new File
            {
                Id = (int)record["id"],
                Base64 = DbContext.ConvertFromDBVal<string>(record["base_64"]),
                CreatedAt = DbContext.ConvertFromDBVal<DateTime>(record["created_at"]),
                UpdatedAt = DbContext.ConvertFromDBVal<DateTime>(record["updated_at"])
            };
            return b;
        }
    }
}
