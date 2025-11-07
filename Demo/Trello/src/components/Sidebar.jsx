import React, { useState } from "react";
import { Home, ChevronDown, ChevronRight, Plus } from "lucide-react";

export default function Sidebar({
  workspaces = [],
  onCreateWorkspace,
  onCreateBoard,
  onSelectBoard,
  className = "",
}) {
  const [expandedWorkspaces, setExpandedWorkspaces] = useState({});

  const toggleWorkspace = (workspaceId) => {
    setExpandedWorkspaces((prev) => ({
      ...prev,
      [workspaceId]: !prev[workspaceId],
    }));
  };

  return (
    <aside className={`w-72 bg-white border-r flex flex-col ${className}`}>
      {/* Menu chính */}
      <div className="p-4 border-b">
        <button className="flex items-center gap-3 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-lg w-full hover:bg-blue-100 transition">
          <Home size={20} />
          <span className="text-sm font-semibold">Trang chủ</span>
        </button>
      </div>

      {/* Workspaces */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Không gian làm việc
            </h3>
            <button
              onClick={onCreateWorkspace}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition"
              title="Tạo workspace mới"
            >
              <Plus size={16} className="text-gray-600" />
            </button>
          </div>

          <div className="space-y-1">
            {workspaces.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-gray-500 mb-3">
                  Chưa có workspace nào
                </p>
                <button
                  onClick={onCreateWorkspace}
                  className="text-sm text-blue-600 hover:underline font-medium"
                >
                  Tạo workspace đầu tiên
                </button>
              </div>
            ) : (
              workspaces.map((workspace) => (
                <div key={workspace.workspaceUId}>
                  <button
                    onClick={() => toggleWorkspace(workspace.workspaceUId)}
                    className="flex items-center justify-between w-full px-3 py-2.5 hover:bg-gray-100 rounded-lg transition group"
                    title={workspace.description || "Không có mô tả"}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-md">
                        {workspace.name?.charAt(0)?.toUpperCase() || "W"}
                      </div>
                      <div className="flex flex-col items-start flex-1 min-w-0">
                        <span className="text-sm font-semibold text-gray-800 truncate">
                          {workspace.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {workspace.boards?.length || 0} bảng
                        </span>
                      </div>
                    </div>
                    {expandedWorkspaces[workspace.workspaceUId] ? (
                      <ChevronDown
                        size={18}
                        className="text-gray-500 flex-shrink-0"
                      />
                    ) : (
                      <ChevronRight
                        size={18}
                        className="text-gray-500 flex-shrink-0"
                      />
                    )}
                  </button>

                  {/* Workspace Boards (collapsed) */}
                  {expandedWorkspaces[workspace.workspaceUId] && (
                    <div className="ml-11 mt-1 space-y-1 mb-2">
                      {(workspace.boards || []).map((board) => (
                        <button
                          key={board.boardUId}
                          onClick={() => onSelectBoard && onSelectBoard(board)}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition flex items-center gap-2 group"
                        >
                          <div className="w-1 h-1 rounded-full bg-gray-400 group-hover:bg-blue-600"></div>
                          <span className="truncate group-hover:text-blue-600">
                            {board.boardName}
                          </span>
                        </button>
                      ))}
                      <button
                        onClick={() => onCreateBoard && onCreateBoard(workspace.workspaceUId)}
                        className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition flex items-center gap-2 font-medium"
                      >
                        <Plus size={14} />
                        Thêm bảng mới
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Footer tips */}
      <div className="p-4 border-t bg-gray-50">
        <div className="text-xs text-gray-600 space-y-1">
          <p className="font-semibold text-gray-700">💡 Tips</p>
          <p>• Nhấn vào workspace để xem bảng</p>
          <p>• Tạo workspace để làm việc nhóm</p>
        </div>
      </div>
    </aside>
  );
}