using MongoDB.Driver;
using web_api_.net.Data;
using web_api_.net.Entities;

namespace web_api_.net.Services
{
    public class PostService : IPostService
    {

        private readonly IMongoCollection<Post> _posts;

        public PostService(MongoDbService mongoDbService)
        {
            _posts = mongoDbService.Database?.GetCollection<Post>("post");
        }

        public async Task<IEnumerable<Post>> GetPostsByUserIdAsync(string userId)
        {
            var filter = Builders<Post>.Filter.Eq(p => p.UserId, userId);
            return await _posts.Find(filter).ToListAsync();
        }

        public async Task CreatePostAsync(Post post)
        {
            await _posts.InsertOneAsync(post);
        }
    }
}
