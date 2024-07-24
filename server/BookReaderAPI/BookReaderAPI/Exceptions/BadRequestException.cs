using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace BookReaderAPI.Exceptions
{
    public class BadRequestException : APIException
    {
        public BadRequestException(string message) : base(message)
        {
            this.ErrorCode = 400;
        }
    }
}
