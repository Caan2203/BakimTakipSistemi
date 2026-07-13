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
}