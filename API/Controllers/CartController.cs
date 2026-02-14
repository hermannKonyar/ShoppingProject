using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace API.Controllers
{
    [Route("/api/[controller]")]
    public class CartController : Controller
    {
       private readonly DataContext _context;
       public CartController(DataContext context)
       {
           _context = context;
       }
       [HttpGet]
       public async Task<ActionResult<Cart>> GetCart()
       {
           var cart = await GetOrCreateCart();

           return cart;
       }
      [HttpPost]
      public async Task<ActionResult> AddItemToCart(int productId,int quantity)
      {
        var cart = await GetOrCreateCart();
        var product = await _context.Products.FindAsync(productId);
        if(product==null) return BadRequest(new ProblemDetails{Title="Product not found"});
        cart.AddItem(product,quantity);
        var result = await _context.SaveChangesAsync();
        if(result>0) return CreatedAtAction(nameof(GetCart),new {cartId=cart.CartId},cart);
        return BadRequest(new ProblemDetails{Title="Problem adding item to cart"});
      }
      private async Task<Cart> GetOrCreateCart()
      {
        
        var cart = await _context.Carts
            .Include(i => i.Items)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(x => x.CustomerId == Request.Cookies["CustomerId"]);
        if(cart==null)
        {
            var customerId = Guid.NewGuid().ToString();
            var cookieOptions = new CookieOptions
            {
                IsEssential = true,
                Expires = DateTime.Now.AddDays(30)
            };
            Response.Cookies.Append("CustomerId",customerId,cookieOptions);
            cart=new Cart{CustomerId=customerId};
            _context.Carts.Add(cart);
            await _context.SaveChangesAsync();
        }
        return cart;
      }
    }
}