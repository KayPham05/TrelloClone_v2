import React from "react";
import { User, Plus } from "lucide-react";

export default function PersonalBoardSection({
  boards = [],
  loading = false,
  onCreateBoard,
  onSelectBoard,
}) {
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
        <div className="flex items-center gap-2">
          <User className="text-gray-600" size={22} />
          <h2 className="text-xl font-bold text-gray-800">
            Personal board
          </h2>
        </div>
        <button
          onClick={() => onCreateBoard && onCreateBoard(null)}
          className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition"
        >
          <Plus size={18} />
          Create Personal board
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mx-auto mb-3"></div>
            <p className="text-gray-500 text-sm">Loading Personal Board...</p>
          </div>
        </div>
      ) : boards.length === 0 ? (
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-16 text-center">
          <User className="mx-auto text-gray-300 mb-4" size={64} />
          <h3 className="text-gray-700 font-bold mb-2 text-xl">
            Let's create a personal board
          </h3>
          <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
            Create a personal board to manage your tasks efficiently
          </p>
          <button
            onClick={() => onCreateBoard && onCreateBoard(null)}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition"
          >
            Create Your First Board
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {boards.map((board, index) => (
              <div
                key={board.boardUId}
                onClick={() => onSelectBoard && onSelectBoard(board)}
                className={`h-32 rounded-xl overflow-hidden shadow-md cursor-pointer relative group bg-gradient-to-br ${getBoardGradient(
                  index
                )} hover:shadow-xl hover:scale-[1.03] transition-all duration-200`}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition"></div>

                {/* Content */}
                <div className="absolute bottom-4 left-4 right-4 z-10">
                  <h4 className="text-white font-bold text-base truncate mb-1">
                    {board.boardName}
                  </h4>
                  <p className="text-white/90 text-xs font-medium bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm w-fit">
                    Personal
                  </p>
                </div>
              </div>
            ))}

            {/* Nút tạo board */}
            <button
              onClick={() => onCreateBoard && onCreateBoard(null)}
              className="h-32 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:bg-gray-50 hover:border-green-400 text-gray-600 transition group"
            >
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-2 group-hover:bg-green-200 transition">
                <Plus
                  size={28}
                  className="text-green-600 group-hover:text-green-700 transition"
                />
              </div>
              <span className="text-sm font-semibold group-hover:text-green-600 transition">
                Create Your New Board
              </span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}