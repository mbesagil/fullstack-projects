using Microsoft.AspNetCore.Mvc;
using web_api_.net.Entities;

namespace web_api_.net.Services
{
    public interface IUserService
    {
        Task<ActionResult<object>> GetAllUsersAsync(int page, int limit);
        Task<User> GetUserByIdAsync(string id);
        Task<User> GetUserByEmailAsync(string email);
        Task AddUserAsync(User user);
        Task UpdateUserAsync(User user);
        Task DeleteUserAsync(string id);
        bool VerifyPassword(string enteredPassword, string storedHashedPassword);

    }
}
