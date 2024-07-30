using System.Data;

namespace BookReaderAPI.Data
{
    public class DbParams
    {
        public required string Name { get; set; }
        public required string Value { get; set; }

        /// <summary>
        /// The type can only be one of these four: 
        /// string, int, bool, or decmial. 
        /// Other than that, the value will default to string.
        /// </summary>
        public required string Type { get; set; }
    }
}
