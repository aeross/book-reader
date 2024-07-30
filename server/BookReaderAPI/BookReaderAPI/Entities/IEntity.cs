using BookReaderAPI.Data;
using Npgsql;
using System.Data;
using System.Diagnostics;
using static System.Net.Mime.MediaTypeNames;

namespace BookReaderAPI.Entities
{
    /// <summary> 
    /// Each entity should implement this interface. 
    /// Contains five basic CRUD methods as well as a method to convert 
    /// the queried entity into the class-defined entity in this application.
    /// </summary>
    public interface IEntity
    {
        static abstract string GetQuery();
        static abstract string GetByIdQuery();
        static abstract string InsertQuery();
        static abstract string UpdateQuery();
        static abstract string DeleteQuery();
        /// <summary>
        /// Instantiates a new entity object.
        /// </summary>
        /// <param name="record">The record value obtained from the database's query result.</param>
        /// <returns>The instantiated entity object.</returns>
        static abstract dynamic Create(IDataRecord record);
    }
}
