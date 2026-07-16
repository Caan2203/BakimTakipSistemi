using BakimAPI.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BakimAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UrunGecmisiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UrunGecmisiController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("urun/{urunId}")]
        public async Task<IActionResult> Getir(int urunId)
        {
            var gecmis = await _context.ProductHistories
                .Where(x => x.ProductId == urunId)
                .OrderByDescending(x => x.Date)
                .ToListAsync();

            return Ok(gecmis);
        }
    }
}