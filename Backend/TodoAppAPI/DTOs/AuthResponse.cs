namespace TodoAppAPI.DTOs
{
    public class AuthResponse
    {
        public string Message { get; set; } = string.Empty;
        public string UserUId { get; set; }
        public string? Token { get; set; } // JWT hoặc mock token
        public string? UserName { get; set; }
        public string? Email { get; set; }
    }
}
