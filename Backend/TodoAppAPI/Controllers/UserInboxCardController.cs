using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TodoAppAPI.Interfaces;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TodoAppAPI.Controllers
{
    [Route("v1/api/user-inbox")]
    [ApiController]
    [Authorize]
    public class UserInboxCardController : ControllerBase
    {
        private readonly IUserInboxCard _userInboxCard;
        public UserInboxCardController(IUserInboxCard userInboxCard)
        {
            _userInboxCard = userInboxCard;
        }
        [HttpGet("{userUId}")]
        public async Task<IActionResult> GetUserInboxCards(string userUId)
        {
            var cards = await _userInboxCard.GetCardInbox(userUId);
            return Ok(cards);
        }

        [HttpPost("{userUId}")]
        public async Task<IActionResult> AddUserInboxCard(string userUId ,[FromQuery] string cardUId )
        {
            var result = await _userInboxCard.AddCardInbox(userUId, cardUId);
            if (result)
                return Ok(new { message = "Thêm card vào inbox thành công" });
            return StatusCode(500, new { message = "Lỗi khi thêm card vào inbox" });
        }
    }
}
