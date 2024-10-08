using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace web_api_.net.Middlewares
{
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, AllowMultiple = true, Inherited = true)]
    public class UseTokenDecoderAttribute : Attribute
    {
    }

    public class JwtAuthenticationMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IConfiguration _configuration;

        public JwtAuthenticationMiddleware(RequestDelegate next, IConfiguration configuration)
        {
            _next = next;
            _configuration = configuration;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var endpoint = context.GetEndpoint();
            var useTokenDecoder = endpoint?.Metadata?.GetMetadata<UseTokenDecoderAttribute>() != null;

            if (useTokenDecoder)
            {
                var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

                if (token != null)
                {
                    var tokenHandler = new JwtSecurityTokenHandler();
                    var key = Encoding.UTF8.GetBytes(_configuration["JwtSettings:Key"]);

                    try
                    {
                        tokenHandler.ValidateToken(token, new TokenValidationParameters
                        {
                            ValidateIssuer = false,
                            ValidateAudience = false,
                            ValidateLifetime = true,
                            ValidateIssuerSigningKey = true,
                            ValidIssuer = _configuration["JwtSettings:Issuer"],
                            ValidAudience = _configuration["JwtSettings:Audience"],
                            IssuerSigningKey = new SymmetricSecurityKey(key),
                            ClockSkew = TimeSpan.Zero
                        }, out SecurityToken validatedToken);

                        var jwtToken = (JwtSecurityToken)validatedToken;
                        var userId = jwtToken.Claims.First(claim => claim.Type == "nameid").Value;

                        context.Items["User"] = userId;
                    }
                    catch
                    {
                        // Token doğrulama başarısız olursa
                        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                        await context.Response.WriteAsync("Unauthorized");
                        return;
                    }
                }
            }

            await _next(context);
        }
    }
}
