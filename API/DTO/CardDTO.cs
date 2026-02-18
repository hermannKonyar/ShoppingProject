using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTO
{
    public class CardDTO
    {
        public int CartId { get; set; }
        public string CustomerId { get; set; }=null!;
        public List<CartItemDTO> Items { get; set; }=new();
    }
    public class CartItemDTO
    {
        public int ProductId { get; set; }
        public string Name { get; set; }=null!;
        public string Description { get; set; }=null!;
        public string ImageUrl { get; set; }=null!;
        public decimal Price { get; set; }
        public int Quantity { get; set; }
    }
}