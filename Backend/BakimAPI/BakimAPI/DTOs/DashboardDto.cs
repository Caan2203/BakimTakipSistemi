using BakimAPI.Models;

namespace BakimAPI.DTOs;

public class DashboardDto
{
    public int TotalProducts { get; set; }

    public int TotalEmployees { get; set; }

    public int TotalMaintenances { get; set; }

    public int ProductsInMaintenance { get; set; }

    public int UpcomingMaintenances { get; set; }

    public int OverdueMaintenances { get; set; }

    public List<Maintenance> LastMaintenances { get; set; } = new();

    public List<Product> UpcomingProducts { get; set; } = new();

    public List<Product> OverdueProducts { get; set; } = new();

    public List<string> MonthlyLabels { get; set; } = new();

    public List<int> MonthlyMaintenanceCounts { get; set; } = new();

    public List<ProductHistory> LastProductActions { get; set; } = new();
}