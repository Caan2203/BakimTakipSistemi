using BakimAPI.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BakimAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public NotificationsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetNotifications()
        {
            var today = DateTime.Today;

            var notifications = new List<object>();

            var products = _context.Products.ToList();

            foreach (var product in products)
            {
                if (product.NextMaintenanceDate == null)
                    continue;

                var days = (product.NextMaintenanceDate.Value.Date - today).Days;

                if (days < 0)
                {
                    notifications.Add(new
                    {
                        id = product.Id,
                        type = "danger",
                        icon = "🔴",
                        title = product.ProductName,
                        message = $"{product.ProductName} bakım süresi {-days} gün geçti.",
                        qrCode = product.QrCode,
                        isRead = false
                    });
                }
                else if (days > 0 && days <= 7)
                {
                    notifications.Add(new
                    {
                        id = product.Id,
                        type = "warning",
                        icon = "🟡",
                        title = product.ProductName,
                        message = $"{product.ProductName} bakımına {days} gün kaldı.",
                        qrCode = product.QrCode,
                        isRead = false
                    });
                }
            }

            return Ok(notifications);
        }

        [HttpPut("read/{id}")]
        public async Task<IActionResult> ReadNotification(int id)
        {
            var notification = await _context.Notifications.FindAsync(id);

            if (notification == null)
                return NotFound();

            notification.IsRead = true;

            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}