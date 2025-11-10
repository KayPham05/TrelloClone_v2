using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TodoAppAPI.Models;

namespace TodoAppAPI.Configurations
{
    public class NotificationConfiguration : IEntityTypeConfiguration<Notification>
    {
        public void Configure(EntityTypeBuilder<Notification> builder)
        {
            builder.ToTable("Notifications");

            // ===== Khóa chính =====
            builder.HasKey(x => x.NotiId);
            builder.Property(x => x.NotiId)
                   .IsRequired()
                   .HasMaxLength(128);

            // ===== Quan hệ User =====
            // Người nhận
            builder.HasOne(n => n.Recipient)
                   .WithMany(u => u.ReceivedNotifications)
                   .HasForeignKey(n => n.RecipientId)
                   .HasPrincipalKey(u => u.UserUId)
                   .OnDelete(DeleteBehavior.Cascade).IsRequired();

            // Người tạo
            builder.HasOne(n => n.Actor)
                   .WithMany(u => u.SentNotifications)
                   .HasForeignKey(n => n.ActorId)
                   .HasPrincipalKey(u => u.UserUId)
                   .OnDelete(DeleteBehavior.NoAction).IsRequired(false);

            // ===== Quan hệ ngữ cảnh (Board / List / Card) =====
            builder.HasOne(n => n.Board)
                   .WithMany()
                   .HasForeignKey(n => n.BoardId)
                   .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(n => n.List)
                   .WithMany()
                   .HasForeignKey(n => n.ListId)
                   .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(n => n.Card)
                   .WithMany()
                   .HasForeignKey(n => n.CardId)
                   .OnDelete(DeleteBehavior.NoAction);

            // ===== Enum & dữ liệu =====
            builder.Property(x => x.Type).IsRequired();
            builder.Property(x => x.Title).IsRequired().HasMaxLength(140);
            builder.Property(x => x.Message).IsRequired().HasMaxLength(500);
            builder.Property(x => x.Link).HasMaxLength(300);

            // ===== Thời gian & trạng thái =====
            builder.Property(x => x.CreatedAt).IsRequired().HasDefaultValueSql("GETUTCDATE()");
            builder.Property(x => x.ReadAt).IsRequired(false);
            builder.Property(x => x.Read).IsRequired().HasDefaultValue(false);

            // ===== Chỉ mục =====
            builder.HasIndex(x => new { x.RecipientId, x.Read, x.CreatedAt });
            builder.HasIndex(x => new { x.BoardId, x.CreatedAt });
            builder.HasIndex(x => new { x.CardId, x.CreatedAt });
        }
    }
}
