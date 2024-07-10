using BookReaderAPI.Data;
using Npgsql;
using System.Data;
using System.Diagnostics;

namespace BookReaderAPI.Entities
{
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
