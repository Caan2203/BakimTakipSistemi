using BakimAPI.Data;
using BakimAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BakimAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MaintenanceController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MaintenanceController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Tüm bakım kayıtları
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Maintenance>>> GetMaintenances()
        {
            try
            {
                return await _context.Maintenances
                    .Include(x => x.Product)
                    .Include(x => x.Employee)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.ToString());
            }
        }

     

        // Tek bakım kaydı
        [HttpGet("{id}")]
        public async Task<ActionResult<Maintenance>> GetMaintenance(int id)
        {
            var maintenance = await _context.Maintenances
                .Include(x => x.Product)
                .Include(x => x.Employee)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (maintenance == null)
                return NotFound();

            return maintenance;
        }

        // Yeni bakım ekle
        [HttpPost]
        public async Task<ActionResult<Maintenance>> AddMaintenance(Maintenance maintenance)
        {
            var product = await _context.Products.FindAsync(maintenance.ProductId);

            if (product != null)
            {
                product.IsInMaintenance = true;
            }
            _context.Maintenances.Add(maintenance);

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMaintenance), new { id = maintenance.Id }, maintenance);
        }

        // Bakım güncelle
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMaintenance(int id, Maintenance maintenance)
        {
            if (id != maintenance.Id)
                return BadRequest();

            _context.Entry(maintenance).State = EntityState.Modified;

            var product = await _context.Products.FindAsync(maintenance.ProductId);

            if (product != null && maintenance.Status == "Tamamlandı")
            {
                product.IsInMaintenance = false;
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Bakım sil
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMaintenance(int id)
        {
            var maintenance = await _context.Maintenances.FindAsync(id);

            if (maintenance == null)
                return NotFound();

            _context.Maintenances.Remove(maintenance);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}