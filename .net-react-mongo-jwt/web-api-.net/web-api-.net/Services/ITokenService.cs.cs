using web_api_.net.Entities;

namespace web_api_.net.Services
{
    public interface ITokenService
        {
            string GenerateTokenAsync(User user);
            Task<bool> ValidateTokenAsync(string token);
        }
}
