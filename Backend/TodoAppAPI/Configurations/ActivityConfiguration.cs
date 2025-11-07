using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using TodoAppAPI.Models;

namespace TodoAppAPI.Configurations
{
    public class ActivityConfiguration : IEntityTypeConfiguration<Activity>
    {
        public void Configure(EntityTypeBuilder<Activity> builder)
        {
            builder.ToTable("Activities");

            builder.HasKey(x => x.ActivUId);
            builder.Property(x => x.ActivUId)
                   .IsRequired()
                   .HasMaxLength(128);

            builder.Property(x => x.Action)
                   .IsRequired()
                   .HasMaxLength(200);

            builder.Property(x => x.CreatedAt)
                   .HasDefaultValueSql("GETDATE()");

            // Card → Activity: CASCADE
            builder.HasOne(x => x.Card)
                   .WithMany(c => c.Activities)
                   .HasForeignKey(x => x.CardUId)
                   .OnDelete(DeleteBehavior.Cascade); // ← CASCADE: Xóa card → xóa activities

            // User → Activity: NoAction
            builder.HasOne(x => x.User)
                   .WithMany(u => u.Activities)
                   .HasForeignKey(x => x.UserUId)
                   .OnDelete(DeleteBehavior.NoAction); // ← NoAction: Tránh conflict
        }
    }
}
