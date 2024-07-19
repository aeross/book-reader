using BookReaderAPI.Data;
using BookReaderAPI.Extensions;
using System.Data;

namespace BookReaderAPI.Entities
{
    public class Chapter : IEntity
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Content { get; set; }

        public int? NumOfWords 
        { 
            get => _numOfWords;
            set => _numOfWords = (string.IsNullOrWhiteSpace(Content)) ? 0 : Content.GetWordCount();
        }
        private int? _numOfWords;

        public string? Status { 
            get => _status;
            set
            {
                if (string.IsNullOrEmpty(value) || 
                    !(value.Equals("Draft") || value.Equals("Published")))
                {
                     throw new ArgumentException("'status' must be either 'Draft' or 'Published'");
                }
                _status = value;
            }
        }
        private string? _status;

        public int BookId { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        static string IEntity.GetQuery()
        {
            return "SELECT * FROM public.chapters";
        }

        static string IEntity.GetByIdQuery()
        {
            return "SELECT * FROM public.chapters WHERE id = @id";
        }

        static string IEntity.InsertQuery()
        {
            return @"
            INSERT INTO public.chapters(title, content, num_of_words, status, book_id, created_at, updated_at)
            VALUES (@Title, @Content, @NumOfWords, @Status, @BookId, now(), now())
            RETURNING *;
            ";
        }

        static string IEntity.UpdateQuery()
        {
            return @"
            UPDATE public.chapters
            SET title = @Title,
                content = @Content,
                num_of_words = @NumOfWords,
                status = @Status,
                book_id = @BookId,
                updated_at = now()
            WHERE id = @id
            RETURNING *;
            ";
        }

        static string IEntity.DeleteQuery()
        {
            return "DELETE FROM public.chapters WHERE id = @id RETURNING *";
        }


        static dynamic IEntity.Create(IDataRecord record)
        {
            return new Chapter
            {
                Id = (int)record["id"],
                Title = DbContext.ConvertFromDBVal<string>(record["title"]),
                Content = DbContext.ConvertFromDBVal<string>(record["content"]),
                NumOfWords = DbContext.ConvertFromDBVal<int>(record["num_of_words"]),
                Status = DbContext.ConvertFromDBVal<string>(record["status"]),
                BookId = (int)record["book_id"],
                CreatedAt = DbContext.ConvertFromDBVal<DateTime>(record["created_at"]),
                UpdatedAt = DbContext.ConvertFromDBVal<DateTime>(record["updated_at"])
            };
        }
    }
}
