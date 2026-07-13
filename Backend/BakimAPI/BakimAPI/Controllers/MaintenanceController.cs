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

        [HttpPost]
        public async Task<ActionResult<Maintenance>> AddMaintenance(Maintenance maintenance)
        {
            try
            {
                var product = await _context.Products.FindAsync(maintenance.ProductId);

                if (product == null)
                    return BadRequest("Ürün bulunamadı.");

                var employee = await _context.Employees.FindAsync(maintenance.EmployeeId);

                if (employee == null)
                    return BadRequest("Personel bulunamadı.");

                maintenance.MaintenanceDate = DateTime.Now;

                product.LastMaintenanceDate = maintenance.MaintenanceDate;
                product.NextMaintenanceDate = maintenance.MaintenanceDate.AddDays(product.MaintenancePeriodDay);
                product.IsInMaintenance = false;

                _context.Maintenances.Add(maintenance);

                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetMaintenance), new { id = maintenance.Id }, maintenance);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMaintenance(int id, Maintenance maintenance)
        {
            if (id != maintenance.Id)
                return BadRequest();

            var product = await _context.Products.FindAsync(maintenance.ProductId);

            if (product != null)
            {
                product.LastMaintenanceDate = maintenance.MaintenanceDate;
                product.NextMaintenanceDate = maintenance.MaintenanceDate.AddMonths(6);

                if (maintenance.Status == "Tamamlandı")
                {
                    product.IsInMaintenance = false;
                }
                else
                {
                    product.IsInMaintenance = true;
                }
            }

            _context.Entry(maintenance).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MaintenanceExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

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

        [HttpGet("upcoming")]
        public async Task<IActionResult> GetUpcomingMaintenances()
        {
            var today = DateTime.Today;
            var nextWeek = today.AddDays(30);

            var products = await _context.Products
                .Where(p => p.NextMaintenanceDate >= today &&
                            p.NextMaintenanceDate <= nextWeek)
                .OrderBy(p => p.NextMaintenanceDate)
                .ToListAsync();

            return Ok(products);
        }

        [HttpGet("overdue")]
        public async Task<IActionResult> GetOverdueProducts()
        {
            var today = DateTime.Today;

            var products = await _context.Products
                .Where(p => p.NextMaintenanceDate < today)
                .OrderBy(p => p.NextMaintenanceDate)
                .ToListAsync();

            return Ok(products);
        }

        private bool MaintenanceExists(int id)
        {
            return _context.Maintenances.Any(e => e.Id == id);
        }
    }
}