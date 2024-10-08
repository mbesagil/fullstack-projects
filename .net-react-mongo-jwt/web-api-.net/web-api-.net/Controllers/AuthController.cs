using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using web_api_.net.Dtos;
using web_api_.net.Services;

namespace web_api_.net.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {

        private readonly IUserService _userService;
        private readonly ITokenService _tokenService;

        public AuthController(IUserService userService, ITokenService tokenService)
        {
            _userService = userService;
            _tokenService = tokenService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserDto userDto)
        {
            var user = await _userService.GetUserByEmailAsync(userDto.Email);
            if (user == null || !_userService.VerifyPassword(userDto.Password, user.Password))
            {
                return Unauthorized();
            }

            var token =  _tokenService.GenerateTokenAsync(user);
            return Ok(new { Token = token });
        }

        public class TokenRequest
        {
            public string Token { get; set; }
        }

        // Örnek bir token doğrulama endpoint'i
        [HttpPost("validate-token")]
        public async Task<IActionResult> ValidateToken([FromBody] TokenRequest request)
        {
            bool isValid = await _tokenService.ValidateTokenAsync(request.Token);

            if (isValid)
            {
                return Ok("Token is valid.");
            }
            else
            {
                return BadRequest("Token is invalid or expired.");
            }
        }
    }
}
