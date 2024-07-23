using BookReaderAPI.Data;
using BookReaderAPI.Entities;
using Microsoft.AspNetCore.Mvc;

namespace BookReaderAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ChapterController : ControllerBase
    {
        private DbContext _context;

        public ChapterController(IConfiguration config)
        {
            _context = new DbContext(config);
        }

        [HttpGet]
        public IEnumerable<dynamic> Get()
        {
            return _context.Get<Chapter>();
        }

        [HttpGet("{id}")]
        public IEnumerable<dynamic> GetById(int id)
        {
            return _context.GetById<Chapter>(id);
        }

        [HttpPost]
        public IEnumerable<dynamic> Insert([FromBody] Chapter c)
        {
            c = Chapter.Validate(c);
            return _context.Insert<Chapter>(c);
        }

        [HttpPut("{id}")]
        public IEnumerable<dynamic> Update(int id, [FromBody] Chapter c)
        {
            c = Chapter.Validate(c);
            return _context.Update<Chapter>(id, c);
        }

        [HttpDelete("{id}")]
        public IEnumerable<dynamic> Delete(int id)
        {
            return _context.Delete<Chapter>(id);
        }
    }
}
