using Microsoft.EntityFrameworkCore;
using TodoAppAPI.Data;
using TodoAppAPI.Interfaces;
using TodoAppAPI.Models;

namespace TodoAppAPI.Service
{
    public class UserInboxCardService : IUserInboxCard
    {
        private readonly TodoDbContext _context;
        public UserInboxCardService(TodoDbContext context)
        {
            _context = context;
        }
        public async Task<bool> AddCardInbox(string userUId, string cardUId)
        {
            try
            {
                UserInboxCard userInboxCard = new UserInboxCard
                {
                    UserUId = userUId,
                    CardUId = cardUId,
                    AddedAt = DateTime.UtcNow
                };
                _context.UserInboxCards.Add(userInboxCard);
                await _context.SaveChangesAsync();
                return true;
            }
            catch(Exception ex)
            {
                Console.WriteLine($"Lỗi khi thêm Card vào Inbox: {ex.Message}");
                return false;
            }


        }

        public async Task<List<Card>> GetCardInbox(string userUId)
        {

            var cards = await _context.UserInboxCards.Where(uic => uic.UserUId == userUId).Include(uic => uic.Card)
                            .Select(uic => uic.Card).ToListAsync();
            return cards;

        }
    }
}
