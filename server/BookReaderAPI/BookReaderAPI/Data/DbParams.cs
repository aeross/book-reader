using System.Data;

namespace BookReaderAPI.Data
{
    public class DbParams
    {
        public required string Name { get; set; }
        public required string Value { get; set; }

        // the type can only be one of these four:
        // String, Integer, Boolean, Decmial
        // other than that, the value will default to string
        public required string Type { get; set; }
    }
}
