import React, {useState} from "react";
import { ChevronDown, Users, Share2, Star, Filter, Settings } from "lucide-react";
import "./css/BoardHeaderStyle.css";
import EditBoardModal from "./EditBoardModal";


export default function BoardHeader({ board, boardMembers, onBoardUpdated }) {
   const [editing, setEditing] = useState(false);

  const handleSaved = (nextBoard) => {
    if (nextBoard && onBoardUpdated) onBoardUpdated(nextBoard);
    setEditing(false);
  };
  return (
    <div className="board-header-container">
      {/* LEFT - Board name */}
      <div className="board-header-left">
        <h2 className="board-title">
          {board?.boardName || "Bảng Trello của tôi"}
        </h2>
        <ChevronDown size={18} className="icon-down" />
      </div>

      {/* RIGHT - Actions */}
      <div className="board-header-right flex items-center gap-3">
        {(boardMembers?.length ?? 0) > 0 && (
          <div className="flex -space-x-2">
            {boardMembers
              .filter((m) => ["Owner", "Admin", "Member"].includes(m.role))
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
                const colorClass = avatarColors[index % avatarColors.length];

                return (
                  <div
                    key={member.userUId}
                    title={`${member.userName} (${member.role})`}
                    className={`w-8 h-8 ${colorClass} text-white text-sm flex items-center justify-center font-semibold rounded-full shadow-md hover:scale-110 transition-transform`}
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

        <button className="header-btn">
          <Filter size={18} />
        </button>
        <button className="header-btn">
          <Star size={18} />
        </button>
        <button className="header-btn">
          <Users size={18} />
        </button>
        <button className="header-btn" onClick={() => setEditing(true)} title="Board settings">
          <Settings size={18} />
        </button>
        <button className="header-share-btn">
          <Share2 size={16} /> Share
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
