import React, { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Settings,
  ChevronDown,
  ChevronRight,
  UserPlus,
} from "lucide-react";
import EditBoardModal from "./EditBoardModal";

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
  const [editingBoard, setEditingBoard] = useState(null);
  const [wsLocal, setWsLocal] = useState(workspaces);

  React.useEffect(() => setWsLocal(workspaces), [workspaces]);

  const handleBoardSaved = (e) => {
    if (!e) return;
    // cập nhật ngay UI (optimistic)
    setWsLocal((prev) =>
      prev.map((ws) => {
        if (!ws.boards || ws.boards.length === 0) return ws;

        if (e.type === "update" && e.board) {
          return {
            ...ws,
            boards: ws.boards.map((b) =>
              b.boardUId === e.board.boardUId ? { ...b, ...e.board } : b
            ),
          };
        }
        if (e.type === "delete" && e.boardUId) {
          return {
            ...ws,
            boards: ws.boards.filter((b) => b.boardUId !== e.boardUId),
          };
        }
        return ws;
      })
    );
  };

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
        <h2 className="text-xl font-bold text-gray-800 dark:text-[#E8EAED]">
          Your workspaces
        </h2>

        <button
          onClick={onCreateWorkspace}
          className="flex items-center gap-2 px-5 py-2.5 
                 bg-blue-600 hover:bg-blue-700 
                 text-white text-sm font-semibold 
                 rounded-lg shadow-md hover:shadow-lg transition"
        >
          <Plus size={18} />
          Create workspace
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
            <p className="text-gray-500 text-sm dark:text-[#A0A4A8]">
              Loading workspaces...
            </p>
          </div>
        </div>
      ) : workspaces.length === 0 ? (
        <div className="bg-white dark:bg-[#1E1F22] rounded-xl border-2 border-dashed border-gray-300 dark:border-[#3F4147] p-16 text-center">
          <Users
            className="mx-auto text-gray-300 mb-4 dark:text-[#686C72]"
            size={64}
          />

          <h3 className="text-gray-700 dark:text-[#E8EAED] font-bold mb-2 text-xl">
            No workspaces yet
          </h3>
          <p className="text-gray-500 dark:text-[#A0A4A8] text-sm mb-6 max-w-md mx-auto">
            Create a workspace to manage projects with your team and collaborate
            effectively
          </p>

          <button
            onClick={onCreateWorkspace}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition"
          >
            Create your first workspace
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {wsLocal.map((workspace) => {
            const isExpanded = expandedWorkspaces[workspace.workspaceUId];

            return (
              <div
                key={workspace.workspaceUId}
                className="
              bg-white dark:bg-[#1E1F22]
              rounded-xl shadow-sm 
              border border-gray-200 dark:border-[#3F4147]
              hover:shadow-md transition overflow-hidden
            "
              >
                {/* HEADER */}
                <div className="flex items-center justify-between p-4">
                  {/* LEFT */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Toggle button --- square style */}
                    <button
                      onClick={() => toggleWorkspace(workspace.workspaceUId)}
                      className="
                    w-8 h-8 rounded-xl grid place-items-center 
                    bg-white hover:bg-gray-200
                    dark:bg-[#1E1F22] dark:hover:bg-[#4A4C50]
                    transition
                  "
                    >
                      {isExpanded ? (
                        <ChevronDown
                          size={18}
                          className="text-gray-700 dark:text-[#E8EAED]"
                        />
                      ) : (
                        <ChevronRight
                          size={18}
                          className="text-gray-700 dark:text-[#E8EAED]"
                        />
                      )}
                    </button>

                    {/* Workspace avatar */}
                    <div
                      className="
                  w-10 h-10 rounded-xl flex items-center justify-center 
                  bg-gradient-to-br from-green-500 to-teal-600
                  text-white font-bold text-lg shadow-md
                "
                    >
                      {workspace.name?.charAt(0)?.toUpperCase() || "W"}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base truncate text-gray-800 dark:text-[#E8EAED]">
                        {workspace.name}
                      </h3>

                      <div className="flex items-center gap-2 text-xs mt-0.5">
                        <span className="text-gray-500 dark:text-[#A0A4A8]">
                          {workspace.boards?.length || 0} boards
                        </span>

                        {workspace.description && (
                          <>
                            <span className="text-gray-300 dark:text-[#55585D]">
                              •
                            </span>
                            <p className="text-gray-500 dark:text-[#A0A4A8] truncate">
                              {workspace.description}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT BUTTONS */}
                  <div className="flex items-center gap-2">
                    {/* INVITE BUTTON – style like screenshot */}
                    <button
                      onClick={() => onInviteUser(workspace)}
                      className="
                    flex items-center gap-2 px-3 py-1.5 
                    rounded-xl text-sm font-medium
                    bg-green-100 text-green-700 
                    hover:bg-green-200

                    dark:bg-[#16A34A] dark:text-white 
                    dark:hover:bg-green-700
                    dark:shadow-[0_0_10px_rgba(46,255,178,0.20)]  
                    shadow-sm 
                    transition
                  "
                    >
                      <UserPlus size={16} />
                      Invite
                    </button>

                    {/* Setting Button (square like screenshot) */}
                    <button
                      onClick={() => onOpenSetting(workspace)}
                      title="Settings"
                      className="
                    w-9 h-9 rounded-xl grid place-items-center
                    bg-white hover:bg-gray-200
                    dark:bg-[#1E1F22] dark:hover:bg-[#4A4C50]
                    transition
                  "
                    >
                      <Settings
                        size={18}
                        className="text-gray-600 dark:text-[#E8EAED]"
                      />
                    </button>
                  </div>
                </div>

                {/* BODY */}
                {isExpanded && (
                  <div className="p-6 pt-4 border-t border-gray-100 dark:border-[#3F4147] dark:bg-[#2B2D31]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {/* Boards list */}
                      {workspace.boards?.map((board, index) => (
                        <div
                          key={board.boardUId}
                          onClick={() => onSelectBoard?.(board)}
                          className={`
                        h-32 rounded-xl overflow-hidden cursor-pointer relative group 
                        shadow-md hover:shadow-xl hover:scale-[1.03] 
                        transition-all duration-200

                        bg-gradient-to-br ${getBoardGradient(index)}

                        dark:ring-1 dark:ring-inset dark:ring-white/10
                      `}
                        >
                          {/* Setting icon in board */}
                          <button
                            title="Board settings"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingBoard(board);
                            }}
                            className="
                          absolute top-2 right-2 z-20 p-2 rounded-xl
                          text-white hover:bg-white/30 dark:hover:bg-white/20
                          backdrop-blur-sm transition
                        "
                          >
                            <Settings size={16} />
                          </button>

                          {/* Overlay */}
                          <div
                            className="
                        absolute inset-0 bg-black/20 group-hover:bg-black/10 
                        dark:bg-black/30 dark:group-hover:bg-black/20
                        transition
                      "
                          ></div>

                          {/* Content */}
                          <div className="absolute bottom-4 left-4 right-4 z-10">
                            <h4 className="text-white dark:text-white font-bold text-base truncate mb-1">
                              {board.boardName}
                            </h4>
                            <p
                              className="
                          text-white/90 text-xs font-medium 
                          bg-white/20 dark:bg-white/15
                          px-2 py-0.5 rounded-full backdrop-blur-sm w-fit
                        "
                            >
                              {board.visibility || "Private"}
                            </p>
                          </div>
                        </div>
                      ))}

                      {/* Create New Board */}
                      <button
                        onClick={() => onCreateBoard(workspace.workspaceUId)}
                        className="
                      h-32 rounded-xl border-2 border-dashed border-gray-300 
                      flex flex-col items-center justify-center
                      text-gray-600 hover:text-blue-600 hover:border-blue-400 hover:bg-gray-50
                      dark:border-[#3F4147] dark:hover:border-blue-500 dark:hover:bg-[#232428] 
                      dark:text-[#E8EAED] transition group
                    "
                      >
                        <div
                          className="
                      w-12 h-12 rounded-xl grid place-items-center mb-2
                      bg-blue-100 dark:bg-blue-900/30 
                      group-hover:bg-blue-200 dark:group-hover:bg-blue-900/40
                      transition
                    "
                        >
                          <Plus
                            size={28}
                            className="text-blue-600 dark:text-blue-300 group-hover:text-blue-700 dark:group-hover:text-blue-200"
                          />
                        </div>

                        <span
                          className="
                      text-sm font-semibold
                      text-gray-700 dark:text-[#E8EAED]
                      group-hover:text-blue-600 dark:group-hover:text-blue-300 transition
                    "
                        >
                          Create New Board
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <EditBoardModal
        open={!!editingBoard}
        onClose={() => setEditingBoard(null)}
        board={editingBoard}
        onSaved={handleBoardSaved}
      />
    </section>
  );
}
