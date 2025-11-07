import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  getCardMembersAPI,
  removeCardMemberAPI,
  addCardMemberAPI,
} from "../services/CardMemberAPI";
import { toast } from "react-toastify";

export default function CardMemberPopup({
  card,
  requester,
  onClose,
  onChange,
  position, // vị trí popup (truyền từ Card.jsx)
  boardMembers,
  board,
  onChangeCard,
}) {
  const [cardMembers, setCardMembers] = useState([]);
  const [search, setSearch] = useState("");

  //  Load danh sách thành viên của thẻ và của bảng
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
    try {
      await addCardMemberAPI(
        userUId,
        requester.userUId,
        board.boardUId,
        card.cardUId
      );
      toast.success(" Đã thêm thành viên vào thẻ!");
      const res = await getCardMembersAPI(card.cardUId);
      setCardMembers(Array.isArray(res) ? res : []);
      onChangeCard && onChangeCard(Array.isArray(res) ? res : []);
      onChange && onChange();
    } catch (err) {
      toast.error("Không thể thêm thành viên!");
      console.error(err);
    }
  };

  //  Xóa thành viên khỏi card
  const handleRemoveMember = async (userUId) => {
    try {
      await removeCardMemberAPI(
        userUId,
        requester.userUId,
        board.boardUId,
        card.cardUId
      );
      toast.info("Đã xóa thành viên khỏi thẻ.");
      const res = await getCardMembersAPI(card.cardUId);
      setCardMembers(Array.isArray(res) ? res : []);
      onChangeCard && onChangeCard(Array.isArray(res) ? res : []);
      onChange && onChange();
    } catch (err) {
      toast.error("Không thể xóa thành viên!");
      console.error(err);
    }
  };

  //  Lọc thành viên trong bảng (chưa có trong card)
  const filteredBoardMembers = boardMembers.filter((bm) => {
    const name = bm.userName || bm.user?.userName || "";
    return (
      !cardMembers.some((cm) => cm.userUId === bm.userUId) &&
      name.toLowerCase().includes(search.toLowerCase())
    );
  });

  console.log("cardMembers", cardMembers);
  return (
    <div
      className="absolute z-[9999] bg-white rounded-lg shadow-xl border border-gray-200 w-72"
      style={{
        top: position?.top || 0,
        left: position?.left || 0,
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-100 px-3 py-2">
        <h2 className="text-sm font-semibold text-gray-800">
          Thay đổi thành viên
        </h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-md transition"
        >
          <X size={16} />
        </button>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-gray-100">
        <input
          type="text"
          placeholder="Tìm kiếm các thành viên"
          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Thành viên của thẻ */}
      <div className="p-3 border-b border-gray-100">
        <h3 className="text-xs font-semibold text-gray-600 mb-2">
          Thành viên của thẻ
        </h3>
        <div className="space-y-1 max-h-36 overflow-y-auto">
          {cardMembers.length > 0 ? (
            cardMembers.map((m) => (
              <div
                key={m.userUId}
                className="flex items-center justify-between p-1.5 rounded-md hover:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-semibold">
                    {m.user?.userName
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </div>
                  <span className="text-gray-800 text-sm">
                    {m.user?.userName}
                  </span>
                </div>
                <button
                  onClick={() => handleRemoveMember(m.userUId)}
                  className="text-red-500 hover:text-red-700 text-xs font-medium"
                >
                  ✕
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-xs italic">
              Chưa có thành viên nào trong thẻ
            </p>
          )}
        </div>
      </div>

      {/* Thành viên của bảng */}
      <div className="p-3">
        <h3 className="text-xs font-semibold text-gray-600 mb-2">
          Thành viên của bảng
        </h3>
        <div className="space-y-1 max-h-40 overflow-y-auto">
          {filteredBoardMembers.length > 0 ? (
            filteredBoardMembers.map((m) => (
              <div
                key={m.userUId}
                className="flex items-center justify-between p-1.5 rounded-md hover:bg-blue-50 cursor-pointer"
                onClick={() => handleAddMember(m.userUId)}
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gray-300 text-gray-700 text-xs flex items-center justify-center font-semibold">
                    {(m.userName || m.user?.userName)
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </div>
                  <span className="text-gray-800 text-sm">
                    {m.userName || m.user?.userName}
                  </span>
                </div>
                <span className="text-blue-600 text-xs font-medium">Thêm</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-xs italic">
              Không tìm thấy thành viên nào để thêm
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
