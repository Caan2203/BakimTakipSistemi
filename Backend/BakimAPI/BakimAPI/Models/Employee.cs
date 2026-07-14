using BakimAPI.Models;

public class Employee
{
    public int Id { get; set; }

    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string Department { get; set; } = string.Empty;
    
    public string Phone { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public DateTime CreatedDate { get; set; } = DateTime.Now;

    public ICollection<Zimmet> Zimmetler { get; set; }
    = new List<Zimmet>();


}