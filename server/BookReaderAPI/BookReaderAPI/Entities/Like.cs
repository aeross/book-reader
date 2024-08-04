using BookReaderAPI.Data;
using System.Data;

namespace BookReaderAPI.Entities
{
    public class Like : IEntity
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int BookId { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        static string IEntity.GetQuery()
        {
            return "SELECT * FROM public.likes";
        }

        static string IEntity.GetByIdQuery()
        {
            return "SELECT * FROM public.likes WHERE id = @id";
        }

        static string IEntity.InsertQuery()
        {
            return @"
                INSERT INTO public.likes(
                    user_id, book_id, created_at, updated_at)
                VALUES (
                    @UserId, @BookId, now(), now())
                RETURNING *;
                ";
        }

        static string IEntity.UpdateQuery()
        {
            return @"
                UPDATE public.likes
                SET user_id = @UserId,
                    book_id = @BookId,
                    updated_at = now()
                WHERE id = @id
                RETURNING *;
                ";
        }

        static string IEntity.DeleteQuery()
        {
            return "DELETE FROM public.likes WHERE id = @id RETURNING *";
        }

        static dynamic IEntity.Create(IDataRecord record)
        {
            return new Like
            {
                Id = (int)record["id"],
                UserId = (int)record["user_id"],
                BookId = (int)record["book_id"],
                CreatedAt = DbContext.ConvertFromDBVal<DateTime>(record["created_at"]),
                UpdatedAt = DbContext.ConvertFromDBVal<DateTime>(record["updated_at"])
            };
        }
    }

}
