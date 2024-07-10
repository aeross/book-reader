using System.Data;

namespace BookReaderAPI.Entities
{
    public abstract class Entity
    {
        public static string GetQuery<T>() where T : IEntity
        {
            return T.GetQuery();
        }

        public static string GetByIdQuery<T>() where T : IEntity
        {
            return T.GetByIdQuery();
        }

        public static string InsertQuery<T>() where T : IEntity
        {
            return T.InsertQuery();
        }

        public static string UpdateQuery<T>() where T : IEntity
        {
            return T.UpdateQuery();
        }

        public static string DeleteQuery<T>() where T : IEntity
        {
            return T.DeleteQuery();
        }

        public static dynamic Create<T>(IDataRecord record) where T : IEntity
        {
            return T.Create(record);
        }
    }
}
