using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class CreateCategoryDto
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public IFormFile File { get; set; }
    }
}