using Microsoft.AspNetCore.Mvc;
using TodoAppAPI.DTOs;
using TodoAppAPI.Interfaces;


// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TodoAppAPI.Controllers
{
    [Route("v1/api/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        public readonly IUserService _userService;
        public UserController(IUserService userService)
        {
            _userService = userService;
        }


        [HttpGet("get-by-email")]
        public async Task<IActionResult> GetUserByEmail([FromQuery] string email)
        {
            if (string.IsNullOrEmpty(email))
                return BadRequest("Email không hợp lệ");

            var user = await _userService.GetUserByEmail(email);

            if (user == null)
                return NotFound("Không tìm thấy user với email này");

            return Ok(user);
        }

        //// PUT api/<UserController>/5
        //[HttpPut("{id}")]
        //public void Put(int id, [FromBody] string value)
        //{
        //}

        //// DELETE api/<UserController>/5
        //[HttpDelete("{id}")]
        //public void Delete(int id)
        //{
        //}

        [HttpPost("verify-code")]
        public async Task<IActionResult> VerifyCode([FromBody] VerifyCodeRequest req)
        {
            if (string.IsNullOrEmpty(req.Email) || string.IsNullOrEmpty(req.Code))
                return BadRequest("Thiếu thông tin xác thực.");

            //  Lấy user theo email
            var user = await _userService.GetUserByEmail(req.Email);
            if (user == null)
                return NotFound("Không tìm thấy tài khoản.");

            //  Nếu đã xác thực rồi thì báo luôn
            if (user.IsEmailVerified)
                return Ok("Tài khoản đã được xác thực trước đó.");

            //  Kiểm tra hết hạn mã
            if (user.VerificationTokenExpiresAt == null || user.VerificationTokenExpiresAt < DateTime.UtcNow)
                return BadRequest(" Mã xác thực đã hết hạn. Vui lòng yêu cầu mã mới.");

            //  Kiểm tra mã hợp lệ
            bool valid = BCrypt.Net.BCrypt.Verify(req.Code, user.VerificationTokenHash);
            if (!valid)
                return BadRequest(" Mã xác thực không hợp lệ.");

            //  Cập nhật trạng thái xác thực
            user.IsEmailVerified = true;
            user.VerificationTokenHash = null;
            user.VerificationTokenExpiresAt = null;

            await _userService.UpdateAsync(user);

            return Ok(" Xác thực thành công! Bạn có thể đăng nhập ngay bây giờ.");
        }


        [HttpPost("resend-code")]
        public async Task<IActionResult> ResendVerificationCode([FromQuery] string email)
        {
            try 
            {
                var resultMessage = await _userService.ResendVerificationCodeAsync(email);
                return Ok(resultMessage);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

    }
}
