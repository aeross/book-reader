using BookReaderAPI.Data;
using Npgsql;
using System.Diagnostics;

namespace BookReaderAPI.Entities
{
    public class Entity
    {
        private IConfiguration _config;
        public Entity(IConfiguration config)
        {
            _config = config;
        }

        private NpgsqlConnection GetConnection()
        {
            string? config = _config.GetConnectionString("Default");
            if (config is not null)
            {
                return new NpgsqlConnection(config);
            }
            throw new Exception("Connection string not found");
        }

        public static T ConvertFromDBVal<T>(object obj)
        {
            if (obj == null || obj == DBNull.Value)
            {
                return default; // returns the default value for the type
            }
            else
            {
                return (T)obj;
            }
        }


        public IEnumerable<Book> GetBooks()
        {
            using (NpgsqlConnection conn = GetConnection())
            {
                conn.Open();

                NpgsqlCommand cmd = new NpgsqlCommand(Book.GetQuery(), conn);

                NpgsqlDataReader dr = cmd.ExecuteReader();
                while (dr.Read())
                {
                    yield return Book.Create(dr);
                }

                conn.Close();
            }
        }

        public IEnumerable<Book> GetBookById(int id)
        {
            using (NpgsqlConnection conn = GetConnection())
            {
                conn.Open();

                NpgsqlCommand cmd = new NpgsqlCommand(Book.GetByIdQuery(), conn);
                cmd.Parameters.AddWithValue("@id", id);

                NpgsqlDataReader dr = cmd.ExecuteReader();
                while (dr.Read())
                {
                    yield return Book.Create(dr);
                }

                conn.Close();
            }
        }


        public void InsertBook(Book book)
        {
            using (NpgsqlConnection conn = GetConnection())
            {
                conn.Open();

                NpgsqlCommand cmd = new NpgsqlCommand(Book.InsertQuery(), conn);

                string? genre = book.Genre;
                string title = book.Title;
                string? tagline = book.Tagline;
                string? description = book.Description;
                cmd.Parameters.AddWithValue("@genre", genre == null ? DBNull.Value : genre);
                cmd.Parameters.AddWithValue("@title", title == null ? DBNull.Value : title);
                cmd.Parameters.AddWithValue("@tagline", tagline == null ? DBNull.Value : tagline);
                cmd.Parameters.AddWithValue("@description", description == null ? DBNull.Value : description);
                cmd.Parameters.AddWithValue("@cover_img_file_id", DBNull.Value);

                cmd.ExecuteReader();
                //while (dr.Read())
                //{
                //    yield return Book.Create(dr);
                //}

                conn.Close();
            }
        }
    }
}
