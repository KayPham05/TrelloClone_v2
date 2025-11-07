using TodoAppAPI.DTOs;
using TodoAppAPI.Models;

namespace TodoAppAPI.Interfaces
{
    public interface IUserService
    {

        Task<IEnumerable<User>> GetAllAsync();
        Task<User?> GetByIdAsync(string userUId);
        Task AddAsync(User user);
        Task UpdateAsync(User user);
        Task DeleteAsync(string userUId);
        Task <User?> GetUserByEmail(string email);
    }
}
