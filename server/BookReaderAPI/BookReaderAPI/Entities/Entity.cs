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

        public IEnumerable<Book> GetBooks()
        {

            using (NpgsqlConnection conn = GetConnection())
            {
                conn.Open();
                
                NpgsqlCommand cmd = new NpgsqlCommand("SELECT * FROM books", conn);
                NpgsqlDataReader dr = cmd.ExecuteReader();

                while (dr.Read())
                {
                    yield return Book.Create(dr);
                }

                conn.Close();
            }

        }
    }
}
