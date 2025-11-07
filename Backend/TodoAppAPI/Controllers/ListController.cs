using Microsoft.AspNetCore.Mvc;
using TodoAppAPI.Interfaces;
using TodoAppAPI.Models;
using TodoAppAPI.Service;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TodoAppAPI.Controllers
{
    [Route("v1/api/lists")]
    [ApiController]
    public class ListController : ControllerBase
    {
        private readonly IListService _listService;
        public ListController(IListService listService)
        {
            _listService = listService;
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
        public async Task<IActionResult> CreateList([FromBody] List list)
        {
            ModelState.Remove("ListUId");
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var result = await _listService.AddListAsync(list);
            if (result == null)
                return StatusCode(500, new { message = "Lỗi khi tạo List." });
            return Ok(result);
        }

        [HttpPut("{listUId}")]
        public async Task<IActionResult> UpdateStatus(string listUId ,[FromQuery] string newStatus)
        {
            List list = new List();
            list.ListUId = listUId;
            list.Status = newStatus;
            var success = await _listService.UpdateStatus(list);
            if (!success) return BadRequest(new {message = "Không tìm thấy list để sửa"});
            return Ok(new {message = "cập nhật trạng thái thành công"});

        }

    }
}
 