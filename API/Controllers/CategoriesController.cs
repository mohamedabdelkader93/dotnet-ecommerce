using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class CategoriesController : BaseApiController
    {
        private readonly StoreContext _context;
        private readonly IMapper _mapper;
        private readonly ImageService _imageService;
        public CategoriesController(StoreContext context, IMapper mapper, ImageService imageService)
        {
            _imageService = imageService;
            _mapper = mapper;
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<Category>>> GetCategories([FromQuery] CategoryParams categoryParams)
        {
            var query = _context.Categories
                .Sort(categoryParams.OrderBy)
                .Search(categoryParams.SearchTerm)
                .AsQueryable();

            var categories = await PagedList<Category>.ToPagedList(query, categoryParams.PageNumber,
                categoryParams.PageSize);

            Response.AddPaginationHeader(categories.MetaData);

            return categories;
        }

        [HttpGet("{id}", Name = "GetCategory")]
        public async Task<ActionResult<Category>> GetCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);

            if (category == null) return NotFound();

            return category;
        }

        [HttpGet("filters")]
        public async Task<IActionResult> GetFilters()
        {
            var Names = await _context.Categories.OrderBy(p => p.Name).Select(p => p.Name).Distinct().ToListAsync();

            return Ok(new { Names });
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Category>> CreateCategory([FromForm] CreateCategoryDto categoryDto)
        {
            var category = _mapper.Map<Category>(categoryDto);

            if (categoryDto.File != null)
            {
                var imageResult = await _imageService.AddImageAsync(categoryDto.File);

                if (imageResult.Error != null)
                    return BadRequest(new ProblemDetails { Title = imageResult.Error.Message });

                category.PictureUrl = imageResult.SecureUrl.ToString();
                category.PublicId = imageResult.PublicId;
            }

            _context.Categories.Add(category);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return CreatedAtRoute("GetCategory", new { Id = category.Id }, category);

            return BadRequest(new ProblemDetails { Title = "Problem creating new category" });
        }

        [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<ActionResult<Category>> UpdateCategory([FromForm]UpdateCategoryDto categoryDto)
        {
            var category = await _context.Categories.FindAsync(categoryDto.Id);

            if (category == null) return NotFound();

            _mapper.Map(categoryDto, category);

            if (categoryDto.File != null)
            {
                var imageUploadResult = await _imageService.AddImageAsync(categoryDto.File);

                if (imageUploadResult.Error != null) 
                    return BadRequest(new ProblemDetails { Title = imageUploadResult.Error.Message });

                if (!string.IsNullOrEmpty(category.PublicId)) 
                    await _imageService.DeleteImageAsync(category.PublicId);

                category.PictureUrl = imageUploadResult.SecureUrl.ToString();
                category.PublicId = imageUploadResult.PublicId;
            }

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok(category);

            return BadRequest(new ProblemDetails { Title = "Problem updating category" });
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);

            if (category == null) return NotFound();

            if (!string.IsNullOrEmpty(category.PublicId)) 
                await _imageService.DeleteImageAsync(category.PublicId);

            _context.Categories.Remove(category);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok();

            return BadRequest(new ProblemDetails { Title = "Problem deleting category" });
        }
    }
}