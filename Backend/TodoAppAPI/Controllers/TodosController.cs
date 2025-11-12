using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TodoAppAPI.DTOs;
using TodoAppAPI.Interfaces;
using TodoAppAPI.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TodoAppAPI.Controllers
{
    [Route("v1/api/cards")]
    [ApiController]
    [Authorize]
    public class TodosController : ControllerBase
    {
        private readonly ICardsService _cardService;
        public TodosController(ICardsService todosService)
        {
            _cardService = todosService;
        }

        // GET: api/<TodosController>
        [HttpGet("by-board/{boardUId}")]
        public IActionResult GetByBoard(string boardUId)
        {
            var cards = _cardService.GetCardsByBoardId(boardUId);
            return Ok(cards);
        }

        // GET api/<TodosController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<TodosController>
        [HttpPost]
        public IActionResult Add(Card card)
        {
            if (_cardService.AddCard(card))
                return Ok("Thêm card thành công");
            return BadRequest("Không thể thêm card");

        }

        // PUT api/<TodosController>/5
        [HttpPut("{id}")]
        public IActionResult Update(string id, [FromBody] Card card)
        {
            card.CardUId = id;
            if (_cardService.UpdateCard(card))
                return Ok("Cập nhật card thành công");
            return NotFound("Card không tồn tại");
        }

        // DELETE api/<TodosController>/5
        [HttpDelete("{id}")]
        public IActionResult Delete(string id)
        {
            if (_cardService.DeleteCard(id))
                return Ok("Xóa card thành công");
            return NotFound("Card không tồn tại");
        }

        [HttpGet("{id}/description")]
        public IActionResult GetDescription(string id)
        {
            var card = _cardService.GetById(id);
            if (card == null)
                return NotFound("Không tìm thấy card");

            return Ok(new { description = card.Description });
        }

        [HttpPut("{CardUId}/update-list")]
        public async Task<IActionResult> UpdateListUId(string CardUId, [FromBody] UpdateListRequest body)
        {
            var success = await _cardService.UpdateListUid(CardUId, body.ListUId, body.UserUId);
            if (!success)
                return BadRequest(new { message = "Không thể cập nhật ListUId cho Card." });
            return Ok(new { message = "Cập nhật ListUId cho Card thành công." });
        }

        [HttpPut("{CardUId}/update-status")]
        public async Task<IActionResult> UpdateSatus(string CardUId, [FromQuery] string newStatus)
        {
            var success = await _cardService.UpdateStatus(CardUId,  newStatus);
            if (!success)
                return BadRequest(new { message = "Không thể cập nhật status cho Card." });
            return Ok(new { message = "Cập nhật status cho Card thành công." });
        }


    }
}
