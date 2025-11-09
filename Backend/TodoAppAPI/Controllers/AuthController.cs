using System.Net.Http.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using TodoAppAPI.Data;
using TodoAppAPI.DTOs;
using TodoAppAPI.Interfaces;


// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TodoAppAPI.Controllers
{
    [Route("v1/api/login")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        // POST api/<UserController>
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var result = await _authService.RegisterAsync(request.UserName, request.Email, request.Password);
            return Ok(result);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var result = await _authService.LoginAsync(request.Email, request.Password);
            return Ok(result);
        }

        [HttpPost("Google-login")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest request)
        {
            if (string.IsNullOrEmpty(request.AccessToken))
                return BadRequest("Thiếu access_token từ google");
            var httpClient = new HttpClient();
            var googleRespone = await httpClient.GetAsync($"https://www.googleapis.com/oauth2/v2/userinfo?access_token={request.AccessToken}");

            if (!googleRespone.IsSuccessStatusCode)
                return BadRequest("Access token Google không hợp lệ.");
            var json = await googleRespone.Content.ReadAsStringAsync();
            var googleUser = JsonConvert.DeserializeObject<GoogleUserInfo>(json);

            if (googleUser == null || string.IsNullOrEmpty(googleUser.Email))
                return BadRequest("Không thể lấy thông tin người dùng Google.");

            var user = await _authService.GoogleLoginAsync(googleUser.Email, googleUser.Name);
            return Ok(user);
        }
    }
}
