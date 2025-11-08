using Microsoft.AspNetCore.Mvc;
using TodoAppAPI.Interfaces;

namespace TodoAppAPI.Controllers
{
    [Route("v1/api/notifications")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        /// <summary>
        /// Lấy danh sách thông báo gần đây của người dùng
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetNotifications([FromQuery] string userId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            if (string.IsNullOrEmpty(userId))
                return BadRequest(new { message = "userId is required" });

            var items = await _notificationService.GetNotificationsAsync(userId, page, pageSize);
            return Ok(items);
        }

        /// <summary>
        /// Đánh dấu 1 thông báo là đã đọc
        /// </summary>
        [HttpPatch("{notiId}/read")]
        public async Task<IActionResult> MarkAsRead(string notiId)
        {
            var result = await _notificationService.MarkAsReadAsync(notiId);
            if (!result)
                return NotFound(new { message = "Notification not found" });
            return Ok(new { message = "Marked as read" });
        }

        /// <summary>
        /// Đánh dấu tất cả thông báo là đã đọc cho người dùng
        /// </summary>
        [HttpPatch("read-all")]
        public async Task<IActionResult> MarkAllAsRead([FromQuery] string userId)
        {
            if (string.IsNullOrEmpty(userId))
                return BadRequest(new { message = "userId is required" });

            var count = await _notificationService.MarkAllAsReadAsync(userId);
            return Ok(new { message = $"Marked {count} notifications as read" });
        }
    }
}
