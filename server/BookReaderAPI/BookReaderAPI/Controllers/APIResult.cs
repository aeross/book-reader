namespace BookReaderAPI.Controllers
{
    public class APIResult
    {
        public int StatusCode { get; set; }
        public string Message { get; set; }
        public dynamic? Data { get; set; }

        public APIResult(int code, string message, dynamic? data = null)
        {
            this.StatusCode = code;
            this.Message = message;
            if (data != null) this.Data = data;
        }
    }
}
