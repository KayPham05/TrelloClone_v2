using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TodoAppAPI.Interfaces;
using TodoAppAPI.Models;
using TodoAppAPI.Service;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TodoAppAPI.Controllers
{
    [Route("v1/api/lists")]
    [ApiController]
    [Authorize]
    public class ListController : ControllerBase
    {
        private readonly IListService _listService;
        private readonly IActivity _activity;
        public ListController(IListService listService, IActivity activity)
        {
            _listService = listService;
            _activity = activity;
        }
        // GET: api/<ListController>
        [HttpGet]
        public async Task<IActionResult> GetAllList([FromQuery] string boardUId)
        {
            if (string.IsNullOrEmpty(boardUId))
                return BadRequest("boardUId is required");
            var lists = await _listService.GetAllListsByBoardUidAsync(boardUId);
            return Ok(lists);
        }


        [HttpPost]
        public async Task<IActionResult> CreateList([FromBody] List list, [FromQuery] string userUId)
        {
            ModelState.Remove("ListUId");
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            if (string.IsNullOrEmpty(userUId))
                return BadRequest("userUId is required");

            var result = await _listService.AddListAsync(list);
            if (result == null)
                return StatusCode(500, new { message = "Lỗi khi tạo List." });
            _ = _activity.AddActivity(userUId, $"created list '{list.ListName}'");
            return Ok(result);
        }

        [HttpPut("{listUId}")]
        public async Task<IActionResult> UpdateStatus(string listUId ,[FromQuery] string newStatus, [FromQuery] string userUId)
        {
            if (string.IsNullOrEmpty(newStatus))
                return BadRequest("newStatus is required");

            if (string.IsNullOrEmpty(userUId))
                return BadRequest("userUId is required");
            var existingList = await _listService.GetListByIdAsync(listUId);
            if (existingList == null)
                return NotFound(new { message = "Không tìm thấy list" });

            var list = new List
            {
                ListUId = listUId,
                Status = newStatus
            };

            var success = await _listService.UpdateStatus(list);
            if (!success)
                return BadRequest(new { message = "Không thể cập nhật status" });

            _ = _activity.AddActivity(userUId, $"updated list '{existingList.ListName}' status to '{newStatus}'");
            return Ok(new {message = "cập nhật trạng thái thành công"});
        }

    }
}
 