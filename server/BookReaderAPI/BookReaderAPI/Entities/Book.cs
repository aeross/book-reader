using System.Data;

namespace BookReaderAPI.Entities
{
    public class Book
    {
        public int Id { get; set; }
        public string? Genre { get; set; }
        public required string Title { get; set; }
        public string? Tagline { get; set; }
        public string? Description { get; set; }

        public static Book Create(IDataRecord record)
        {
            return new Book
            {
                Id = (int)record["id"],
                Title = (string)record["title"]
            };
        }
    }
}
