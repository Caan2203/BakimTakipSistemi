using BakimAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace BakimAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }

        public DbSet<Employee> Employees { get; set; }

        public DbSet<Maintenance> Maintenances { get; set; }

        public DbSet<Kullanici> Kullanicilar { get; set; }

        public DbSet<Zimmet> Zimmetler { get; set; }

        public DbSet<ProductHistory> ProductHistories { get; set; }

        public DbSet<Notification> Notifications { get; set; }
    }
}