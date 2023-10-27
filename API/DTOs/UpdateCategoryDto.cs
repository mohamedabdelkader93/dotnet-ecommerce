using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class UpdateCategoryDto
    {
        public int Id { get; set; }
        
        [Required]
        public string Name { get; set; }

        public IFormFile File { get; set; }

    }
}