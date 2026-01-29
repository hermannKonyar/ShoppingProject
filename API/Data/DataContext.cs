using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using API.Entity;

namespace API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }
        public DbSet<Product> Products => Set<Product>();
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Product>().HasData(
new List<Product>
{
    new Product
    {
        Id = 1,
        Name = "iPhone 12",
        Description = "telefon açıklaması",
        ImageUrl = "1.jpeg",
        Price = 17000,
        IsActive = true,
        Stock = 100
    },
    new Product
    {
        Id = 2,
        Name = "iPhone 13",
        Description = "telefon açıklaması",
        ImageUrl = "2.jpeg",
        Price = 20000,
        IsActive = true,
        Stock = 100
    },

}
            );
        }
    }
}