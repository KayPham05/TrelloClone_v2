import React, { useState } from "react";
import {
  Users,
  Plus,
  Settings,
  ChevronDown,
  ChevronRight,
  UserPlus,
} from "lucide-react";

export default function WorkspaceSection({
  workspaces = [],
  loading = false,
  onCreateWorkspace,
  onCreateBoard,
  onSelectBoard,
  onInviteUser,
  onOpenSetting,
  boardMembers,
}) {
  const [expandedWorkspaces, setExpandedWorkspaces] = useState({});

  const toggleWorkspace = (workspaceUId) => {
    setExpandedWorkspaces((prev) => ({
      ...prev,
      [workspaceUId]: !prev[workspaceUId],
    }));
  };

  const getBoardGradient = (index) => {
    const gradients = [
      "from-indigo-500 to-purple-600",
      "from-cyan-500 to-blue-600",
      "from-rose-500 to-pink-600",
      "from-amber-500 to-orange-600",
      "from-emerald-500 to-green-600",
      "from-violet-500 to-fuchsia-600",
    ];
    return gradients[index % gradients.length];
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">
           Your workspaces
        </h2>
        <button
          onClick={onCreateWorkspace}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition"
        >
          <Plus size={18} />
          Create workspace
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
            <p className="text-gray-500 text-sm">Đang tải workspaces...</p>
          </div>
        </div>
      ) : workspaces.length === 0 ? (
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-16 text-center">
          <Users className="mx-auto text-gray-300 mb-4" size={64} />
          <h3 className="text-gray-700 font-bold mb-2 text-xl">
            Chưa có workspace nào
          </h3>
          <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
            Tạo workspace để quản lý dự án theo nhóm và cộng tác với đồng nghiệp
            một cách hiệu quả
          </p>
          <button
            onClick={onCreateWorkspace}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition"
          >
            Tạo Workspace đầu tiên
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {workspaces.map((workspace) => {
            const isExpanded = expandedWorkspaces[workspace.workspaceUId];
            console.log("boardMember:", boardMembers);
            return (
              <div
                key={workspace.workspaceUId}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition overflow-hidden"
              >
                {/* Workspace Header - Always visible */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <button
                      onClick={() => toggleWorkspace(workspace.workspaceUId)}
                      className="p-1.5 hover:bg-gray-200 rounded-lg transition flex-shrink-0"
                    >
                      {isExpanded ? (
                        <ChevronDown size={20} className="text-gray-600" />
                      ) : (
                        <ChevronRight size={20} className="text-gray-600" />
                      )}
                    </button>

                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
                      {workspace.name?.charAt(0)?.toUpperCase() || "W"}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-gray-800 font-bold text-base truncate">
                        {workspace.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-500">
                          {workspace.boards?.length || 0} bảng
                        </span>
                        {workspace.description && (
                          <>
                            <span className="text-gray-300">•</span>
                            <p className="text-xs text-gray-500 truncate">
                              {workspace.description}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Nút Invite thành viên */}
                    <button
                      onClick={() => onInviteUser(workspace)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition text-sm"
                    >
                      <UserPlus size={16} />
                      <span className="font-medium">Invite</span>
                    </button>

                    <button
                      onClick={() => onOpenSetting && onOpenSetting(workspace)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition"
                      title="Cài đặt workspace"
                    >
                      <Settings size={18} className="text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Workspace Boards - Expandable */}
                {isExpanded && (
                  <div className="p-6 pt-4 border-t border-gray-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {workspace.boards && workspace.boards.length > 0
                        ? workspace.boards.map((board, index) => (
                            <div
                              key={board.boardUId}
                              onClick={() =>
                                onSelectBoard && onSelectBoard(board)
                              }
                              className={`h-32 rounded-xl overflow-hidden shadow-md cursor-pointer relative group bg-gradient-to-br ${getBoardGradient(
                                index
                              )} hover:shadow-xl hover:scale-[1.03] transition-all duration-200`}
                            >
                              {boardMembers[board.boardUId] &&
                                boardMembers[board.boardUId].length > 0 && (
                                  <div className="absolute top-2 right-2 flex -space-x-2 z-20">
                                    {boardMembers[board.boardUId]
                                      .filter((m) =>
                                        ["Owner", "Admin", "Member"].includes(
                                          m.role
                                        )
                                      )
                                      .slice(0, 4)
                                      .map((member, index) => {
                                        //  Mảng màu riêng cho avatar (tránh trùng màu board)
                                        const avatarColors = [
                                          "bg-blue-700", // Xanh dương đậm
                                          "bg-yellow-600", // Vàng đậm
                                          "bg-orange-600", // Cam đậm
                                          "bg-emerald-600", // Xanh ngọc đậm
                                          "bg-green-600", // Xanh lá đậm
                                          "bg-violet-600", // Tím đậm
                                          "bg-rose-600", // Hồng đậm
                                          "bg-teal-600", // Xanh lơ đậm
                                          "bg-indigo-600", // Xanh chàm đậm
                                        ];
                                        const colorClass =
                                          avatarColors[
                                            index % avatarColors.length
                                          ];

                                        return (
                                          <div
                                            key={member.userUId}
                                            title={`${member.userName} (${member.role})`}
                                            className={`w-7 h-7 ${colorClass} text-white text-sm flex items-center justify-center font-semibold  rounded-full shadow-md hover:scale-110 transition-transform`}
                                          >
                                            {member.userName
                                              ?.split(" ")
                                              .map((n) => n[0])
                                              .join("")
                                              .toUpperCase()
                                              .slice(0, 2)}
                                          </div>
                                        );
                                      })}

                                    {/* Nếu có hơn 4 người thì hiển thị +N */}
                                    {boardMembers[board.boardUId].filter((m) =>
                                      ["Owner", "Admin", "Member"].includes(
                                        m.role
                                      )
                                    ).length > 4 && (
                                      <div className="w-10 h-10 bg-gray-200 text-gray-700 text-sm flex items-center justify-center font-semibold border-2 border-white rounded-full shadow-sm">
                                        +
                                        {boardMembers[board.boardUId].filter(
                                          (m) =>
                                            [
                                              "Owner",
                                              "Admin",
                                              "Member",
                                            ].includes(m.role)
                                        ).length - 4}
                                      </div>
                                    )}
                                  </div>
                                )}

                              {/* Overlay */}
                              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition"></div>

                              {/* Content */}
                              <div className="absolute bottom-4 left-4 right-4 z-10">
                                <h4 className="text-white font-bold text-base truncate mb-1">
                                  {board.boardName}
                                </h4>
                                <p className="text-white/90 text-xs font-medium bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm w-fit">
                                  {board.visibility || "Private"}
                                </p>
                              </div>
                            </div>
                          ))
                        : null}

                      {/* Nút tạo board */}
                      <button
                        onClick={() =>
                          onCreateBoard && onCreateBoard(workspace.workspaceUId)
                        }
                        className="h-32 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:bg-gray-50 hover:border-blue-400 text-gray-600 transition group"
                      >
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-2 group-hover:bg-blue-200 transition">
                          <Plus
                            size={28}
                            className="text-blue-600 group-hover:text-blue-700 transition"
                          />
                        </div>
                        <span className="text-sm font-semibold group-hover:text-blue-600 transition">
                          Create New Board
                        </span>
                      </button>
                    </div>

                    {/* Empty state nếu workspace chưa có board */}
                    {(!workspace.boards || workspace.boards.length === 0) && (
                      <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                        <p className="text-gray-500 text-sm mb-3">
                          Workspace has no board yet
                        </p>
                        <button
                          onClick={() =>
                            onCreateBoard &&
                            onCreateBoard(workspace.workspaceUId)
                          }
                          className="text-blue-600 hover:text-blue-700 text-sm font-semibold hover:underline inline-flex items-center gap-2"
                        >
                          <Plus size={16} />
                          Create first board
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
