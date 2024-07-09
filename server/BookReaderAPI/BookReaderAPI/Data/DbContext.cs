using BookReaderAPI.Entities;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using Npgsql;
using System;
using System.Dynamic;
using System.Numerics;
using System.Reflection.Metadata;
using System.Runtime.Intrinsics.X86;
using System.Threading.Tasks;

namespace BookReaderAPI.Data
{
    public class DbContext
    {
        private IConfiguration _config;

        public DbContext(IConfiguration config)
        {
            _config = config;
        }

        private string GetConnString()
        {
            string? config = _config.GetConnectionString("Default");
            if (config is not null)
            {
                return config;
            }
            throw new Exception("Connection string not found");
        }

        public NpgsqlDataReader ExecSQL(string query, NpgsqlTransaction? trans = null)
        {
            string connString = GetConnString();
            NpgsqlConnection conn = new NpgsqlConnection(connString);
            conn.Open();

            try
            {
                NpgsqlCommand cmd = new NpgsqlCommand(query, conn, trans);
                NpgsqlDataReader dr = cmd.ExecuteReader();

                trans?.Commit();
                return dr;
            }
            finally
            {
                conn.Close();
            }
        }
    }
}
