﻿using BookReaderAPI.Entities;
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

        private NpgsqlConnection GetConnection()
        {
            string? config = _config.GetConnectionString("Default");
            if (config is not null)
            {
                return new NpgsqlConnection(config);
            }
            throw new Exception("Connection string not found");
        }

        /**
         * Converts data from db to a recognised .NET datatype (such as int, string, etc).
         * Handles null checks as well.
         */
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

        public IEnumerable<dynamic> Get<T>() where T : IEntity
        {
            using (NpgsqlConnection conn = GetConnection())
            {
                conn.Open();
                string query = T.GetQuery();

                NpgsqlCommand cmd = new NpgsqlCommand(query, conn);

                NpgsqlDataReader dr = cmd.ExecuteReader();
                while (dr.Read())
                {
                    yield return T.Create(dr);
                }

                conn.Close();
            }
        }


        public IEnumerable<dynamic> GetById<T>(int id) where T : IEntity
        {
            using (NpgsqlConnection conn = GetConnection())
            {
                conn.Open();
                string query = T.GetByIdQuery();

                NpgsqlCommand cmd = new NpgsqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@id", id);

                NpgsqlDataReader dr = cmd.ExecuteReader();
                while (dr.Read())
                {
                    yield return T.Create(dr);
                }

                conn.Close();
            }
        }

        public IEnumerable<dynamic> Insert<T>(T data) where T : IEntity
        {
            using (NpgsqlConnection conn = GetConnection())
            {
                conn.Open();
                string query = T.InsertQuery();

                NpgsqlCommand cmd = new NpgsqlCommand(query, conn);

                // loop through the properties and add them to params one by one
                foreach (var prop in typeof(T).GetProperties())
                {
                    // by convention, every entity has these three properties
                    // ignore them when inserting, as they will be handled automatically
                    if (prop.Name == "Id" || prop.Name == "CreatedAt" || prop.Name == "UpdatedAt") 
                        continue;

                    // we don't need to worry about each value's datatype --
                    // after all, it is specified by the generic type T's properties
                    var value = prop.GetValue(data);
                    if (value != null)
                    {
                        cmd.Parameters.AddWithValue("@" + prop.Name, value);
                    }
                    else
                    {
                        cmd.Parameters.AddWithValue("@" + prop.Name, DBNull.Value);
                    }
                }

                NpgsqlDataReader dr = cmd.ExecuteReader();
                while (dr.Read())
                {
                    yield return T.Create(dr);
                }

                conn.Close();
            }
        }

        //public IEnumerable<Book> GetBookById(int id)
        //{
        //    using (NpgsqlConnection conn = GetConnection())
        //    {
        //        conn.Open();

        //        NpgsqlCommand cmd = new NpgsqlCommand(Book.GetByIdQuery(), conn);
        //        cmd.Parameters.AddWithValue("@id", id);

        //        NpgsqlDataReader dr = cmd.ExecuteReader();
        //        while (dr.Read())
        //        {
        //            yield return Book.Create(dr);
        //        }

        //        conn.Close();
        //    }
        //}


        //public void InsertBook(Book book)
        //{
        //    using (NpgsqlConnection conn = GetConnection())
        //    {
        //        conn.Open();

        //        NpgsqlCommand cmd = new NpgsqlCommand(Book.InsertQuery(), conn);

        //        string? genre = book.Genre;
        //        string title = book.Title;
        //        string? tagline = book.Tagline;
        //        string? description = book.Description;
        //        cmd.Parameters.AddWithValue("@genre", genre == null ? DBNull.Value : genre);
        //        cmd.Parameters.AddWithValue("@title", title == null ? DBNull.Value : title);
        //        cmd.Parameters.AddWithValue("@tagline", tagline == null ? DBNull.Value : tagline);
        //        cmd.Parameters.AddWithValue("@description", description == null ? DBNull.Value : description);
        //        cmd.Parameters.AddWithValue("@cover_img_file_id", DBNull.Value);

        //        cmd.ExecuteReader();
        //        //while (dr.Read())
        //        //{
        //        //    yield return Book.Create(dr);
        //        //}

        //        conn.Close();
        //    }
        //}
    }
}
