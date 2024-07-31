using System.Data;

namespace BookReaderAPI.Data
{
    public class DbParams
    {
        public required string Name { get; set; }
        public dynamic? Value { get; set; }

        /// <summary>
        /// The type can only be one of these four: 
        /// string, int, bool, or decmial. 
        /// If the type is null, then Value will be whatever the dynamic type set on runtime will be.
        /// </summary>
        public string? Type { get; set; }
    }
}
