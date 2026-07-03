using System.ComponentModel.DataAnnotations;

namespace BakimAPI.Models;

public class Product
{
    public int Id { get; set; }

    [Required]
    public string ProductCode { get; set; } = "";

    [Required]
    public string ProductName { get; set; } = "";

    public string Brand { get; set; } = "";

    public string Model { get; set; } = "";

    public string Category { get; set; } = "";

    public string Location { get; set; } = "";

    public bool IsInMaintenance { get; set; }

    public string QrCode { get; set; } = "";

    public ICollection<Maintenance> Maintenances { get; set; }
        = new List<Maintenance>();
}