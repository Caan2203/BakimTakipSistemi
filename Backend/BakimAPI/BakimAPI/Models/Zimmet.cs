using System.ComponentModel.DataAnnotations;

namespace BakimAPI.Models;

public class Zimmet
{
    public int Id { get; set; }

    [Required]
    public int ProductId { get; set; }

    [Required]
    public int EmployeeId { get; set; }

    public Product? Product { get; set; }

    public Employee? Employee { get; set; }

    public DateTime VerilisTarihi { get; set; } = DateTime.Now;

    public DateTime? IadeTarihi { get; set; }

    public bool AktifMi { get; set; } = true;

    public string Aciklama { get; set; } = "";


}