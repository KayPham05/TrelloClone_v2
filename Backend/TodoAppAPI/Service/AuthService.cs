using Microsoft.EntityFrameworkCore;
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

        public AuthService(TodoDbContext authService, IJwtService jwtService)
        {
            _authService = authService;
            _jwtService = jwtService;
        }

        public async Task<AuthResponse> RegisterAsync(string userName, string email, string password)
        {
            if (await _authService.Users.AnyAsync(u => u.Email == email))
                return new AuthResponse { Message = "Email đã được sử dụng!" };

            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);

            var user = new User
            {
                UserUId = Guid.NewGuid().ToString(),
                UserName = userName,
                Email = email,
                PasswordHash = hashedPassword,
                RoleId = 2 // mặc định là User
            };

            _authService.Users.Add(user);
            await _authService.SaveChangesAsync();

            return new AuthResponse
            {
                Message = "Đăng ký thành công!",
                UserName = user.UserName,
                Email = user.Email
            };
        }

        public async Task<AuthResponse> LoginAsync(string email, string password)
        {
            var user = await _authService.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
                return new AuthResponse { Message = "Không tìm thấy tài khoản!" };

            bool verified = BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
            if (!verified)
                return new AuthResponse { Message = "Mật khẩu không đúng!" };

            // Tạo JWT token thật
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
