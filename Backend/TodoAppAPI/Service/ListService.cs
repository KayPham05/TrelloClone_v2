using Microsoft.EntityFrameworkCore;
using TodoAppAPI.Data;
using TodoAppAPI.Interfaces;
using TodoAppAPI.Models;

namespace TodoAppAPI.Service
{
    public class ListService : IListService
    {
        private readonly TodoDbContext _context;
        public ListService(TodoDbContext context)
        {
            _context = context;
        }
        public async Task<List> AddListAsync(List list)
        {
            try
            {
                list.ListUId = Guid.NewGuid().ToString();
                _context.Lists.Add(list);
                await _context.SaveChangesAsync();
                return list;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi khi thêm list: {ex.Message}");
                return null;

            }
        }

        public async Task<bool> DeleteListAsync(string listUId)
        {
            try
            {
                var list = await _context.Lists.FirstOrDefaultAsync(l => l.ListUId == listUId);
                if(list == null) return false;
                _context.Lists.Remove(list);
                await _context.SaveChangesAsync();
                return true;
            }
            catch(Exception ex)
            {
                Console.WriteLine($"Lỗi khi xóa list: {ex.Message}");
                return false;
            }
        }

        public async Task<List<List>> GetAllListsByBoardUidAsync(string boardUId)
        {
            return await _context.Lists
                 .Where(l => l.BoardUId == boardUId && l.Status == "Active")
                 .OrderBy(l => l.Position)
                 .ToListAsync();
        }

        public Task<List> GetListByIdAsync(string listUId)
        {
            throw new NotImplementedException();
        }

        public Task<bool> UpdateListAsync(List list)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> UpdateStatus(List list)
        {
            try
            {
                var listUpdate = await _context.Lists.FirstOrDefaultAsync(l => l.ListUId == list.ListUId);
                if (listUpdate == null) return false;
                listUpdate.Status = list.Status;
                _context.Lists.Update(listUpdate);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi khi cập nhật trạng thái list: {ex.Message}");
                return false;


            }
        }
    }
}
