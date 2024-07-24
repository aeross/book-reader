using BookReaderAPI.Data;
using BookReaderAPI.Exceptions;
using BookReaderAPI.Extensions;
using System.Data;

namespace BookReaderAPI.Entities
{
    public class Chapter : IEntity
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Content { get; set; }
        public int? NumOfWords { get; set; }
        public string? Status { get; set; }
        public int BookId { get; set; }
        public int Ordering { get; set; }
        public string? Type {  get; set; }
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
            INSERT INTO public.chapters(title, content, num_of_words, status,
                book_id, ordering, type, created_at, updated_at)
            VALUES (@Title, @Content, @NumOfWords, @Status, 
                @BookId, @Ordering, @Type, now(), now())
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
                ordering = @Ordering,
                type = @Type,
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
            var test = record["num_of_words"];

            return new Chapter
            {
                Id = (int)record["id"],
                Title = DbContext.ConvertFromDBVal<string>(record["title"]),
                Content = DbContext.ConvertFromDBVal<string>(record["content"]),
                NumOfWords = DbContext.ConvertFromDBVal<int>(record["num_of_words"]),
                Status = DbContext.ConvertFromDBVal<string>(record["status"]),
                BookId = (int)record["book_id"],
                Ordering = (int)record["ordering"],
                Type = DbContext.ConvertFromDBVal<string>(record["type"]),
                CreatedAt = DbContext.ConvertFromDBVal<DateTime>(record["created_at"]),
                UpdatedAt = DbContext.ConvertFromDBVal<DateTime>(record["updated_at"])
            };
        }

        public static Chapter Validate(Chapter c)
        {
            try
            {
                c.NumOfWords = (string.IsNullOrWhiteSpace(c.Content)) ? 0 : c.Content.GetWordCount();
                
                if (string.IsNullOrEmpty(c.Status) ||
                        !(c.Status.Equals("Draft") || c.Status.Equals("Published")))
                {
                    throw new BadRequestException("'status' must be either 'Draft' or 'Published'");
                }

                if (string.IsNullOrEmpty(c.Type))
                {
                    c.Type = "Text";
                }
                else if (!(c.Type.Equals("Text") || c.Type.Equals("Markdown")))
                {
                    throw new BadRequestException("'status' must be either 'Text' or 'Markdown'");
                }

                throw new IndexOutOfRangeException();

                return c;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
