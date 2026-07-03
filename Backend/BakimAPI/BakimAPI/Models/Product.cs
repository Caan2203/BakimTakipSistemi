namespace BakimAPI.Models
{
    public class Product
    {
        public int Id { get; set; }

        public string ProductCode { get; set; } = string.Empty;

        public string ProductName { get; set; } = string.Empty;

        public string SerialNumber { get; set; } = string.Empty;

        public string Location { get; set; } = string.Empty;

        public int MaintenancePeriod { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.Now;

        public string QrCode { get; set; } = string.Empty;

        public bool IsInMaintenance { get; set; } = false;

        // Ürüne ait bakım kayıtları
        public ICollection<Maintenance> Maintenances { get; set; } = new List<Maintenance>();
    }
}