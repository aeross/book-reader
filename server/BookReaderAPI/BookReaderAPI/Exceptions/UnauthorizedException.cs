namespace BookReaderAPI.Exceptions
{
    public class UnauthorizedException : APIException
    {
        public UnauthorizedException(string message) : base(message)
        {
            this.ErrorCode = 401;
        }
    }
}
