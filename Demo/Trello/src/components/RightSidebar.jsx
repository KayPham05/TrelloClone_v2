import React, { useState } from "react";
import { Clock, Plus, TrendingUp, Menu } from "lucide-react";

export default function RightSidebar({
    recentBoards = [],
    onCreateBoard,
    onSelectBoard,
    className = ""
}) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const getBoardColor = (index) => {
        const colors = [
            "from-blue-500 to-blue-600",
            "from-purple-500 to-purple-600",
            "from-orange-500 to-orange-600",
            "from-green-500 to-green-600",
            "from-pink-500 to-pink-600",
            "from-indigo-500 to-indigo-600",
        ];
        return colors[index % colors.length];
    };

    // Group boards by workspace
    const workspaceGroups = recentBoards.reduce((acc, board) => {
        const wsName = board.workspaceName || "Personal";
        if (!acc[wsName]) acc[wsName] = [];
        acc[wsName].push(board);
        return acc;
    }, {});

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
  <aside
    className={`${isCollapsed ? 'w-20' : 'w-80'}
      bg-white dark:bg-[#2B2D31]
      border-l border-gray-200 dark:border-[#3F4147]
      flex flex-col transition-all duration-300 ease-in-out ${className}`}
  >

    {/* Header */}
    <div className="p-4 border-b border-gray-200 dark:border-[#3F4147] flex items-center justify-between dark:bg-[#1E1F22]">
      {!isCollapsed && (
        <h2 className="text-sm font-semibold text-gray-700 dark:text-[#E8EAED]">Dashboard
        </h2>
      )}
      <button
        onClick={toggleSidebar}
        className="p-2 hover:bg-gray-100 dark:hover:bg-[#3A3C42] rounded-lg transition"
        title={isCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
      >
        <Menu size={20} className="text-gray-600 dark:text-[#E8EAED]" />
      </button>
    </div>

    <div className="p-5 flex-1 overflow-y-auto dark:text-[#E8EAED]">

      {/* Workspace Info */}
      <div className="mb-6">
        <h3
          className={`text-sm font-semibold text-gray-800 dark:text-[#E8EAED] mb-3 flex items-center ${
            isCollapsed ? 'justify-center' : 'gap-2'
          }`}
        >
          <TrendingUp size={16} className="text-gray-600 dark:text-[#9AA0A6]" />
          {!isCollapsed && "My Workspace"}
        </h3>

        {Object.keys(workspaceGroups).length === 0 ? (
          !isCollapsed && (
            <div className="text-xs text-gray-500 dark:text-[#9AA0A6] italic 
                            bg-gray-50 dark:bg-[#1E1F22] 
                            p-4 rounded-lg 
                            border border-gray-200 dark:border-[#3F4147]">
              You have no board yet.
            </div>
          )
        ) : (
          <div className="space-y-2">
            {Object.entries(workspaceGroups).map(([wsName, boards]) => (
              <div
                key={wsName}
                className={`flex items-center ${
                  isCollapsed ? 'justify-center' : 'justify-between'
                }
                p-3 
                bg-gradient-to-r from-gray-50 to-gray-100 
                dark:from-[#1E1F22] dark:to-[#2B2D31]
                rounded-lg 
                border border-gray-200 dark:border-[#3F4147]
                hover:border-blue-300 dark:hover:border-[#8AB4F8]
                transition`}
                title={isCollapsed ? `${wsName} (${boards.length} bảng)` : ''}
              >
                {isCollapsed ? (
                  <div className="relative">
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg 
                                    flex items-center justify-center text-white text-sm font-bold">
                      {wsName.charAt(0).toUpperCase()}
                    </div>
                    <span className="absolute -top-1 -right-1 w-5 h-5 
                                      bg-blue-600 text-white text-xs font-bold rounded-full 
                                      flex items-center justify-center">
                      {boards.length}
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg 
                                      flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {wsName.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-[#E8EAED] truncate">
                        {wsName}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-[#B5BAC1] font-semibold 
                                     bg-white dark:bg-[#1E1F22] 
                                     px-2 py-1 rounded-full">
                      {boards.length}
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recently Viewed */}
      <div className="mb-6">
        <div
          className={`flex items-center mb-3 ${
            isCollapsed ? 'justify-center' : 'gap-2'
          }`}
        >
          <Clock size={18} className="text-gray-600 dark:text-[#9AA0A6]" />
          {!isCollapsed && (
            <h3 className="text-sm font-semibold text-gray-800 dark:text-[#E8EAED]">
              Recently Viewed
            </h3>
          )}
        </div>

        {recentBoards.length === 0 ? (
          !isCollapsed && (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 
                            dark:from-[#1E1F22] dark:to-[#2B2D31]
                            rounded-lg p-8 
                            text-center 
                            border-2 border-dashed border-gray-300 dark:border-[#3F4147]">
              <Clock size={36} className="mx-auto text-gray-400 dark:text-[#9AA0A6] mb-3" />
              <p className="text-sm text-gray-500 dark:text-[#B5BAC1] font-medium">
                There is no board yet
              </p>
              <p className="text-xs text-gray-400 dark:text-[#9AA0A6] mt-1">
                Your accessed boards are showed here.
              </p>
            </div>
          )
        ) : (
          <div className="space-y-2">
            {recentBoards
              .slice(0, isCollapsed ? 5 : recentBoards.length)
              .map((board, index) => (
                <div
                  key={board.boardUId}
                  onClick={() => onSelectBoard && onSelectBoard(board)}
                  className={`flex items-center ${
                    isCollapsed ? 'justify-center' : 'gap-3'
                  }
                  p-3
                  hover:bg-gray-50 dark:hover:bg-[#3A3C42]
                  rounded-lg cursor-pointer
                  transition group 
                  border border-transparent hover:border-gray-200 dark:hover:border-[#3F4147]`}
                  title={
                    isCollapsed
                      ? `${board.boardName} - ${board.workspaceName || 'Personal'}`
                      : ''
                  }
                >
                  <div
                    className={`${isCollapsed ? 'w-9 h-9' : 'w-10 h-9'}
                    bg-gradient-to-br ${getBoardColor(index)}
                    rounded-lg flex-shrink-0 shadow-md group-hover:shadow-lg transition`}
                  ></div>

                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 dark:text-[#E8EAED] truncate group-hover:text-blue-600 dark:group-hover:text-[#8AB4F8] transition">
                        {board.boardName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-[#9AA0A6] truncate">
                        {board.workspaceUId ? board.workspaceName || "Workspace" : "Personal"}
                      </p>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Fast Action */}
      <div>
        {!isCollapsed && (
          <h3 className="text-sm font-semibold text-gray-800 dark:text-[#E8EAED] mb-3">
            Fast action
          </h3>
        )}
        <div className="space-y-3">
          <button
            onClick={onCreateBoard}
            className={`w-full flex items-center ${
              isCollapsed ? 'justify-center p-3' : 'gap-3 p-3'
            }
            bg-gradient-to-r from-blue-50 to-blue-100 dark:from-[#1E1F22] dark:to-[#2B2D31]
            hover:from-blue-100 hover:to-blue-200 dark:hover:bg-[#3A3C42]
            border border-blue-200 dark:border-[#3F4147]
            rounded-lg transition group`}
            title={isCollapsed ? "Tạo bảng mới" : ''}
          >
            <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition shadow-md">
              <Plus size={20} className="text-white" />
            </div>
            {!isCollapsed && (
              <span className="text-sm font-semibold text-blue-700 dark:text-[#8AB4F8] group-hover:text-blue-800 dark:group-hover:text-[#A8C7FA] transition">
                Create New Board
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Tips */}
      {!isCollapsed && (
        <div className="mt-6 bg-gradient-to-br from-purple-50 to-pink-50 
                        dark:from-[#1E1F22] dark:to-[#2B2D31]
                        rounded-lg p-4 border border-purple-200 dark:border-[#3F4147]">
          <h4 className="text-sm font-semibold text-purple-900 dark:text-[#E8EAED] mb-2 flex items-center gap-2">
            💡 Use Tips
          </h4>
          <ul className="text-xs text-purple-700 dark:text-[#B5BAC1] space-y-1.5">
            <li className="flex items-start gap-2">
              <span className="text-purple-500 dark:text-[#8AB4F8] font-bold">•</span>
              <span>Create workspace for group management</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 dark:text-[#8AB4F8] font-bold">•</span>
              <span>Add collaborators to the board</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 dark:text-[#8AB4F8] font-bold">•</span>
              <span>User labels for task classification</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  </aside>
);

}