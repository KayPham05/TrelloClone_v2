namespace TodoAppAPI.Models
{
    public class Notification
    {
        public string NotiId { get; set; } = Guid.NewGuid().ToString();

        // Recipient (người nhận)
        public string RecipientId { get; set; } = default!;
        public User Recipient { get; set; }

        // Actor (ai tạo ra) - tùy chọn
        public string? ActorId { get; set; }
        public User Actor { get; set; }

        // Phân loại
        public NotificationType Type { get; set; } = NotificationType.Comment;

        // Nội dung
        public string Title { get; set; } = default!;
        public string Message { get; set; } = default!;
        public string? Link { get; set; }   // deep-link tới UI

        // Ngữ cảnh (tùy chọn)
        public string? BoardId { get; set; }
        public virtual Board? Board { get; set; }
        public string? ListId { get; set; }
        public virtual List? List { get; set; }
        public string? CardId { get; set; }
        public virtual Card? Card { get; set; }

        // Trạng thái
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ReadAt { get; set; }
        public bool Read { get; set; } = false;
    }
}
