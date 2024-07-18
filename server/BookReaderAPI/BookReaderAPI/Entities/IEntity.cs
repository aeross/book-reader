using BookReaderAPI.Data;
using Npgsql;
using System.Data;
using System.Diagnostics;

namespace BookReaderAPI.Entities
{
    /**
     * Each entity should implement this interface.
     * Contains five basic CRUD methods as well as a method to convert the queried entity
     * into the class-defined entity in this application.
     */
    public interface IEntity
    {
        static abstract string GetQuery();
        static abstract string GetByIdQuery();
        static abstract string InsertQuery();
        static abstract string UpdateQuery();
        static abstract string DeleteQuery();
        static abstract dynamic Create(IDataRecord record);
    }
}
