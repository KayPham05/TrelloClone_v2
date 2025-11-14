import React, { useEffect, useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import { Plus, Trash2 } from "lucide-react";
import "bootstrap-icons/font/bootstrap-icons.css";
import PortalAwareDraggable from "./PortalAwareDraggable";
import Card from "./Card";
import BoardHeader from "./BoardHeader";
import { useNavigate } from "react-router-dom";
import {
  getListsByBoardIdAPI,
  createListAPI,
  updateListStatusAPI,
} from "../services/ListAPI";
import { getCardsAPI } from "../services/todoApi";
import { getBoardMembersAPI } from "../services/BoardMemberAPI";

import "./css/Board.css";

export default function Board({ refresh, setRefresh }) {
  const [lists, setLists] = useState([]);
  const [cards, setCards] = useState([]);
  const [board, setBoard] = useState(null);
  const [newListName, setNewListName] = useState("");
  const [loading, setLoading] = useState(false);
  const [boardMembers, setBoardMembers] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    const stored = localStorage.getItem("currentBoard");
    if (stored) {
      const b = JSON.parse(stored);
      setBoard(b);
      loadData(b.boardUId);
    }
  }, [refresh]);

  const loadData = async (boardId) => {
    setLoading(true);
    try {
      // Gọi 3 API song song
      const [listsData, cardsData, membersData] = await Promise.all([
        getListsByBoardIdAPI(boardId),
        getCardsAPI(boardId),
        getBoardMembersAPI(boardId),
      ]);

      setLists(listsData);
      setCards(cardsData);
      setBoardMembers(membersData || []);
      console.log("✅ Board members loaded:", membersData);
    } catch (err) {
      console.error("❌ Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBoardUpdated = (nextBoard) => {
    if (nextBoard?.type === "delete") {
      try { localStorage.removeItem("currentBoard"); } catch {}
      navigate("/home");
      return;
    }
    if (nextBoard){
      setBoard(nextBoard);
      try {
        localStorage.setItem("currentBoard", JSON.stringify(nextBoard));
      } catch {}
      setRefresh && setRefresh((r) => !r);
    }
  };

  const handleAddList = async () => {
    if (!newListName.trim()) return;
    try {
      const newList = await createListAPI({
        ListName: newListName,
        BoardUId: board.boardUId,
        Status: "Active",
        Position: lists.length + 1,
      });
      setLists([...lists, newList]);
      setNewListName("");
    } catch (err) {
      console.error("Error adding list:", err);
    }
  };

  const handleDeleteList = async (id) => {
    try {
      await updateListStatusAPI(id, "Storage");
      if (board) {
        loadData(board.boardUId);
      }
    } catch (err) {
      console.error("Error deleting list:", err);
    }
  };

  return (
  <div className="
      flex flex-col h-full 
      bg-gradient-to-br from-[#46237A] to-[#7A1E6E] border-2 border-[#0d1b2a] 
      dark:from-[#1E1F22] dark:to-[#2B2D31] dark:border-[#70727A]
    "
  >
    <BoardHeader
      board={board}
      boardMembers={boardMembers}
      onBoardUpdated={handleBoardUpdated}
    />

    <div className="flex gap-4 p-4 flex-1 overflow-x-auto">
      
      {lists.map((list) => (
        <Droppable
          key={list.listUId}
          droppableId={`list-${list.listUId}`}
          type="CARD"
        >
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`
                board-list 
                rounded-xl w-72 flex-shrink-0 
                p-3 border 
                transition

                bg-white/90 border-gray-300
                dark:bg-[#2B2D31] dark:border-[#3F4147]

                ${snapshot.isDraggingOver ? "bg-blue-50 dark:bg-[#3A3C42]" : ""}
              `}
            >

              {/* Header list */}
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-800 dark:text-[#F2F3F5]">
                  {list.listName}
                </h4>

                <button
                  className="
                    p-1 rounded-lg 
                    hover:bg-gray-200 dark:hover:bg-[#4A4D54]
                    transition 
                    text-gray-600 dark:text-[#F2F3F5]
                  "
                  onClick={() => handleDeleteList(list.listUId)}
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Cards */}
              <div className="space-y-2">
                {loading ? (
                  <div className="text-gray-600 dark:text-[#B5BAC1] text-sm p-2">
                    Loading...
                  </div>
                ) : (
                  cards
                    .filter((c) => c.listUId === list.listUId)
                    .map((card, index) => (
                      <PortalAwareDraggable
                        key={card.cardUId}
                        draggableId={card.cardUId}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <Card
                            card={card}
                            board={board}
                            boardMembers={boardMembers}
                            provided={provided}
                            snapshot={snapshot}
                            onRefresh={() => setRefresh((r) => !r)}
                          />
                        )}
                      </PortalAwareDraggable>
                    ))
                )}
                {provided.placeholder}
              </div>

            </div>
          )}
        </Droppable>
      ))}

      {/* ADD LIST */}
      <div className="
          add-list-box w-72 flex-shrink-0 
          rounded-xl p-3 border-2 border-dashed 
          bg-gray-200/60
          text-gray-700 transition cursor-pointer

          dark:bg-[#1E1F22]/40 dark:border-[#3F4147]
          
        "
      >
        <input
          type="text"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="List name..."
          className="
            add-list-input w-full px-3 py-2 rounded-lg
            bg-white border border-gray-300
            placeholder-gray-500 text-gray-800

            dark:bg-[#2B2D31] dark:border-[#4A4D54]
            dark:text-[#F2F3F5] dark:placeholder-[#B5BAC1]
          "
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAddList();
          }}
        />

        <button
          onClick={handleAddList}
          className="
            mt-2 w-full flex items-center justify-center 
            gap-2 py-2 rounded-lg text-sm font-semibold
            transition

            bg-blue-600 text-white hover:bg-blue-700

            dark:bg-blue-700 dark:hover:bg-blue-600
          "
        >
          <Plus size={18} /> Add list
        </button>
      </div>

    </div>
  </div>
);
  
}
