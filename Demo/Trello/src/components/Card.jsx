import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import CardMenu from "./CardMenu";
import CardModal from "./CardModal";
import {
  deleteCardAPI,
  updateCardAPI,
  updateCardStatus,
} from "../services/todoApi";
import CardMemberPopup from "./CardMemberPopup";
import { getCardMembersAPI } from "../services/CardMemberAPI";
import "./css/Card.css";

export default function Card({
  card,
  boardMembers,
  board,
  provided,
  snapshot,
  onRefresh,
}) {
  const [menuState, setMenuState] = useState({
    open: false,
    position: { top: 0, left: 0 },
  });
  const [showModal, setShowModal] = useState(false);
  const [memberPopup, setMemberPopup] = useState({
    open: false,
    position: { top: 0, left: 0 },
  });

  const [isCompleted, setIsCompleted] = useState(
    card.status?.toLowerCase() === "completed"
  );
  const [cardMembers, setCardMembers] = useState([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);

  // Load card members khi card thay đổi hoặc sau khi refresh
  useEffect(() => {
    const fetchCardMembers = async () => {
      setIsLoadingMembers(true);
      try {
        const res = await getCardMembersAPI(card.cardUId);
        setCardMembers(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error("Không thể tải card members:", err);
        setCardMembers([]);
      } finally {
        setIsLoadingMembers(false);
      }
    };

    fetchCardMembers();
  }, [card.cardUId, card]); // Thêm card để reload khi có thay đổi

  // Cập nhật trạng thái completed khi card thay đổi
  useEffect(() => {
    setIsCompleted(card.status?.toLowerCase() === "completed");
  }, [card.status]);

  const handleCardMembersChange = async (members) => {
    console.log("Thành viên thẻ nhận từ popup:", members);
    setCardMembers(members);
    // Reload lại members sau khi thay đổi
    try {
      const res = await getCardMembersAPI(card.cardUId);
      setCardMembers(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Không thể tải lại card members:", err);
    }
  };

  // Toggle trạng thái hoàn thành
  const handleToggleComplete = async () => {
    try {
      const newStatus = isCompleted ? "Todo" : "Completed";
      await updateCardStatus(card.cardUId, newStatus);
      setIsCompleted(!isCompleted);
      onRefresh();
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái card:", err);
    }
  };

  // Xóa card
  const handleDelete = async () => {
    await deleteCardAPI(card.cardUId);
    onRefresh();
  };

  const handleManageMembers = (pos) => {
    if (!card.listUId) return;
    setMemberPopup({ open: true, position: pos });
  };

  // Mở menu
  const handleOpenMenu = (e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuState({
      open: true,
      position: {
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      },
    });
  };

  const handleCloseMenu = () => {
    setMenuState({ open: false, position: { top: 0, left: 0 } });
  };

  // Mở modal chi tiết
  const handleOpenCard = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Lưu chỉnh sửa trong modal
  const handleSaveModal = async (updatedCard) => {
    try {
      await updateCardAPI(updatedCard);
      setShowModal(false);
      onRefresh();
    } catch (err) {
      console.error("Lỗi khi cập nhật card:", err);
    }
  };

  // Tính trạng thái ngày hết hạn
  const getDueStatus = () => {
    if (!card.dueDate) return null;
    const now = new Date();
    const target = new Date(card.dueDate);
    if (target < now) return "overdue";
    const diff = target - now;
    if (diff < 1000 * 60 * 60 * 24) return "soon";
    return "normal";
  };
  const dueStatus = getDueStatus();

  // Màu theo trạng thái ngày đến hạn
  const dueColor =
    dueStatus === "overdue"
      ? "#F87171" // đỏ
      : dueStatus === "soon"
      ? "#FACC15" // vàng
      : "#86EFAC"; // xanh

  return (
    <>
  <div
    ref={provided.innerRef}
    {...provided.draggableProps}
    {...provided.dragHandleProps}
    className={`
      card-item 
      rounded-lg border-2 p-3 mb-2 cursor-pointer select-none
      transition-all duration-300

      bg-white border-gray-300
      hover:bg-gray-100

      dark:bg-[#2B2D31] dark:border-white/60
      dark:hover:bg-[#3A3C42]

      ${snapshot.isDragging ? "rotate-2 shadow-xl scale-[1.02]" : ""}
      ${isCompleted ? "opacity-80" : ""}
    `}
  >
    {/* ROW TOP */}
    <div className="flex items-start gap-2">

      {/* COMPLETE BUTTON */}
      <button
        className="
          mt-0.5 text-gray-500 hover:text-green-400
          dark:text-[#B5BAC1] dark:hover:text-green-400
          transition
        "
        onClick={handleToggleComplete}
      >
        {isCompleted ? (
          <i className="bi bi-check-circle-fill text-green-500"></i>
        ) : (
          <i className="bi bi-circle"></i>
        )}
      </button>

      {/* TITLE */}
      <div
        className={`
          flex-1 text-sm font-medium 
          text-gray-800 dark:text-[#F2F3F5]
          ${isCompleted ? "line-through text-gray-500 dark:text-[#8E9297]" : ""}
        `}
        onClick={handleOpenCard}
      >
        {card.title}
      </div>

      {/* EDIT BTN */}
      <button
        onClick={handleOpenMenu}
        className="
          text-gray-600 hover:text-blue-500
          dark:text-[#B5BAC1] dark:hover:text-blue-400
          transition
        "
      >
        <i className="bi bi-pencil-square"></i>
      </button>

      {/* MENU */}
      {menuState.open &&
        createPortal(
          <>
            <div className="menu-overlay" onClick={handleCloseMenu}></div>
            <CardMenu
              position={menuState.position}
              onOpenCard={() => {
                handleOpenCard();
                handleCloseMenu();
              }}
              onEdit={() => {
                handleOpenCard();
                handleCloseMenu();
              }}
              onDelete={handleDelete}
              onManageMembers={handleManageMembers}
              onClose={handleCloseMenu}
              listUId={card.listUId}
            />
          </>,
          document.body
        )}
    </div>

    {/* MEMBERS */}
    {isLoadingMembers ? (
      <div className="flex items-center gap-1 mt-2 px-1">
        <div className="w-6 h-6 bg-gray-300 dark:bg-[#3F4147] animate-pulse rounded-full"></div>
      </div>
    ) : (
      cardMembers.length > 0 && (
        <div className="flex items-center gap-1 mt-2 px-1">
          {cardMembers.slice(0, 3).map((member, index) => {
            const colors = [
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
            const color = colors[index % colors.length];

            return (
              <div
                key={member.userUId}
                className={`w-6 h-6 ${color} text-white text-xs flex items-center justify-center rounded-full font-semibold flex-shrink-0`}
                title={member.user?.userName}
              >
                {member.user?.userName
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </div>
            );
          })}

          {cardMembers.length > 3 && (
            <div className="
              w-6 h-6 bg-gray-400 dark:bg-[#4A4D54]
              text-white text-xs flex items-center justify-center rounded-full flex-shrink-0
            ">
              +{cardMembers.length - 3}
            </div>
          )}
        </div>
      )
    )}

    {/* DUE DATE */}
    {card.dueDate && (
      <div
        className={`
          due-date flex items-center gap-1 mt-2
          text-xs font-semibold px-2 py-0.5 rounded-full w-fit
          transition-all duration-300

          ${isCompleted ? "bg-green-500 text-white" : ""}
        `}
        style={
          !isCompleted
            ? {
                backgroundColor: dueColor,
                color: "#1E293B",
              }
            : {}
        }
      >
        <i className="bi bi-clock"></i>
        {new Date(card.dueDate).toLocaleDateString("vi-VN", {
          day: "numeric",
          month: "short",
        })}
      </div>
    )}
  </div>

  {/* CARD MODAL */}
  {showModal &&
    createPortal(
      <CardModal
        card={card}
        cardMembers={cardMembers}
        onClose={handleCloseModal}
        onSave={handleSaveModal}
      />,
      document.body
    )}

  {/* MEMBER POPUP */}
  {memberPopup.open &&
    createPortal(
      <CardMemberPopup
        card={card}
        requester={JSON.parse(localStorage.getItem("user"))}
        onClose={() =>
          setMemberPopup({ open: false, position: { top: 0, left: 0 } })
        }
        onChange={onRefresh}
        position={memberPopup.position}
        boardMembers={boardMembers}
        board={board}
        onChangeCard={handleCardMembersChange}
      />,
      document.body
    )}
</>

  );
}