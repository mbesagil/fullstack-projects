using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using web_api_.net.Data;
using web_api_.net.Services;
using web_api_.net.Helpers;
using web_api_.net.Middlewares;

var builder = WebApplication.CreateBuilder(args);

// JWT Authentication
//
//var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
//builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
//    .AddJwtBearer(options =>
//    {
//        options.TokenValidationParameters = new TokenValidationParameters
//        {
//            ValidateIssuer = true,
//            ValidateAudience = true,
//            ValidateLifetime = true,
//            ValidateIssuerSigningKey = true,
//            ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
//            ValidAudience = builder.Configuration["JwtSettings:Audience"],
//            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:Key"])),
//            ClockSkew = TimeSpan.Zero
//        };
//    });




// Add services to the container.
builder.Services.AddControllers();

// CORS ayarlarýný ekleyin
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins",
    builder =>
    {
        builder.AllowAnyOrigin() // React uygulamanýzýn çalýþtýðý URL
               .AllowAnyHeader()
               .AllowAnyMethod();
    });
});



// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<MongoDbService>();





builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IPostService, PostService>();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// CORS middleware'i buraya ekleyin
app.UseCors("AllowSpecificOrigins");

app.UseMiddleware<JwtAuthenticationMiddleware>();

//app.UseAuthentication(); // Authentication önce gelmeli
app.UseAuthorization();


app.MapControllers();

app.Run();
