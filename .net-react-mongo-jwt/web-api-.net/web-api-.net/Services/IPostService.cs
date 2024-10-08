using web_api_.net.Entities;

namespace web_api_.net.Services
{
    public interface IPostService
    {
        Task<IEnumerable<Post>> GetPostsByUserIdAsync(string userId);
        Task CreatePostAsync(Post post);
    }
}
