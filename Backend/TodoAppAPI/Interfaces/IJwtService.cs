using TodoAppAPI.Models;

namespace TodoAppAPI.Interfaces
{
    public interface IJwtService
    {
        string GenerateToken(User user);
    }
}
