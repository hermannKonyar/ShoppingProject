using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using API.Entity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        
        [HttpGet]
        public IActionResult GetProducts()
        {
            return Ok(new List<Product>
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
                }
            });
        }



        [HttpGet("{id}")]
        public IActionResult GetProduct(int id) => Ok(new Product()
        {
            Id = 1,
            Name = "iPhone 12",
            Description = "telefon açıklaması",
            ImageUrl = "1.jpeg",
            Price = 17000,
            IsActive = true,
            Stock = 100
        });
    }
}