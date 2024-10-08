using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using web_api_.net.Data;
using web_api_.net.Dtos;
using web_api_.net.Entities;
using web_api_.net.Helpers;

namespace web_api_.net.Services
{

    public class UserService : IUserService
    {

        private readonly IMongoCollection<User> _users;
        private readonly string _passwordToken = "your-secret-token"; // Bu tokenı güvenli bir şekilde saklayın


        public UserService(MongoDbService mongoDbService)
        {
            _users = mongoDbService.Database?.GetCollection<User>("user");
        }

        public async Task<ActionResult<object>> GetAllUsersAsync(int page, int limit)
        {
            var filter = new BsonDocument();
            var countTask = _users.CountDocumentsAsync(filter);
            var usersTask = _users.Find(filter)
                                  .Skip((page - 1) * limit)
                                  .Limit(limit)
                                  .ToListAsync();

            await Task.WhenAll(countTask, usersTask);

            var totalUsers = countTask.Result;
            var users = usersTask.Result;

            var response = new SuccessResponseDto<object>(200, new
            {
                data = users,
                total = totalUsers
            });

            return response;


        }

        public async Task<User> GetUserByIdAsync(string id)
        {
            return await _users.Find<User>(user => user.Id == id).FirstOrDefaultAsync();
        }

        public async Task<User> GetUserByEmailAsync(string email)
        {
            return await _users.Find<User>(user => user.Email == email).FirstOrDefaultAsync();
        }

        public async Task AddUserAsync(User user)
        {
            user.Password = PasswordHelper.HashPassword(user.Password, _passwordToken);
            await _users.InsertOneAsync(user);
        }

        public async Task UpdateUserAsync(User user)
        {
            user.Password = PasswordHelper.HashPassword(user.Password, _passwordToken);
            await _users.ReplaceOneAsync(u => u.Id == user.Id, user);
        }

        public async Task DeleteUserAsync(string id)
        {
            await _users.DeleteOneAsync(user => user.Id == id);
        }

        public bool VerifyPassword(string enteredPassword, string storedHashedPassword)
        {
            return PasswordHelper.VerifyPassword(enteredPassword, _passwordToken, storedHashedPassword);
        }
    }
}
