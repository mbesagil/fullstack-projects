using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using web_api_.net.Dtos;
using web_api_.net.Entities;
using web_api_.net.Services;

namespace web_api_.net.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetAllUsers([FromQuery] int page = 1, [FromQuery] int limit = 10)
        {
            var users = await _userService.GetAllUsersAsync(page, limit);
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUserById(string id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        [HttpPost]
        public async Task<ActionResult<User>> CreateUser(UserDto userDto)
        {
            var user = new User
            {
                Email = userDto.Email,
                Password = userDto.Password // Şifreleme UserService içinde yapılacak
            };
            await _userService.AddUserAsync(user);
            return CreatedAtAction(nameof(GetUserById), new { id = user.Id }, user);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(string id, UserDto userDto)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            user.Email = userDto.Email;
            user.Password = userDto.Password; // Şifreleme UserService içinde yapılacak

            await _userService.UpdateUserAsync(user);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            await _userService.DeleteUserAsync(id);
            return NoContent();
        }

        [HttpPost("verify-password")]
        public IActionResult VerifyPassword(UserDto userDto)
        {
            var user = _userService.GetUserByEmailAsync(userDto.Email).Result;
            if (user == null)
            {
                return NotFound();
            }

            var isValid = _userService.VerifyPassword(userDto.Password, user.Password);
            if (!isValid)
            {
                return Unauthorized();
            }

            return Ok();
        }

    }
}
