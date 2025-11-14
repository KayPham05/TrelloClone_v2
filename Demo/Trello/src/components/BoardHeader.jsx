import React, { useState } from "react";
import {
  ChevronDown,
  Users,
  Share2,
  Star,
  Filter,
  Settings,
} from "lucide-react";
import EditBoardModal from "./EditBoardModal";

export default function BoardHeader({
  board,
  boardMembers,
  onBoardUpdated,
}) {
  const [editing, setEditing] = useState(false);

  const handleSaved = (nextBoard) => {
    if (nextBoard && onBoardUpdated) onBoardUpdated(nextBoard);
    setEditing(false);
  };

  return (
    <div
      className={[
        "w-full flex items-center justify-between px-6 py-3 border-b",
        "bg-white text-gray-800 border-gray-200",
        // DARK MODE
        "dark:bg-[#2B2D31] dark:text-[#E8EAED] dark:border-[#3F4147]",
      ].join(" ")}
    >
      {/* LEFT: Board name */}
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-bold  truncate dark:text-[#E8EAED] ">
          {board?.boardName || "Bảng Trello của tôi"}
        </h2>

        <ChevronDown
          size={18}
          className="text-gray-600 dark:text-[#E8EAED] cursor-pointer"
        />
      </div>

      {/* RIGHT: Actions */}
      <div className="flex items-center gap-3">
        {/* Members */}
        {(boardMembers?.length ?? 0) > 0 && (
          <div className="flex -space-x-2">
            {boardMembers
              .filter((m) =>
                ["Owner", "Admin", "Member"].includes(m.role)
              )
              .slice(0, 4)
              .map((member, index) => {
                const avatarColors = [
                  "bg-blue-700",
                  "bg-yellow-600",
                  "bg-orange-600",
                  "bg-emerald-600",
                  "bg-green-600",
                  "bg-violet-600",
                  "bg-rose-600",
                  "bg-teal-600",
                  "bg-indigo-600",
                ];
                const colorClass =
                  avatarColors[index % avatarColors.length];

                return (
                  <div
                    key={member.userUId}
                    title={`${member.userName} (${member.role})`}
                    className={[
                      "w-8 h-8 rounded-full flex items-center justify-center shadow-md",
                      "text-white text-sm font-semibold",
                      colorClass,
                      "hover:scale-110 transition-transform",
                    ].join(" ")}
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

            {/* +N */}
            {boardMembers.filter((m) =>
              ["Owner", "Admin", "Member"].includes(m.role)
            ).length > 4 && (
              <div className="w-8 h-8 bg-gray-700 text-white text-xs flex items-center justify-center font-semibold border-2 border-white rounded-full shadow-sm">
                +
                {boardMembers.filter((m) =>
                  ["Owner", "Admin", "Member"].includes(m.role)
                ).length - 4}
              </div>
            )}
          </div>
        )}

        {/* Buttons */}
        <BoardHeaderBtn>
          <Filter size={18} />
        </BoardHeaderBtn>

        <BoardHeaderBtn>
          <Star size={18} />
        </BoardHeaderBtn>

        <BoardHeaderBtn>
          <Users size={18} />
        </BoardHeaderBtn>

        <BoardHeaderBtn
          onClick={() => setEditing(true)}
          title="Board settings"
        >
          <Settings size={18} />
        </BoardHeaderBtn>

        <button
          className={[
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold",
            "bg-blue-600 text-white hover:bg-blue-700 shadow-md",
            "dark:bg-blue-500 dark:hover:bg-blue-600",
          ].join(" ")}
        >
          <Share2 size={16} />
          Share
        </button>
      </div>

      {editing && (
        <EditBoardModal
          open={editing}
          board={board}
          onClose={() => setEditing(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}

/* Small reusable button */
function BoardHeaderBtn({ children, onClick, title }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={[
        "p-2 rounded-lg transition shadow-sm",
        "bg-gray-100 hover:bg-gray-200 text-gray-700",
        "dark:bg-[#3A3C42] dark:hover:bg-[#4A4C52] dark:text-[#E8EAED]",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
