using BookReaderAPI.Entities;

namespace BookReaderAPI.DTOs
{
    /// <summary>
    /// A DTO for Chapter entity. Contains all fields except the content.
    /// </summary>
    public class ChapterDTO
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public int? NumOfWords { get; set; }
        public string? Status { get; set; }
        public int BookId { get; set; }
        public int Ordering { get; set; }
        public string? Type { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
