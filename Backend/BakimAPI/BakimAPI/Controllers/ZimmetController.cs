using BakimAPI.Data;
using BakimAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BakimAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ZimmetController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ZimmetController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Zimmet>>> GetAll()
    {
        return await _context.Zimmetler
            .Include(z => z.Product)
            .Include(z => z.Employee)
            .OrderByDescending(z => z.VerilisTarihi)
            .ToListAsync();
    }

    [HttpPost]
    public async Task<IActionResult> Add(Zimmet zimmet)
    {
        var product = await _context.Products.FindAsync(zimmet.ProductId);

        if (product == null)
            return BadRequest("Ürün bulunamadı.");

        if (product.IsAssigned)
            return BadRequest("Bu ürün zaten başka bir personele zimmetli.");

        product.IsAssigned = true;
        product.AssignedEmployeeId = zimmet.EmployeeId;
        _context.Zimmetler.Add(zimmet);
        await _context.SaveChangesAsync();

        return Ok(zimmet);
    }
    [HttpPut("iade/{id}")]
    public async Task<IActionResult> IadeEt(int id)
    {
        var zimmet = await _context.Zimmetler
            .Include(z => z.Product)
            .FirstOrDefaultAsync(z => z.Id == id);

        if (zimmet == null)
            return NotFound("Zimmet bulunamadı.");

        if (!zimmet.AktifMi)
            return BadRequest("Bu zimmet zaten iade edilmiş.");

        zimmet.AktifMi = false;
        zimmet.IadeTarihi = DateTime.Now;

        if (zimmet.Product != null)
        {
            zimmet.Product.IsAssigned = false;
            zimmet.Product.AssignedEmployeeId = null;
        }

        await _context.SaveChangesAsync();

        return Ok("Ürün başarıyla iade edildi.");
    }
    [HttpGet("product/{productId}")]
    public async Task<ActionResult<IEnumerable<Zimmet>>> GetProductHistory(int productId)
    {
        var gecmis = await _context.Zimmetler
            .Include(z => z.Employee)
            .Where(z => z.ProductId == productId)
            .OrderByDescending(z => z.VerilisTarihi)
            .ToListAsync();

        return Ok(gecmis);
    }
    [HttpGet("employee/{employeeId}/active")]
    public async Task<IActionResult> GetActiveAssignments(int employeeId)
    {
        var aktifler = await _context.Zimmetler
            .Include(z => z.Product)
            .Where(z => z.EmployeeId == employeeId && z.AktifMi)
            .ToListAsync();

        return Ok(aktifler);
    }
}