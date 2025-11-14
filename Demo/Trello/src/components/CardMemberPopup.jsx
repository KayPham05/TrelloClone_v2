import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  getCardMembersAPI,
  removeCardMemberAPI,
  addCardMemberAPI,
} from "../services/CardMemberAPI";
import { addNotificationAPI } from "../services/NotificationAPI";
import { toast } from "react-toastify";

export default function CardMemberPopup({
  card,
  requester,
  onClose,
  position, // vị trí popup (truyền từ Card.jsx)
  boardMembers = [],
  board,
  list,
  onChangeCard,
}) {
  const [cardMembers, setCardMembers] = useState([]);
  const [search, setSearch] = useState("");

  // Load danh sách thành viên của thẻ
  useEffect(() => {
    if (!card?.cardUId) return;

    const fetchCardMembers = async () => {
      try {
        const cardRes = await getCardMembersAPI(card.cardUId);
        setCardMembers(Array.isArray(cardRes) ? cardRes : []);
      } catch (err) {
        console.log(err);
        toast.error("Không thể load thành viên của thẻ");
      }
    };

    fetchCardMembers();
  }, [card?.cardUId]);

  // Theo dõi khi boardMembers cập nhật
  useEffect(() => {
    if (boardMembers.length > 0)
      console.log("BoardMembers cập nhật:", boardMembers);
  }, [boardMembers]);

  // Thêm thành viên vào card
  const handleAddMember = async (userUId) => {
    console.log("addCard");
    try {
      await addCardMemberAPI(
        userUId,
        requester.userUId,
        board.boardUId,
        card.cardUId
      );
      toast.success("Member added to card!");
      const res = await getCardMembersAPI(card.cardUId);
      const next = Array.isArray(res) ? res : [];
      setCardMembers(next);
      onChangeCard && onChangeCard(next);

      // Tạo notification cho thành viên được thêm vào card
      const notificationPayload = {
        recipientId: userUId,
        actorId: requester.userUId,
        type: 1, // Assignment
        title: "Card Assignment",
        message: `${requester.userName} assigned you to card '${card.title}' in board '${board.boardName}'.`,
        link: `/boards/${board.boardUId}`,
        workspaceId: board.workspaceUId || null,
        boardId: board.boardUId,
        listId: list?.listUId || null,
        cardId: card.cardUId,
      };

      console.log(
        "Sending card assignment notification:",
        notificationPayload
      );
      await addNotificationAPI(notificationPayload);
    } catch (err) {
      toast.error("Can't add member :(");
      console.error(err);
    }
  };

  // Xóa thành viên khỏi card
  const handleRemoveMember = async (userUId) => {
    try {
      await removeCardMemberAPI(
        userUId,
        requester.userUId,
        board.boardUId,
        card.cardUId
      );
      toast.info("Member removed from card.");
      const res = await getCardMembersAPI(card.cardUId);
      const next = Array.isArray(res) ? res : [];
      setCardMembers(next);
      onChangeCard && onChangeCard(next);
    } catch (err) {
      toast.error("Can't remove member");
      console.error(err);
    }
  };

  // Lọc thành viên trong bảng (chưa có trong card)
  const filteredBoardMembers = (boardMembers || []).filter((bm) => {
    const name = bm.userName || bm.user?.userName || "";
    return (
      !cardMembers.some((cm) => cm.userUId === bm.userUId) &&
      name.toLowerCase().includes(search.toLowerCase())
    );
  });

  console.log("cardMembers", cardMembers);

  return (
    <div
      className="
        absolute z-[9999] w-72 rounded-lg border shadow-xl 
        bg-white border-gray-200 
        dark:bg-[#1E1F22] dark:border-[#2C2D30] 
        card-member-popup
      "
      style={{ top: position?.top, left: position?.left }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* HEADER */}
      <div
        className="
          flex justify-between items-center px-3 py-2 
          border-b border-gray-100 
          dark:border-[#2C2D30]
        "
      >
        <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
          Thay đổi thành viên
        </h2>
        <button
          onClick={onClose}
          className="
            p-1 rounded-md 
            hover:bg-gray-100 dark:hover:bg-[#2A2B2E] 
            transition
          "
        >
          <X size={16} className="text-gray-700 dark:text-gray-300" />
        </button>
      </div>

      {/* SEARCH */}
      <div
        className="
          p-3 border-b border-gray-100 
          dark:border-[#2C2D30]
        "
      >
        <input
          type="text"
          placeholder="Member searching"
          className="
            w-full px-2 py-1 text-sm rounded-md
            border border-gray-300 
            bg-white text-gray-800
            focus:ring-1 focus:ring-blue-500 outline-none
            dark:bg-[#2A2B2E] dark:border-[#3A3B3D]
            dark:text-gray-200 dark:placeholder:text-gray-400
          "
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* CARD MEMBERS */}
      <div
        className="
          p-3 border-b border-gray-100 
          dark:border-[#2C2D30]
        "
      >
        <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
          Card&apos;s members
        </h3>

        <div className="space-y-1 max-h-36 overflow-y-auto custom-scroll">
          {cardMembers.length > 0 ? (
            cardMembers.map((m) => (
              <div
                key={m.userUId}
                className="
                  flex items-center justify-between p-1.5 rounded-md
                  hover:bg-gray-50 dark:hover:bg-[#2A2B2E]
                  transition
                "
              >
                <div className="flex items-center gap-2">
                  <div
                    className="
                      w-7 h-7 rounded-full bg-blue-600 text-white 
                      flex items-center justify-center text-xs font-semibold
                    "
                  >
                    {m.user?.userName
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </div>
                  <span className="text-gray-800 dark:text-gray-200 text-sm">
                    {m.user?.userName}
                  </span>
                </div>

                <button
                  onClick={() => handleRemoveMember(m.userUId)}
                  className="
                    text-red-500 hover:text-red-700 
                    dark:text-red-400 dark:hover:text-red-300 
                    text-xs font-medium
                  "
                >
                  ✕
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-xs italic">
              This card has no member
            </p>
          )}
        </div>
      </div>

      {/* BOARD MEMBERS */}
      <div className="p-3">
        <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
          Board&apos;s members
        </h3>

        <div className="space-y-1 max-h-40 overflow-y-auto custom-scroll">
          {filteredBoardMembers.length > 0 ? (
            filteredBoardMembers.map((m) => (
              <div
                key={m.userUId}
                className="
                  flex items-center justify-between p-1.5 rounded-md cursor-pointer
                  hover:bg-blue-50 dark:hover:bg-[#1F3A5F]
                  transition
                "
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddMember(m.userUId);
                }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="
                      w-7 h-7 rounded-full 
                      bg-gray-300 text-gray-700
                      dark:bg-[#3A3B3D] dark:text-gray-200
                      flex items-center justify-center text-xs font-semibold
                    "
                  >
                    {(m.userName || m.user?.userName || "")
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </div>
                  <span className="text-gray-800 dark:text-gray-200 text-sm">
                    {m.userName || m.user?.userName}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-xs italic">
              No member found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
