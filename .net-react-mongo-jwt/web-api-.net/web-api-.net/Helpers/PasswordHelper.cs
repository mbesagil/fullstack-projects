namespace web_api_.net.Helpers
{
    public static class PasswordHelper
    {
        public static string HashPassword(string password, string token)
        {
            var combinedPassword = password + token;
            return BCrypt.Net.BCrypt.HashPassword(combinedPassword);
        }

        public static bool VerifyPassword(string password, string token, string hashedPassword)
        {
            var combinedPassword = password + token;
            return BCrypt.Net.BCrypt.Verify(combinedPassword, hashedPassword);
        }
    }
}
