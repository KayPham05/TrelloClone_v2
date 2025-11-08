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

        [HttpPost("AddBio")]
        public async Task<IActionResult> AddBio([FromQuery] string userUId, [FromQuery] string Bio)
        {
            if (userUId == null) return BadRequest("userUId is null");
            var result = await _userService.AddBioByUserUId(userUId, Bio);
            if (!result)
            {
                return BadRequest("Thêm không thành công");
            }
            return Ok("Thêm thành công");
        }
        [HttpPost("AddUsername")]
        public async Task<IActionResult> AddUsername([FromQuery] string userUId, [FromQuery] string username)
        {
            if (userUId == null || username == null) return BadRequest("userUId is null or username is null");
            var result = await _userService.AddUserUSerName(userUId, username);
            if (!result)
            {
                return BadRequest("Thêm không thành công");
            }
            return Ok("Thêm thành công");
        }
        [HttpGet("GetBio")]
        public async Task<IActionResult> GetBio([FromQuery] string userUId)
        {
            if (string.IsNullOrEmpty(userUId))
                return BadRequest("userUId is null");
            var bio = await _userService.GetBioByUserUId(userUId);
            return Ok(new { bio = bio ?? "" });
        }
        [HttpGet("GetUsername")]
        public async Task<IActionResult> GetUsername([FromQuery] string userUId)
        {
            if (string.IsNullOrEmpty(userUId)) return BadRequest("userUId is null");
            var userName = await _userService.GetUserUserName(userUId);
            return Ok(new { userName = userName ?? "" });
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
    }
}
