import React, { useState } from "react";
import { Clock, Plus, TrendingUp, Menu } from "lucide-react";

export default function RightSidebar({
  recentBoards = [],
  onCreateBoard,
  onSelectBoard,
  className = "",
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
    const wsName = board.workspaceName || "Cá nhân";
    if (!acc[wsName]) acc[wsName] = [];
    acc[wsName].push(board);
    return acc;
  }, {});

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
  <aside
    className={`
      ${isCollapsed ? "w-20" : "w-80"}
      flex flex-col border-l transition-all duration-300 ease-in-out
      bg-white text-gray-800
      dark:bg-[#1E1F22] dark:text-gray-200 dark:border-[#2C2D30]
      ${className}
    `}
  >
    {/* Header */}
    <div
      className="
        p-4 border-b
        border-gray-200 dark:border-[#2C2D30]
        flex items-center justify-between
      "
    >
      {!isCollapsed && (
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
          Bảng điều khiển
        </h2>
      )}

      <button
        onClick={toggleSidebar}
        className="
          p-2 rounded-lg transition 
          hover:bg-gray-100 dark:hover:bg-[#2A2B2E]
        "
      >
        <Menu size={20} className="text-gray-600 dark:text-gray-300" />
      </button>
    </div>

    <div className="p-5 flex-1 overflow-y-auto space-y-8">

      {/* === WORKSPACE GROUP === */}
      <div>
        <h3
          className={`
            text-sm font-semibold mb-3 flex items-center
            text-gray-800 dark:text-gray-200
            ${isCollapsed ? "justify-center" : "gap-2"}
          `}
        >
          <TrendingUp
            size={16}
            className="text-gray-600 dark:text-gray-300"
          />
          {!isCollapsed && "Không gian làm việc của tôi"}
        </h3>

        {Object.keys(workspaceGroups).length === 0 ? (
          !isCollapsed && (
            <div
              className="
                text-xs italic p-4 rounded-lg border
                bg-gray-50 text-gray-500 border-gray-200
                dark:bg-[#2A2B2E] dark:border-[#3A3B3D] dark:text-gray-400
              "
            >
              You have no board yet.
            </div>
          )
        ) : (
          <div className="space-y-2">
            {Object.entries(workspaceGroups).map(([wsName, boards]) => (
              <div
                key={wsName}
                className={`
                  flex items-center p-3 rounded-lg border transition
                  bg-gradient-to-r from-gray-50 to-gray-100
                  hover:border-blue-300
                  border-gray-200
                  dark:from-[#232427] dark:to-[#2A2B2E]
                  dark:border-[#2C2D30] dark:hover:border-blue-500
                  ${isCollapsed ? "justify-center" : "justify-between"}
                `}
              >
                {/* ICON SHORT MODE */}
                {isCollapsed ? (
                  <div className="relative">
                    <div
                      className="
                        w-9 h-9 rounded-lg flex items-center justify-center 
                        bg-gradient-to-br from-blue-500 to-purple-600 
                        text-white font-bold text-sm
                      "
                    >
                      {wsName.charAt(0).toUpperCase()}
                    </div>
                    <span
                      className="
                        absolute -top-1 -right-1 w-5 h-5 rounded-full 
                        bg-blue-600 text-white text-xs font-bold 
                        flex items-center justify-center
                      "
                    >
                      {boards.length}
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <div
                        className="
                          w-7 h-7 rounded-lg flex items-center justify-center
                          bg-gradient-to-br from-blue-500 to-purple-600
                          text-white text-xs font-bold
                        "
                      >
                        {wsName.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm truncate text-gray-800 dark:text-gray-200">
                        {wsName}
                      </span>
                    </div>

                    <span
                      className="
                        text-xs font-semibold px-2 py-1 rounded-full 
                        bg-white text-gray-600
                        dark:bg-[#2A2B2E] dark:text-gray-300
                      "
                    >
                      {boards.length}
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* === RECENT BOARDS === */}
      <div>
        <div
          className={`flex items-center mb-3 ${
            isCollapsed ? "justify-center" : "gap-2"
          }`}
        >
          <Clock size={18} className="text-gray-600 dark:text-gray-300" />
          {!isCollapsed && (
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              Recently Viewed
            </h3>
          )}
        </div>

        {recentBoards.length === 0 ? (
          !isCollapsed && (
            <div
              className="
                rounded-lg p-8 text-center border border-dashed
                bg-gray-50 border-gray-300
                dark:bg-[#232427] dark:border-[#3A3B3D]
              "
            >
              <Clock size={36} className="mx-auto text-gray-400 mb-3" />
              <p className="text-sm text-gray-600 dark:text-gray-300">
                There is no board yet
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
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
                  className={`
                    flex items-center p-3 rounded-lg cursor-pointer group
                    border border-transparent
                    hover:bg-gray-50 hover:border-gray-200
                    dark:hover:bg-[#2A2B2E] dark:hover:border-[#3A3B3D]
                    ${isCollapsed ? "justify-center" : "gap-3"}
                  `}
                >
                  <div
                    className={`
                      ${isCollapsed ? "w-9 h-9" : "w-10 h-9"} 
                      rounded-lg flex items-center justify-center 
                      shadow-md group-hover:shadow-lg transition
                      ${getBoardColor(index)}
                    `}
                  >
                    <span className="text-white font-bold text-sm">
                      {board.boardName.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <p
                        className="
                          text-sm font-semibold truncate transition
                          text-gray-800 group-hover:text-blue-600
                          dark:text-gray-200 dark:group-hover:text-blue-400
                        "
                      >
                        {board.boardName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {board.workspaceUId
                          ? board.workspaceName || "Workspace"
                          : "Cá nhân"}
                      </p>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* === CREATE NEW BOARD === */}
      <div>
        {!isCollapsed && (
          <h3 className="text-sm font-semibold text-gray-800 mb-3 dark:text-gray-200">
            Fast action
          </h3>
        )}
        <button
          onClick={onCreateBoard}
          className={`
            w-full flex items-center rounded-lg transition group
            bg-gradient-to-r from-blue-50 to-blue-100
            hover:from-blue-100 hover:to-blue-200
            border border-blue-200
            dark:from-[#232427] dark:to-[#2A2B2E]
            dark:border-[#3A3B3D] dark:hover:border-blue-500
            ${isCollapsed ? "justify-center p-3" : "gap-3 p-3"}
          `}
        >
          <div
            className="
              w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center 
              group-hover:bg-blue-600 transition shadow-md
            "
          >
            <Plus size={22} className="text-white" />
          </div>

          {!isCollapsed && (
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-400 group-hover:text-blue-800 dark:group-hover:text-blue-300">
              Create New Board
            </span>
          )}
        </button>
      </div>

      {/* === TIPS === */}
      {!isCollapsed && (
        <div
          className="
            bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 
            border border-purple-200
            dark:from-[#2A2B2E] dark:to-[#232427]
            dark:border-[#3A3B3D]
          "
        >
          <h4 className="text-sm font-semibold mb-2 text-purple-900 dark:text-purple-300 flex items-center gap-2">
            💡 Use Tips
          </h4>
          <ul className="text-xs text-purple-700 dark:text-purple-300 space-y-1.5">
            <li className="flex items-start gap-2">
              <span>•</span> <span>Create workspace for group management</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span> <span>Add collaborators to the board</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span> <span>Use labels for task classification</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  </aside>
);

}
