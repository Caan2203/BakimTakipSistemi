using BakimAPI.Models;

namespace BakimAPI.Models
{
    public class Maintenance
    {
        public int Id { get; set; }

        public int ProductId { get; set; }

        public Product? Product { get; set; }

        public int EmployeeId { get; set; }

        public Employee? Employee { get; set; }

        public DateTime MaintenanceDate { get; set; }

        public string Description { get; set; } = string.Empty;

        public string Status { get; set; } = "Tamamlandı";
    }
}