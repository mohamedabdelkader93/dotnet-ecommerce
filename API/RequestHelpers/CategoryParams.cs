namespace API.RequestHelpers
{
    public class CategoryParams : PaginationParams
    {
        public string OrderBy { get; set; }
        public string SearchTerm { get; set; }
    }
}