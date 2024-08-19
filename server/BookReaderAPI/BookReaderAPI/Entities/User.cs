using BookReaderAPI.Data;
using BookReaderAPI.Exceptions;
using BookReaderAPI.Extensions;
using System.Data;

namespace BookReaderAPI.Entities
{
    public class User : IEntity
    {
        public int Id { get; set; }
        public string? Username { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Password { get; set; }
        public int? ProfilePicFileId { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        static string IEntity.GetQuery()
        {
            return "SELECT * FROM public.users";
        }

        static string IEntity.GetByIdQuery()
        {
            return "SELECT * FROM public.users WHERE id = @id";
        }

        static string IEntity.InsertQuery()
        {
            return @"
            INSERT INTO public.users(username, first_name, last_name, password, profile_pic_file_id, created_at, updated_at)
            VALUES (@Username, @FirstName, @LastName, @Password, @ProfilePicFileId, now(), now())
            RETURNING *;
            ";
        }

        static string IEntity.UpdateQuery()
        {
            return @"
            UPDATE public.users
            SET first_name = @FirstName,
                last_name = @LastName,
                profile_pic_file_id = @ProfilePicFileId,
                updated_at = now()
            WHERE id = @id
            RETURNING *;
            ";
        }

        static string IEntity.DeleteQuery()
        {
            return "DELETE FROM public.users WHERE id = @id RETURNING *";
        }

        // non-standard crud queries

        /// <summary>
        /// params: @Username str
        /// </summary>
        public static string GetByUsernameQuery()
        {
            return @"SELECT users.*, files.base_64 AS base64 
            FROM public.users INNER JOIN public.files ON users.profile_pic_file_id = files.id
            WHERE username = @Username
            ";
        }

        /// <summary>
        /// params: @UserId int
        /// </summary>
        public static string GetAuthoredBooks()
        {
            return @"
            SELECT books.* FROM public.books 
                INNER JOIN public.authors ON books.id = authors.book_id
                INNER JOIN public.users ON authors.user_id = users.id
            WHERE users.username = @Username;
            ";
        }

        static dynamic IEntity.Create(IDataRecord record)
        {
            User b = new User
            {
                Id = (int)record["id"],
                Username = DbContext.ConvertFromDBVal<string>(record["username"]),
                FirstName = DbContext.ConvertFromDBVal<string>(record["first_name"]),
                LastName = DbContext.ConvertFromDBVal<string>(record["last_name"]),
                Password = DbContext.ConvertFromDBVal<string>(record["password"]),
                ProfilePicFileId = DbContext.ConvertFromDBVal<int>(record["profile_pic_file_id"]),
                CreatedAt = DbContext.ConvertFromDBVal<DateTime>(record["created_at"]),
                UpdatedAt = DbContext.ConvertFromDBVal<DateTime>(record["updated_at"])
            };
            return b;
        }

        public static User Validate(User user)
        {
            try
            {
                if (user.Username == null || string.IsNullOrWhiteSpace(user.Username)) 
                    throw new BadRequestException("Username must not be empty");

                if (user.FirstName == null || string.IsNullOrWhiteSpace(user.FirstName))
                    throw new BadRequestException("First name must not be empty");

                if (user.LastName == null || string.IsNullOrWhiteSpace(user.LastName))
                    throw new BadRequestException("Last name must not be empty");

                if (user.Password == null || string.IsNullOrWhiteSpace(user.Password))
                    throw new BadRequestException("Password must not be empty");

                if (user.Password.Length < 5)
                    throw new BadRequestException("Password must at least be 5 characters");

                return user;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}

