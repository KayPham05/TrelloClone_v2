using TodoAppAPI.DTOs;

namespace TodoAppAPI.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponse> RegisterAsync(string userName, string email, string password);
        Task<AuthResponse> LoginAsync(string email, string password);
        Task<AuthResponse> GoogleLoginAsync(string email, string name);
    }
}
