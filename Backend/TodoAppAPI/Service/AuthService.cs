using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using TodoAppAPI.Data;
using TodoAppAPI.DTOs;
using TodoAppAPI.Interfaces;
using TodoAppAPI.Models;
using TodoAppAPI.Service;

namespace TodoAppAPI.Service
{
    public class AuthService : IAuthService
    {
        private readonly TodoDbContext _authService;
        private readonly IJwtService _jwtService;
        private readonly EmailService _emailService;

        public AuthService(TodoDbContext context, IJwtService jwtService, EmailService emailService)
        {
            _authService = context;
            _jwtService = jwtService;
            _emailService = emailService;
        }

        public async Task<AuthResponse> RegisterAsync(string userName, string email, string password)
        {
            if (await _authService.Users.AnyAsync(u => u.Email == email))
                return new AuthResponse { Message = "Email đã được sử dụng!" };

            // 1️ Băm mật khẩu
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);

            string code = new Random().Next(100000, 999999).ToString();


            var user = new User
            {
                UserUId = Guid.NewGuid().ToString(),
                UserName = userName,
                Email = email,
                PasswordHash = hashedPassword,
                VerificationTokenHash = BCrypt.Net.BCrypt.HashPassword(code),
                VerificationTokenExpiresAt = DateTime.UtcNow.AddMinutes(10),
                IsEmailVerified = false,
                RoleId = 2
            };

            _authService.Users.Add(user);
            await _authService.SaveChangesAsync();

            await _emailService.SendVerificationEmailAsync(email, code);

            // Thông báo cho frontend biết
            return new AuthResponse
            {
                Message = "Đăng ký thành công! Vui lòng kiểm tra email để nhập mã xác thực.",
                Email = email,
                UserName = userName
            };
        }


        public async Task<AuthResponse> LoginAsync(string email, string password)
        {
            var user = await _authService.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
                return new AuthResponse { Message = "Không tìm thấy tài khoản!" };

            if (!BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
                return new AuthResponse { Message = "Mật khẩu không đúng!" };

            if (!user.IsEmailVerified)
                return new AuthResponse { Message = "Tài khoản chưa xác thực. Vui lòng kiểm tra hộp thư." };

            var token = _jwtService.GenerateToken(user);

            return new AuthResponse
            {
                Message = "Đăng nhập thành công!",
                UserUId = user.UserUId,
                Token = token,
                UserName = user.UserName,
                Email = user.Email
            };
        }

        public async Task<AuthResponse> GoogleLoginAsync(string email, string name)
        {
            if (string.IsNullOrEmpty(email))
                return null;
            
            var user = await _authService.Users.FirstOrDefaultAsync(u => u.Email == email);
            if(user == null)
            {
                user = new User
                {
                    UserUId = Guid.NewGuid().ToString(),
                    UserName = string.IsNullOrWhiteSpace(name)
                    ? email.Split('@')[0]
                    : name.Trim(),
                    Email = email,
                    IsEmailVerified = true,
                    RoleId = 2,
                    Provider = "Google"
                };
                _authService.Users.Add(user);
                await _authService.SaveChangesAsync();
                if (user.UserUId == null)
                    Console.WriteLine("Không thể tạo tài khoản Google mới!");

            }
            else
            {
                if (!user.IsEmailVerified)
                {
                    user.IsEmailVerified = true;
                    await _authService.SaveChangesAsync();
                }
            }
            var token = _jwtService.GenerateToken(user);
            return new AuthResponse
            {
                Message = "Đăng nhập thành công!",
                UserUId = user.UserUId,
                Token = token,
                UserName = user.UserName,
                Email = user.Email
            };
        }

    }
}
