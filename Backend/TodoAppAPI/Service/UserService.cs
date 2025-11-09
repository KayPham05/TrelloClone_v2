using System.Text;
using Microsoft.EntityFrameworkCore;
using TodoAppAPI.Data;
using TodoAppAPI.DTOs;
using TodoAppAPI.Interfaces;
using TodoAppAPI.Models;

namespace TodoAppAPI.Service
{
    public class UserService : IUserService
    {
        private readonly TodoDbContext _context;
        private readonly EmailService _emailService;
        public UserService(TodoDbContext context, EmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        public async Task<IEnumerable<User>> GetAllAsync()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task<User?> GetByIdAsync(string userUId)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.UserUId == userUId);
        }

        public async Task AddAsync(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(User user)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(string userUId)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserUId == userUId);
            if (user != null)
            {
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<User?> GetUserByEmail(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            
        }

        public async Task<string> ResendVerificationCodeAsync(string email)
        {
            if (string.IsNullOrEmpty(email))
                throw new ArgumentException("Email không hợp lệ.");

            //  Tìm user theo email
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
                throw new Exception("Không tìm thấy tài khoản.");

            if (user.IsEmailVerified)
                return "Tài khoản này đã được xác thực trước đó.";

            //  Sinh mã xác thực mới
            string code = new Random().Next(100000, 999999).ToString();

            //  Cập nhật mã hash và thời gian hết hạn
            user.VerificationTokenHash = BCrypt.Net.BCrypt.HashPassword(code);
            user.VerificationTokenExpiresAt = DateTime.UtcNow.AddMinutes(10);

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            // Gửi mail
            await _emailService.SendVerificationEmailAsync(email, code);

            return " Mã xác thực mới đã được gửi tới email của bạn (có hiệu lực trong 10 phút).";
        }
    }
}
