using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Runtime.Intrinsics.X86;
using System.Security.Claims;
using web_api_.net.Entities;
using web_api_.net.Middlewares;
using web_api_.net.Services;

namespace web_api_.net.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PostsController : ControllerBase
    {
        private readonly IPostService _postService;
        
        public PostsController(IPostService postService) 
        {    
            _postService = postService;
        }

        [HttpGet]
        [UseTokenDecoder]
        public async Task<IActionResult> GetPosts()
        {
            var userId = HttpContext.Items["User"]?.ToString();
            if (userId == null)
            {
                return Ok(HttpContext.Items["User"]);
            }

            var posts = await _postService.GetPostsByUserIdAsync(userId);
            return Ok(posts);
        }

        
        [HttpPost]
        [UseTokenDecoder]

        public async Task<IActionResult> CreatePost(Post post)
        {
            var userId = HttpContext.Items["User"]?.ToString();
            if (userId == null)
            {
                return Ok(HttpContext.Items["User"]);
            }

            post.UserId = userId; 

            await _postService.CreatePostAsync(post);
            return CreatedAtAction(nameof(GetPosts), new { id = post.Id }, post);
        }


    }
}
