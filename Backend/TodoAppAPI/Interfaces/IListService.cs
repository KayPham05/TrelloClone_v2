using TodoAppAPI.Models;

namespace TodoAppAPI.Interfaces
{
    public interface IListService
    {
        Task<List<List>> GetAllListsByBoardUidAsync(string boardUId);
        Task<List> GetListByIdAsync(string listUId);
        Task<List> AddListAsync(List list);
        Task<bool> UpdateListAsync(List list);
        Task<bool> DeleteListAsync(string listUId);
        Task<bool> UpdateStatus(List list);
    }
}
