using BookReaderAPI.Data;
using System.Data;

namespace BookReaderAPI.Entities
{
    public class Booklist : IEntity
    {
        public int Id { get; set; }
        public int ReadlistId { get; set; }
        public int BookId { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        static string IEntity.GetQuery()
        {
            return "SELECT * FROM public.booklists";
        }

        static string IEntity.GetByIdQuery()
        {
            return "SELECT * FROM public.booklists WHERE id = @id";
        }

        static string IEntity.InsertQuery()
        {
            return @"
                INSERT INTO public.booklists (readlist_id, book_id, created_at, updated_at)
                VALUES (@ReadlistId, @BookId, now(), now());
                ";
        }

        static string IEntity.UpdateQuery()
        {
            return @"
                UPDATE public.booklists
                SET updated_at = now()
                WHERE id = @id
                RETURNING *;
                ";
        }

        static string IEntity.DeleteQuery()
        {
            return "DELETE FROM public.booklists WHERE id = @id RETURNING *";
        }

        // non-standard crud queries
        /// <summary>
        /// params: @ReadlistId int, @BookId int
        /// </summary>
        public static string CheckBookInReadlist()
        {
            return @"
                SELECT * FROM public.booklists 
                WHERE readlist_id = @ReadlistId AND book_id = @BookId;
                ";
        }

        /// <summary>
        /// params: @ReadlistId int, @BookId int
        /// </summary>
        public static string DeleteBookFromReadlist()
        {
            return @"
                DELETE FROM public.booklists
                WHERE readlist_id = @ReadlistId AND book_id = @BookId
                RETURNING *;
                ";
        }

        static dynamic IEntity.Create(IDataRecord record)
        {
            return new Booklist
            {
                Id = (int)record["id"],
                ReadlistId = (int)record["readlist_id"],
                BookId = (int)record["book_id"],
                CreatedAt = DbContext.ConvertFromDBVal<DateTime>(record["created_at"]),
                UpdatedAt = DbContext.ConvertFromDBVal<DateTime>(record["updated_at"])
            };
        }
    }
}
