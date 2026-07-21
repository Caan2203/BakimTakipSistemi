namespace BakimAPI.Models
{
    public class Notification
    {
        public int Id { get; set; }

        public string Message { get; set; } = string.Empty;

        public string Type { get; set; } = "info";

        public bool IsRead { get; set; } = false;

        public DateTime CreatedDate { get; set; } = DateTime.Now;
    }
}