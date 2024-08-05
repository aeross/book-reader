using BookReaderAPI.Data;
using System.Data;

namespace BookReaderAPI.Entities
{
    public class Readlist : IEntity
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        static string IEntity.GetQuery()
        {
            return "SELECT * FROM public.readlists";
        }

        static string IEntity.GetByIdQuery()
        {
            return "SELECT * FROM public.readlists WHERE id = @id";
        }

        static string IEntity.InsertQuery()
        {
            return @"
                INSERT INTO public.readlists(
                    user_id, title, description, created_at, updated_at)
                VALUES (
                    @UserId, @Title, @Description, now(), now())
                RETURNING *;
                ";
        }

        static string IEntity.UpdateQuery()
        {
            return @"
                UPDATE public.readlists
                SET user_id = @UserId,
                    title = @Title,
                    description = @Description,
                    book_id = @BookId,
                    updated_at = now()
                WHERE id = @id
                RETURNING *;
                ";
        }

        static string IEntity.DeleteQuery()
        {
            return "DELETE FROM public.readlists WHERE id = @id RETURNING *";
        }

        // non-standard crud queries

        /// <summary>
        /// params: @Username string
        /// </summary>
        public static string GetReadlistByUser()
        {
            return @"
                SELECT books.* FROM public.books
                    INNER JOIN public.readlists ON readlists.book_id = books.id
                    INNER JOIN public.users ON readlists.user_id = users.id
                WHERE users.username = @Username;
                ";
        }

        

        static dynamic IEntity.Create(IDataRecord record)
        {
            return new Readlist
            {
                Id = (int)record["id"],
                UserId = (int)record["user_id"],
                Title = DbContext.ConvertFromDBVal<string>(record["title"]),
                Description = DbContext.ConvertFromDBVal<string>(record["description"]),
                CreatedAt = DbContext.ConvertFromDBVal<DateTime>(record["created_at"]),
                UpdatedAt = DbContext.ConvertFromDBVal<DateTime>(record["updated_at"])
            };
        }
    }
}
