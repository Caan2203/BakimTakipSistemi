using BakimAPI.Data;
using BakimAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QRCoder;
using System.Drawing;

namespace BakimAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("qr/{qrCode}")]
        public async Task<ActionResult<Product>> GetProductByQr(string qrCode)
        {
            var product = await _context.Products
                .Include(p => p.Maintenances)
                .ThenInclude(m => m.Employee)
                .FirstOrDefaultAsync(p => p.QrCode == qrCode);

            if (product == null)
                return NotFound();

            return Ok(product);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            return await _context.Products
                .OrderBy(x => x.ProductName)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            return product;
        }

        // GÜNCELLENEN METOD: Try-Catch blokları eklendi.
        [HttpPost]
        public async Task<ActionResult<Product>> AddProduct(Product product)
        {
            try
            {
                product.QrCode = Guid.NewGuid().ToString();

                _context.Products.Add(product);

                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, Product product)
        {
            if (id != product.Id)
            {
                return BadRequest("ID uyuşmazlığı.");
            }

            // 1. Veri tabanındaki mevcut ürünü çekiyoruz
            var existingProduct = await _context.Products.FindAsync(id);
            if (existingProduct == null)
            {
                return NotFound("Güncellenmek istenen ürün bulunamadı.");
            }

            // 2. QrCode hariç tüm alanları güvenli bir şekilde güncelliyoruz
            existingProduct.ProductCode = product.ProductCode;
            existingProduct.ProductName = product.ProductName;
            existingProduct.Brand = product.Brand;
            existingProduct.Model = product.Model;
            existingProduct.Category = product.Category;
            existingProduct.Location = product.Location;
            existingProduct.IsInMaintenance = product.IsInMaintenance;

            try
            {
                // 3. Değişiklikleri kaydediyoruz
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductExists(id))
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

        [HttpGet("qr-image/{id}")]
        public async Task<IActionResult> GetQrImage(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
                return NotFound();

            string qrText = $"http://localhost:5173/product/{product.QrCode}";

            using var qrGenerator = new QRCodeGenerator();
            using var qrData = qrGenerator.CreateQrCode(qrText, QRCodeGenerator.ECCLevel.Q);

            var pngQr = new PngByteQRCode(qrData);

            byte[] qrBytes = pngQr.GetGraphic(20);

            return File(qrBytes, "image/png");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            _context.Products.Remove(product);

            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProductExists(int id)
        {
            return _context.Products.Any(e => e.Id == id);
        }
    }
}