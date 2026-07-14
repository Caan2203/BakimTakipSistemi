namespace BakimAPI.Models
{
    public class ProductHistory
    {
        public int Id { get; set; }

        public int ProductId { get; set; }

        public Product Product { get; set; } = null!;

        public DateTime Date { get; set; } = DateTime.Now;

        public string Action { get; set; } = "";

        public string Description { get; set; } = "";

        public string? EmployeeName { get; set; }
    }
}