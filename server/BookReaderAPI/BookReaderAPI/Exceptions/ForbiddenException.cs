namespace BookReaderAPI.Exceptions
{
    public class ForbiddenException : APIException
    {
        public ForbiddenException(string message) : base(message)
        {
            this.ErrorCode = 403;
        }
    }
}
