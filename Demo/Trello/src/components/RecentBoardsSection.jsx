import React from "react";
import { Clock } from "lucide-react";

export default function RecentBoardsSection({
  recentBoards = [],
  workspaces = [],
  loading = false,
  onSelectBoard,
  boardMembers
}) {
  const getBoardGradient = (index) => {
    const gradients = [
      "from-blue-500 to-purple-600",
      "from-purple-500 to-pink-600",
      "from-orange-500 to-red-600",
      "from-green-500 to-teal-600",
      "from-pink-500 to-rose-600",
      "from-indigo-500 to-blue-600",
    ];
    return gradients[index % gradients.length];
  };

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Clock className="text-gray-600" size={22} />
        <h2 className="text-xl font-bold text-gray-800">Recently Opened</h2>
      </div>

      {loading ? (
        <div className="flex items-center gap-3 text-gray-500 py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <p className="text-sm italic">Data loading...</p>
        </div>
      ) : recentBoards.length === 0 ? (
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
          <Clock size={48} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-gray-700 font-semibold mb-2">
             There is no board yet.
          </h3>
          <p className="text-gray-500 text-sm">
            Let's create one or join a workspace !
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {recentBoards.map((board, index) => (
            <div
              key={board.boardUId}
              onClick={() => onSelectBoard && onSelectBoard(board)}
              className={`h-32 rounded-xl overflow-hidden shadow-md cursor-pointer relative group bg-gradient-to-br ${getBoardGradient(
                index
              )} hover:shadow-xl hover:scale-[1.03] transition-all duration-200`}
            >
              {boardMembers[board.boardUId] &&
                boardMembers[board.boardUId].length > 0 && (
                  <div className="absolute top-2 right-2 flex -space-x-2 z-20">
                    {boardMembers[board.boardUId]
                      .filter((m) =>
                        ["Owner", "Admin", "Member"].includes(m.role)
                      )
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
                          avatarColors[index % avatarColors.length];

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
                      ["Owner", "Admin", "Member"].includes(m.role)
                    ).length > 4 && (
                      <div className="w-10 h-10 bg-gray-200 text-gray-700 text-sm flex items-center justify-center font-semibold border-2 border-white rounded-full shadow-sm">
                        +
                        {boardMembers[board.boardUId].filter((m) =>
                          ["Owner", "Admin", "Member"].includes(m.role)
                        ).length - 4}
                      </div>
                    )}
                  </div>
                )}
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition"></div>

              {/* Content */}
              <div className="absolute bottom-4 left-4 right-4 z-10">
                <h3 className="text-white font-bold text-base truncate mb-1">
                  {board.boardName}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-white/90 text-xs font-medium bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
                    {board.workspaceUId
                      ? workspaces.find(
                          (ws) => ws.workspaceUId == board.workspaceUId
                        )?.name || "Not found"
                      : "Personal"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
