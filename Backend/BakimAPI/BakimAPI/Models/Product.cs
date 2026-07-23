using System.ComponentModel.DataAnnotations;

namespace BakimAPI.Models;

public class Product
{
    public int Id { get; set; }

    public string ProductCode { get; set; } = "";

    [Required]
    public string ProductName { get; set; } = "";

    public string Brand { get; set; } = "";

    public string Model { get; set; } = "";

    public string Category { get; set; } = "";

    public string Location { get; set; } = "";

    public bool IsInMaintenance { get; set; }                   

    public bool IsAssigned { get; set; } = false;

    public int? AssignedEmployeeId { get; set; }

    public Employee? AssignedEmployee { get; set; }

    public string QrCode { get; set; } = "";
    public DateTime? LastMaintenanceDate { get; set; }

    public DateTime? NextMaintenanceDate { get; set; }
    public int MaintenancePeriodDay { get; set; } = 30;

    public ICollection<Maintenance> Maintenances { get; set; }
        = new List<Maintenance>();

    public ICollection<Zimmet> Zimmetler { get; set; }
    = new List<Zimmet>();
    public ICollection<ProductHistory> ProductHistories { get; set; }
    = new List<ProductHistory>();

    public bool IsDeleted { get; set; } = false;


    public DateTime PurchaseDate { get; set; }

    public DateTime WarrantyStartDate { get; set; }

    public DateTime WarrantyEndDate { get; set; }


}