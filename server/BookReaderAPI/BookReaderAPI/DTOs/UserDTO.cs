namespace BookReaderAPI.DTOs
{
    /// <summary>
    /// A DTO of the object User, which contains all fields except password.
    /// </summary>
    public class UserDTO
    {
        public int Id { get; set; }
        public string? Username { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public int? ProfilePicFileId { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
