using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entity
{
    public class Cart
    {
        public int CartId { get; set; }
        public string CustomerId { get; set; }=null!;
        public List<CartItem> Items { get; set; }=new();
        public void AddItem(Product product, int quantity)
        {
            var item = Items.FirstOrDefault(x => x.ProductId == product.Id);
            if (item != null)
            {
                item.Quantity+=quantity;
            }
            else
            {
                Items.Add(new CartItem{Product=product,Quantity=quantity});
            }
        }
        public void RemoveItem(int productId, int quantity)
        {
            var item = Items.FirstOrDefault(x => x.ProductId == productId);
            if (item == null)
            {
                return;
            }
            else
            {
                item.Quantity-=quantity;
            }
            if(item?.Quantity==0)
            {
                Items.Remove(item);
            }   
        }
           
    }

    public class CartItem
    {
        public int CartItemId { get; set; }
        public int ProductId { get; set; }
        public Product Product { get; set; }=null!;
        public int Quantity { get; set; }
        public int CartId { get; set; }
        public Cart Cart { get; set; }=null!;
    }
}