using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TodoAppAPI.Models;

namespace TodoAppAPI.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.ToTable("Users");

            builder.HasKey(x => x.UserUId);
            builder.Property(x => x.UserUId)
                   .IsRequired()
                   .HasMaxLength(128);

            builder.Property(x => x.UserName)
                   .IsRequired()
                   .HasMaxLength(100);

            builder.Property(x => x.Email)
                   .IsRequired()
                   .HasMaxLength(200);

            builder.Property(x => x.PasswordHash)
                   .IsRequired()
                   .HasMaxLength(200);
            builder.Property(x => x.IsEmailVerified)
                   .HasDefaultValue(false);

            builder.Property(x => x.VerificationTokenHash)
                   .HasMaxLength(256)
                   .IsRequired(false);

            builder.Property(u => u.VerificationTokenExpiresAt)
                   .IsRequired(false);

            builder.Property(x => x.Provider)
                   .IsRequired();

            builder.Property(x => x.CreatedAt)
                   .HasDefaultValueSql("GETDATE()");

            builder.HasOne(x => x.Role)
                   .WithMany(r => r.Users)
                   .HasForeignKey(x => x.RoleId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasIndex(x => x.Email).IsUnique();
        }
    }

}
