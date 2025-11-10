import React, { useEffect, useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import { Plus, Trash2 } from "lucide-react";
import "bootstrap-icons/font/bootstrap-icons.css";
import PortalAwareDraggable from "./PortalAwareDraggable";
import Card from "./Card";
import BoardHeader from "./BoardHeader";
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
    <div className="flex flex-col h-full bg-gradient-to-br from-[#46237A] to-[#7A1E6E]">
      <BoardHeader
        board={board}
        boardMembers={boardMembers} 
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
                className={`board-list ${
                  snapshot.isDraggingOver ? "dragging-over" : ""
                }`}
              >
                <div className="list-header">
                  <h4 className="list-title">{list.listName}</h4>
                  <button
                    className="list-delete-btn"
                    onClick={() => handleDeleteList(list.listUId)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="list-cards">
                  {loading ? (
                    <div className="text-white/50 text-sm p-2">Loading...</div>
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
                              boardMembers={boardMembers}
                              board = {board}
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

        {/* Thêm danh sách mới */}
        <div className="add-list-box">
          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="List name..."
            className="add-list-input"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddList();
            }}
          />
          <button onClick={handleAddList} className="add-list-btn">
            <Plus size={18} /> Add list
          </button>
        </div>
      </div>
    </div>
  );
}
