using Microsoft.EntityFrameworkCore;
using TodoAppAPI.Data;
using TodoAppAPI.Interfaces;
using TodoAppAPI.Models;

namespace TodoAppAPI.Service
{
    public class NotificationService : INotificationService
    {
        private readonly TodoDbContext _context;

        public NotificationService(TodoDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Notification>> GetNotificationsAsync(string userId, int page, int pageSize)
        {
            return await _context.Notifications
                .Include(n => n.Actor)
                .Where(n => n.RecipientId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<bool> MarkAsReadAsync(string notiId)
        {
            var noti = await _context.Notifications.FindAsync(notiId);
            if (noti == null) return false;

            noti.Read = true;
            noti.ReadAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<int> MarkAllAsReadAsync(string userId)
        {
            var unread = await _context.Notifications
                .Where(n => n.RecipientId == userId && !n.Read)
                .ToListAsync();

            foreach (var n in unread)
            {
                n.Read = true;
                n.ReadAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return unread.Count;
        }
    }
}
