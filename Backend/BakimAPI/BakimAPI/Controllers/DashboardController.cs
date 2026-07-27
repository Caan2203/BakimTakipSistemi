using BakimAPI.Data;
using BakimAPI.DTOs;
using BakimAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BakimAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DashboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<DashboardDto>> GetDashboard()
        {
            var dashboard = new DashboardDto();
            dashboard.TotalProducts = await _context.Products.CountAsync();

            dashboard.ProductsInMaintenance = await _context.Products
                .CountAsync(x => x.IsInMaintenance);

            dashboard.TotalEmployees = await _context.Employees.CountAsync();

            dashboard.TotalMaintenances = await _context.Maintenances.CountAsync();

            dashboard.UpcomingMaintenances = await _context.Products
                .CountAsync(x =>
                    x.NextMaintenanceDate.HasValue &&
                    x.NextMaintenanceDate.Value >= DateTime.Today &&
                    x.NextMaintenanceDate.Value <= DateTime.Today.AddDays(30));

            dashboard.OverdueMaintenances = await _context.Products
                .CountAsync(x =>
                    x.NextMaintenanceDate.HasValue &&
                    x.NextMaintenanceDate.Value < DateTime.Today);
            dashboard.LastMaintenances = await _context.Maintenances
                .Include(x => x.Product)
                .Include(x => x.Employee)
                .OrderByDescending(x => x.MaintenanceDate)
                .Take(5)
                .ToListAsync();

            dashboard.UpcomingProducts = await _context.Products
                .Where(x =>
                    x.NextMaintenanceDate.HasValue &&
                    x.NextMaintenanceDate.Value >= DateTime.Today &&
                    x.NextMaintenanceDate.Value <= DateTime.Today.AddDays(30))
                .OrderBy(x => x.NextMaintenanceDate)
                .Take(5)
                .ToListAsync();
            dashboard.UpcomingWarrantyProducts = await _context.Products
                .Where(x =>
                    !x.IsDeleted &&
                    x.WarrantyEndDate != default &&
                    x.WarrantyEndDate <= DateTime.Today.AddDays(30))
                .OrderBy(x => x.WarrantyEndDate)
                .Take(10)
                .ToListAsync();

            dashboard.OverdueProducts = await _context.Products
                .Where(x =>
                    x.NextMaintenanceDate.HasValue &&
                    x.NextMaintenanceDate.Value < DateTime.Today)
                .OrderBy(x => x.NextMaintenanceDate)
                .Take(5)
                .ToListAsync();
            dashboard.MonthlyLabels = new List<string>();
            dashboard.MonthlyMaintenanceCounts = new List<int>();

            for (int i = 5; i >= 0; i--)
            {
                var tarih = DateTime.Today.AddMonths(-i);

                dashboard.MonthlyLabels.Add(tarih.ToString("MMM"));

                var adet = await _context.Maintenances.CountAsync(x =>
                    x.MaintenanceDate.Month == tarih.Month &&
                    x.MaintenanceDate.Year == tarih.Year);

                dashboard.MonthlyMaintenanceCounts.Add(adet);
            }

            dashboard.LastProductActions = await _context.ProductHistories
                .OrderByDescending(x => x.Date)
                .Take(10)
                .ToListAsync();
            dashboard.Notifications = new List<NotificationDto>();
            foreach (var urun in dashboard.OverdueProducts)
            {
                dashboard.Notifications.Add(new NotificationDto
                {
                    Title = urun.ProductName,
                    Message = "Bu ürünün bakım tarihi geçmiş durumda!",
                    Type = "danger",
                    Icon = "⚠️"
                });
            }
            foreach (var urun in dashboard.UpcomingWarrantyProducts)
            {
                var kalanGun = (urun.WarrantyEndDate - DateTime.Today).Days;

                if (kalanGun >= 0)
                {
                    dashboard.Notifications.Add(new NotificationDto
                    {
                        Title = urun.ProductName,
                        Message = $"Ürünün garantisi {kalanGun} gün sonra sona erecek.",
                        Type = "warning",
                        Icon = "🛡️"
                    });
                }
                else
                {
                    dashboard.Notifications.Add(new NotificationDto
                    {
                        Title = urun.ProductName,
                        Message = $"Ürünün garantisi {Math.Abs(kalanGun)} gün önce sona erdi.",
                        Type = "danger",
                        Icon = "❌"
                    });
                }
            }
            Console.WriteLine("Bildirim Sayısı : " + dashboard.Notifications.Count);

            foreach (var item in dashboard.Notifications)
            {
                Console.WriteLine($"{item.Title} - {item.Message}");
            }

            return Ok(dashboard);
        }
    }
}