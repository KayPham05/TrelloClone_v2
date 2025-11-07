using TodoAppAPI.Models;

namespace TodoAppAPI.Interfaces
{
    public interface IUserInboxCard
    {
        Task<List<Card>> GetCardInbox(string userUId);
        Task<bool> AddCardInbox(string userUId, string cardUId);
    }
}
