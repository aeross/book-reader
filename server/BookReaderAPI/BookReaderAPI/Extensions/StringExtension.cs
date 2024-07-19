namespace BookReaderAPI.Extensions
{
    public static class StringExtension
    {
        public static int GetWordCount(this string text)
        {
            char[] delimiters = new char[] { ' ', '\r', '\n' };
            return text.Split(delimiters, StringSplitOptions.RemoveEmptyEntries).Length;
        }
    }
}
