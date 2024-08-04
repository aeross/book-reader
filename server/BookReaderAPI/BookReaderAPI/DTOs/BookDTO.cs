namespace BookReaderAPI.DTOs
{
    public class BookDTO
    {
        public int Id { get; set; }
        public string? Genre { get; set; }
        public string? Title { get; set; }
        public string? Tagline { get; set; }
        public string? Description { get; set; }
        public int? CoverImgFileId { get; set; }
        public Int64? Views { get; set; }
        public int Likes { get; set; } = 0;
        public int Comments { get; set; } = 0;
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
