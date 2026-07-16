using BakimAPI.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BakimAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductHistoryController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductHistoryController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("{productId}")]
        public async Task<IActionResult> GetHistory(int productId)
        {
            var history = await _context.ProductHistories
                .Where(x => x.ProductId == productId)
                .OrderByDescending(x => x.Date)
                .ToListAsync();

            return Ok(history);
        }
    }
}