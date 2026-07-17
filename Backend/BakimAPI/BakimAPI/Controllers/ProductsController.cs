using BakimAPI.Data;
using BakimAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QRCoder;
using System.Drawing;
using ClosedXML.Excel;

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
                .Include(p => p.Zimmetler)
                    .ThenInclude(z => z.Employee)
                .FirstOrDefaultAsync(p => p.QrCode == qrCode);

            if (product == null)
                return NotFound();

            var aktifZimmet = product.Zimmetler
                .Where(z => z.AktifMi)
                .OrderByDescending(z => z.VerilisTarihi)
                .FirstOrDefault();

            var result = new
            {
                product.Id,
                product.ProductName,
                product.ProductCode,
                product.Brand,
                product.Model,
                product.Category,
                product.Location,
                product.IsInMaintenance,
                product.LastMaintenanceDate,
                product.NextMaintenanceDate,

                CurrentAssignment = aktifZimmet == null ? null : new
                {
                    Employee = $"{aktifZimmet.Employee?.FirstName} {aktifZimmet.Employee?.LastName}",
                    aktifZimmet.Employee?.Department,
                    aktifZimmet.VerilisTarihi
                },

                Maintenances = product.Maintenances
                    .OrderByDescending(x => x.MaintenanceDate)
                    .Take(5)
                    .Select(x => new
                    {
                        x.MaintenanceDate,
                        x.Status,
                        x.Description,
                        Employee = x.Employee != null
                            ? $"{x.Employee.FirstName} {x.Employee.LastName}"
                            : ""
                    })
            };

            return Ok(result);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            return await _context.Products
                 .Where(x => !x.IsDeleted)
                 .OrderBy(x => x.ProductName)
                 .ToListAsync();
        }

        [HttpGet("{id}/detail")]
        public async Task<IActionResult> GetProductDetail(int id)
        {
            var product = await _context.Products
                .Include(x => x.Zimmetler.OrderByDescending(z => z.VerilisTarihi))
                    .ThenInclude(z => z.Employee)
                .Include(x => x.Maintenances)
                    .ThenInclude(m => m.Employee)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (product == null)
                return NotFound();

            return Ok(product);
        }

        [HttpPost]
        public async Task<ActionResult<Product>> AddProduct(Product product)
        {
            try
            {
                var sonUrun = await _context.Products
                    .OrderByDescending(x => x.Id)
                    .FirstOrDefaultAsync();

                int yeniNo = sonUrun == null ? 1 : sonUrun.Id + 1;

                product.ProductCode = $"URN-{DateTime.Now.Year}-{yeniNo:D4}";
                product.QrCode = Guid.NewGuid().ToString();
                product.LastMaintenanceDate = DateTime.Today;
                product.NextMaintenanceDate = DateTime.Today.AddDays(product.MaintenancePeriodDay);

                _context.Products.Add(product);
                await _context.SaveChangesAsync();

                await LogEkle(
                    product.Id,
                    "Ürün Oluşturuldu",
                    $"{product.ProductName} sisteme eklendi."
                );

                return Ok(product);
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
            var existingProduct = await _context.Products.FindAsync(id);
            if (existingProduct == null)
            {
                return NotFound("Güncellenmek istenen ürün bulunamadı.");
            }

            existingProduct.ProductCode = product.ProductCode;
            existingProduct.ProductName = product.ProductName;
            existingProduct.Brand = product.Brand;
            existingProduct.Model = product.Model;
            existingProduct.Category = product.Category;
            existingProduct.Location = product.Location;
            existingProduct.IsInMaintenance = product.IsInMaintenance;
            existingProduct.MaintenancePeriodDay = product.MaintenancePeriodDay;
            existingProduct.LastMaintenanceDate = product.LastMaintenanceDate;
            existingProduct.NextMaintenanceDate = product.NextMaintenanceDate;

            try
            {
                await _context.SaveChangesAsync();
                await LogEkle(
                    existingProduct.Id,
                    "Ürün Güncellendi",
                    $"{existingProduct.ProductName} bilgileri güncellendi."
                );
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

        [HttpGet("{id}/history")]
        public async Task<IActionResult> GetHistory(int id)
        {
            var history = await _context.ProductHistories
                .Where(x => x.ProductId == id)
                .OrderByDescending(x => x.Date)
                .ToListAsync();

            return Ok(history);
        }

        [HttpGet("qr-image/{id}")]
        public async Task<IActionResult> GetQrImage(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
                return NotFound();
            string qrText = $"http://localhost:5173/urun/{product.QrCode}";

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

            product.IsDeleted = true;

            await LogEkle(
                product.Id,
                "Ürün Pasife Alındı",
                $"{product.ProductName} pasife alındı."
            );
            return NoContent();
        }

        [HttpGet("upcoming")]
        public async Task<ActionResult<IEnumerable<Product>>> GetUpcomingProducts()
        {
            var today = DateTime.Today;
            var next30Days = today.AddDays(30);

            var products = await _context.Products
                .Where(p =>
                    p.NextMaintenanceDate != null &&
                    p.NextMaintenanceDate >= today &&
                    p.NextMaintenanceDate <= next30Days)
                .OrderBy(p => p.NextMaintenanceDate)
                .ToListAsync();

            return Ok(products);
        }

        [HttpGet("available")]
        public async Task<ActionResult<IEnumerable<Product>>> GetAvailableProducts()
        {
            var products = await _context.Products
                .Where(p => !p.IsAssigned)
                .OrderBy(p => p.ProductName)
                .ToListAsync();

            return Ok(products);
        }

        private async Task LogEkle(
            int productId,
            string action,
            string description,
            string? employee = null)
        {
            var log = new ProductHistory
            {
                ProductId = productId,
                Action = action,
                Description = description,
                EmployeeName = employee,
                Date = DateTime.Now
            };

            _context.ProductHistories.Add(log);
            await _context.SaveChangesAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products
                .FirstOrDefaultAsync(x => x.Id == id);

            if (product == null)
                return NotFound();

            return Ok(product);
        }

        private bool ProductExists(int id)
        {
            return _context.Products.Any(e => e.Id == id);
        }
        [HttpGet("excel")]
        public async Task<IActionResult> ExportExcel()
        {
            var products = await _context.Products.ToListAsync();

            using var workbook = new XLWorkbook();

            var ws = workbook.Worksheets.Add("Ürünler");

            ws.Cell(1, 1).Value = "Ürün Kodu";
            ws.Cell(1, 2).Value = "Ürün Adı";
            ws.Cell(1, 3).Value = "Marka";
            ws.Cell(1, 4).Value = "Model";
            ws.Cell(1, 5).Value = "Kategori";
            ws.Cell(1, 6).Value = "Konum";
            ws.Cell(1, 7).Value = "Bakım Durumu";

            int row = 2;

            foreach (var item in products)
            {
                ws.Cell(row, 1).Value = item.ProductCode;
                ws.Cell(row, 2).Value = item.ProductName;
                ws.Cell(row, 3).Value = item.Brand;
                ws.Cell(row, 4).Value = item.Model;
                ws.Cell(row, 5).Value = item.Category;
                ws.Cell(row, 6).Value = item.Location;
                ws.Cell(row, 7).Value = item.IsInMaintenance
                    ? "Bakımda"
                    : "Kullanımda";

                row++;
            }

            using var stream = new MemoryStream();

            workbook.SaveAs(stream);

            stream.Position = 0;

            return File(
                stream.ToArray(),
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Urunler.xlsx");
        }
    }
}