using System.ComponentModel.DataAnnotations;

namespace API.DTO
{
    public class CreateProductDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public int Stock { get; set; }
    }
}
