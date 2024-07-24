namespace BookReaderAPI.Exceptions
{
    public class APIException : Exception
    {
        public int ErrorCode { get; protected set; } = 500;

        public APIException() : base() { }

        public APIException(string message) : base(message) { }
    }
}
