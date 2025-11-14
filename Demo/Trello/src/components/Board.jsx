import React, { useEffect, useState } from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Plus, Trash2, GripVertical } from "lucide-react";
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
import { addCardAPI } from "../services/todoApi";

import "./css/Board.css";

export default function Board({ refresh, setRefresh, lists, setLists }) {
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
      const [listsData, cardsData, membersData] = await Promise.all([
        getListsByBoardIdAPI(boardId),
        getCardsAPI(boardId),
        getBoardMembersAPI(boardId),
      ]);

      setLists(Array.isArray(listsData) ? listsData : []);
      setCards(Array.isArray(cardsData) ? cardsData : []);
      setBoardMembers(Array.isArray(membersData) ? membersData : []);

      console.log("Data loaded:", {
        lists: listsData?.length || 0,
        cards: cardsData?.length || 0,
        members: membersData?.length || 0,
      });
    } catch (err) {
      console.error("Error loading data:", err);
      setLists([]);
      setCards([]);
      setBoardMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBoardUpdated = (nextBoard) => {
    if (nextBoard?.type === "delete") {
      try {
        localStorage.removeItem("currentBoard");
      } catch (err) {
        console.log(err);
      }
      navigate("/home");
      return;
    }
    if (nextBoard) {
      setBoard(nextBoard);
      try {
        localStorage.setItem("currentBoard", JSON.stringify(nextBoard));
      } catch (err) {
        console.log(err);
      }
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
        Position: lists.length,
      });

      if (newList) {
        setLists([...lists, newList]);
        setNewListName("");
      }
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

  const handleAddCard = async (listId, cardTitle) => {
    if (!cardTitle.trim()) return;

    try {
      const newCard = await addCardAPI({
        cardName: cardTitle,
        listUId: listId,
        status: "Todo",
      });

      setCards((prev) => [...prev, newCard]);
    } catch (err) {
      console.error("Error adding card:", err);
    }
  };

  return (
  <div
    className="
      flex flex-col h-full 
      bg-gray-100 
      dark:bg-[#1E1F22]
      transition-colors
    "
  >
    <BoardHeader
      board={board}
      boardMembers={boardMembers}
      onBoardUpdated={handleBoardUpdated}
    />

    <Droppable droppableId="all-lists" direction="horizontal" type="LIST">
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="
            flex gap-4 p-4 flex-1 overflow-x-auto 
            scrollbar-thin scrollbar-track-transparent
            scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600
          "
        >
          {Array.isArray(lists) &&
            lists.map((list, index) => (
              <Draggable
                key={list.listUId}
                draggableId={list.listUId}
                index={index}
              >
                {(listProvided, listSnapshot) => (
                  <div
                    ref={listProvided.innerRef}
                    {...listProvided.draggableProps}
                    className={`transition ${
                      listSnapshot.isDragging ? "opacity-50 rotate-2" : ""
                    }`}
                  >
                    <Droppable
                      droppableId={`list-${list.listUId}`}
                      type="CARD"
                    >
                      {(cardProvided, cardSnapshot) => (
                        <div
                          ref={cardProvided.innerRef}
                          {...cardProvided.droppableProps}
                          className={`
                            board-list 
                            rounded-xl
                            w-72
                            bg-white text-gray-800
                            border border-gray-200
                            dark:bg-[#2B2D31] dark:text-[#E8EAED] 
                            dark:border-[#3F4147]
                            transition-colors
                            ${cardSnapshot.isDraggingOver ? 
                              "ring-2 ring-blue-500 dark:ring-blue-400" 
                              : ""}
                          `}
                        >
                          {/* HEADER LIST */}
                          <div className="
                            list-header flex justify-between items-center
                            px-3 py-2 border-b 
                            border-gray-200 dark:border-[#3F4147]
                          ">
                            <div className="flex items-center gap-2 flex-1">
                              <div
                                {...listProvided.dragHandleProps}
                                className="
                                  cursor-grab active:cursor-grabbing p-1
                                  hover:bg-gray-100 dark:hover:bg-white/10 
                                  rounded transition
                                "
                              >
                                <GripVertical
                                  size={18}
                                  className="text-gray-500 dark:text-gray-300"
                                />
                              </div>
                              <h4 className="list-title font-semibold text-sm">
                                {list.listName}
                              </h4>
                            </div>

                            <button
                              className="
                                list-delete-btn p-1 rounded 
                                hover:bg-red-50 dark:hover:bg-red-900/30
                                text-red-600 dark:text-red-400
                              "
                              onClick={() => handleDeleteList(list.listUId)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          {/* CARDS */}
                          <div className="list-cards p-2">
                            {loading ? (
                              <div className="text-gray-500 dark:text-gray-400 text-sm p-2">
                                Loading...
                              </div>
                            ) : (
                              cards
                                .filter((c) => c.listUId === list.listUId)
                                .map((card, cardIndex) => (
                                  <PortalAwareDraggable
                                    key={card.cardUId}
                                    draggableId={card.cardUId}
                                    index={cardIndex}
                                  >
                                    {(cardDragProvided, cardDragSnapshot) => (
                                      <Card
                                        card={card}
                                        boardMembers={boardMembers}
                                        board={board}
                                        list={list}
                                        provided={cardDragProvided}
                                        snapshot={cardDragSnapshot}
                                        onRefresh={() => setRefresh((r) => !r)}
                                      />
                                    )}
                                  </PortalAwareDraggable>
                                ))
                            )}
                            {cardProvided.placeholder}
                          </div>

                          {/* ADD CARD */}
                          <AddCardSection
                            listId={list.listUId}
                            onAdd={handleAddCard}
                          />
                        </div>
                      )}
                    </Droppable>
                  </div>
                )}
              </Draggable>
            ))}

          {provided.placeholder}

          {/* ADD LIST */}
          <div className="
            add-list-box w-72 min-w-72 h-fit p-4 rounded-xl 
            bg-white border border-gray-300 text-gray-700
            dark:bg-[#2B2D31] dark:text-[#E8EAED] dark:border-[#3F4147]
            transition-colors
          ">
            <input
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="List name..."
              className="
                add-list-input w-full px-3 py-2 rounded-md 
                bg-gray-100 border border-gray-300
                dark:bg-[#1E1F22] dark:border-[#4A4D52]
                dark:text-gray-100
                focus:ring-2 focus:ring-blue-500 outline-none
              "
              onKeyDown={(e) => e.key === "Enter" && handleAddList()}
            />
            <button
              onClick={handleAddList}
              className="
                add-list-btn w-full mt-2 flex items-center justify-center gap-2
                bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md
              "
            >
              <Plus size={18} /> Add list
            </button>
          </div>
        </div>
      )}
    </Droppable>
  </div>
);
  
}

function AddCardSection({ listId, onAdd }) {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAdd(listId, title);
    setTitle("");
    setAdding(false);
  };

  return (
    <div className="px-2 pb-3 mt-2">
      {!adding ? (
        <button
          className="
            flex items-center gap-2 
            text-gray-700 dark:text-gray-200
            hover:text-black dark:hover:text-white
            text-sm px-2 py-1 rounded-md 
            hover:bg-gray-100 dark:hover:bg-white/10 transition
          "
          onClick={() => setAdding(true)}
        >
          <Plus size={15} /> Add a card
        </button>
      ) : (
        <div className="
          p-2 rounded-md
          bg-gray-100 border border-gray-300
          dark:bg-[#1E1F22] dark:border-[#4A4D52]
        ">
          <textarea
            className="
              w-full rounded-md px-2 py-1 text-sm 
              bg-white border border-gray-300 text-gray-800
              dark:bg-[#2B2D31] dark:border-[#4A4D52] 
              dark:text-gray-100 
              placeholder:text-gray-400 dark:placeholder:text-gray-500
              focus:outline-none focus:ring-2 focus:ring-blue-500
            "
            rows={2}
            placeholder="Enter card title…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />

          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSubmit}
              className="
                px-3 py-1 rounded-md text-sm
                bg-blue-600 hover:bg-blue-700 text-white
              "
            >
              Add card
            </button>

            <button
              onClick={() => {
                setAdding(false);
                setTitle("");
              }}
              className="
                text-gray-600 dark:text-gray-300
                hover:text-black dark:hover:text-white text-sm
              "
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}