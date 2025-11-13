import React, { useState } from "react";
import { Home, ChevronDown, ChevronRight, Plus, Menu } from "lucide-react";

export default function Sidebar({
    workspaces = [],
    onCreateWorkspace,
    onCreateBoard,
    onSelectBoard,
    className = "",
}) {
    const [expandedWorkspaces, setExpandedWorkspaces] = useState({});
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleWorkspace = (workspaceId) => {
        setExpandedWorkspaces((prev) => ({
            ...prev,
            [workspaceId]: !prev[workspaceId],
        }));
    };

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
        // Đóng tất cả workspace khi thu gọn
        if (!isCollapsed) {
            setExpandedWorkspaces({});
        }
    };

    return (
        <aside
            className={`${isCollapsed ? 'w-20' : 'w-72'} bg-white border-r flex flex-col transition-all duration-300 ease-in-out ${className}`}
        >
            {/* Header với nút toggle */}
            <div className="p-4 border-b">
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                    <button
                        onClick={toggleSidebar}
                        className="p-2 hover:bg-gray-100 rounded-lg transition flex-shrink-0"
                        title={isCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
                    >
                        <Menu size={20} className="text-gray-600" />
                    </button>

                    {!isCollapsed && (
                        <button className="flex items-center gap-3 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-lg flex-1 hover:bg-blue-100 transition">
                            <Home size={20} />
                            <span className="text-sm font-semibold">Home</span>
                        </button>
                    )}

                    {isCollapsed && (
                        <button
                            className="p-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition absolute left-1/2 -translate-x-1/2 mt-12"
                            title="Trang chủ"
                        >
                        </button>
                    )}
                </div>
            </div>

            {/* Workspaces */}
            <div className="flex-1 overflow-y-auto">
                <div className="p-4">
                    <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} mb-3`}>
                        {!isCollapsed && (
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Workspace
                            </h3>
                        )}
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
                            !isCollapsed && (
                                <div className="px-4 py-8 text-center">
                                    <p className="text-sm text-gray-500 mb-3">
                                        There is no workspace yet
                                    </p>
                                    <button
                                        onClick={onCreateWorkspace}
                                        className="text-sm text-blue-600 hover:underline font-medium"
                                    >
                                        Create First Workspace
                                    </button>
                                </div>
                            )
                        ) : (
                            workspaces.map((workspace) => (
                                <div key={workspace.workspaceUId}>
                                    <button
                                        onClick={() => !isCollapsed && toggleWorkspace(workspace.workspaceUId)}
                                        className={`flex items-center justify-between w-full px-3 py-2.5 hover:bg-gray-100 rounded-lg transition group ${isCollapsed ? 'justify-center' : ''
                                            }`}
                                        title={isCollapsed ? workspace.name : (workspace.description || "Không có mô tả")}
                                    >
                                        <div className={`flex items-center ${isCollapsed ? '' : 'gap-3 flex-1 min-w-0'}`}>
                                            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-md">
                                                {workspace.name?.charAt(0)?.toUpperCase() || "W"}
                                            </div>
                                            {!isCollapsed && (
                                                <div className="flex flex-col items-start flex-1 min-w-0">
                                                    <span className="text-sm font-semibold text-gray-800 truncate">
                                                        {workspace.name}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {workspace.boards?.length || 0} bảng
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        {!isCollapsed && (
                                            expandedWorkspaces[workspace.workspaceUId] ? (
                                                <ChevronDown
                                                    size={18}
                                                    className="text-gray-500 flex-shrink-0"
                                                />
                                            ) : (
                                                <ChevronRight
                                                    size={18}
                                                    className="text-gray-500 flex-shrink-0"
                                                />
                                            )
                                        )}
                                    </button>

                                    {/* Workspace Boards (collapsed) */}
                                    {!isCollapsed && expandedWorkspaces[workspace.workspaceUId] && (
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
                                                Add new board
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
            {!isCollapsed && (
              <div className="p-4 border-t bg-gray-50">
                <div className="text-xs text-gray-600 space-y-1">
                  <p className="font-semibold text-gray-700">💡 Tips</p>
                  <p>• Click into workspace to view your boards </p>
                  <p>• Create workspace for teamwork</p>
                </div>
                </div>
            )}
        </aside>
  );
}