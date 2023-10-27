using API.Entities;

namespace API.Extensions
{
    public static class CategoryExtensions
    {
        public static IQueryable<Category> Sort(this IQueryable<Category> query, string orderBy)
        {
            if (string.IsNullOrWhiteSpace(orderBy)) return query.OrderBy(p => p.Name);

            query = orderBy switch
            {
                _ => query.OrderBy(n => n.Name)
            };

            return query;
        }

        public static IQueryable<Category> Search(this IQueryable<Category> query, string searchTerm)
        {
            if (string.IsNullOrEmpty(searchTerm)) return query;

            var lowerCaseSearchTerm = searchTerm.Trim().ToLower();

            return query.Where(p => p.Name.ToLower().Contains(lowerCaseSearchTerm));
        }
    }
}