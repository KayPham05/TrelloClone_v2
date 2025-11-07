using TodoAppAPI.Models;

namespace TodoAppAPI.Interfaces
{
    public interface IBoardService
    {

        Task<List<Board>> GetAllBoardsByUserAsync(string userUId);
        Task<Board?> GetBoardByIdAsync(string boardUId);
        Task<Board?> AddBoardAsync(Board board);
        Task<bool> UpdateBoardAsync(Board board);
        Task<bool> DeleteBoardAsync(string boardUId);
        Task<Board?> GetBoardByNameAsync(string boardName);
    }
}
