using Microsoft.AspNetCore.Mvc;

namespace BookReaderAPI.Exceptions
{
    public class NotFoundException : APIException
    {
        public NotFoundException(string message) : base(message)
        {
            this.ErrorCode = 404;
        }
    }
}
