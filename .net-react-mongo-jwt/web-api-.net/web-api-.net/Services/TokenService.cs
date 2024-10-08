using Amazon.SecurityToken.Model;
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Runtime.InteropServices;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using web_api_.net.Entities; // Uygulamanızdaki Entity namespace'i
using web_api_.net.Helpers; // Uygulamanızdaki Helper namespace'i

namespace web_api_.net.Services
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _configuration;
        private readonly SymmetricSecurityKey _signingKey;
        

        public TokenService(IConfiguration config)
        {
            _configuration = config;

            // Validate retrieved values
            if (string.IsNullOrEmpty(_configuration["JwtSettings:Key"]))
            {
                throw new ArgumentNullException("Jwt:SigningKey is not configured in appsettings.json");
            }
        }

        public string GenerateTokenAsync(User user)
        {
            var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            // Add additional claims as needed, e.g., roles, permissions
        };

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var tokenHandler = new JwtSecurityTokenHandler();

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
         {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
             // Add more claims as needed
         }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256Signature),
                Issuer = _configuration["JwtSettings:Issuer"], // Add this line
                Audience = _configuration["JwtSettings:Audience"]
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);

        }

        public async Task<bool> ValidateTokenAsync(string token)
        {

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:Key"]));

            try
            {
                JwtSecurityTokenHandler tokenHandler = new();
                tokenHandler.ValidateToken(token, new TokenValidationParameters(){
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = securityKey,
                    ValidateLifetime = true,
                    ValidateAudience = false,
                    ValidateIssuer = false,
                    ClockSkew = TimeSpan.Zero, // Optional: to eliminate tolerance in token expiration


                }, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;
                return true; 
            }
            catch (SecurityTokenException ex)
            {
                // Log the exception with details (masked token) for security purposes
                return false;
            }
        }
    }
}
