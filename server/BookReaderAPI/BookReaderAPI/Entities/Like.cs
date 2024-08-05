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

        // non-standard CRUD queries

        /// <summary>
        /// params: @BookId int
        /// </summary>
        public static string GetAllUsersWhoLikesABook()
        {
            return @"
            SELECT users.* FROM public.books
                INNER JOIN public.likes ON books.id = likes.book_id
                INNER JOIN public.users ON users.id = likes.user_id
            WHERE books.id = @BookId;
            ";
        }

        /// <summary>
        /// params: @BookId int
        /// </summary>
        public static string CountAllUsersWhoLikesABook()
        {
            return @"
            SELECT COUNT(*) as likes_count FROM public.books
                INNER JOIN public.likes ON books.id = likes.book_id
                INNER JOIN public.users ON users.id = likes.user_id
            WHERE books.id = @BookId;
            ";
        }

        /// <summary>
        /// params: @Username string
        /// </summary>
        public static string GetAllLikedBooksByUser()
        {
            return @"
            SELECT books.* FROM public.books
                INNER JOIN public.likes ON books.id = likes.book_id
                INNER JOIN public.users ON users.id = likes.user_id
            WHERE users.username = @Username;
            ";
        }

        /// <summary>
        /// params: @Username string
        /// </summary>
        public static string CountAllLikedBooksByUser()
        {
            return @"
            SELECT COUNT(*) as likes_count FROM public.books
                INNER JOIN public.likes ON books.id = likes.book_id
                INNER JOIN public.users ON users.id = likes.user_id
            WHERE users.username = @Username;
            ";
        }

        /// <summary>
        /// params: @UserId int, @BookId int
        /// </summary>
        public static string CheckIfUserLikesBook()
        {
            return @"
            SELECT likes.* FROM public.books
                INNER JOIN public.likes ON books.id = likes.book_id
                INNER JOIN public.users ON users.id = likes.user_id
            WHERE users.id = @UserId AND books.id = @BookId;
            ";
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
