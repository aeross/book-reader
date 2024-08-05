using BookReaderAPI.Entities;

namespace BookReaderAPI.DTOs
{
    public class ReadlistDTO
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public List<Book> Books { get; set; } = [];
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
