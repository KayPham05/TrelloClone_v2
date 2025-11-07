import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Inbox as InboxIcon } from "lucide-react";
import { Droppable } from "@hello-pangea/dnd";
import { getUserInboxAPI } from "../services/UserInboxAPI";
import { addCardToInboxAPI } from "../services/AddCardInboxAPI";
import PortalAwareDraggable from "./PortalAwareDraggable";
import Card from "./Card";
import "./css/trello.css";

export default function Inbox({ refresh, setRefresh }) {
  const [cards, setCards] = useState([]);
  const [newCard, setNewCard] = useState("");
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchCards();
  }, [refresh]);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const res = await getUserInboxAPI(user.userUId);
      const data = Array.isArray(res) ? res : [];
      
      console.log("📥 Inbox cards fetched:", data.length);
      
      setCards(data);
    } catch (err) {
      toast.error("Lỗi khi lấy danh sách card!");
      console.error("fetchCards error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newCard.trim()) return;
    try {
      const temp = {
        userUId: user.userUId,
        card: {
          title: newCard,
          description: "",
          listUId: null, // Inbox cards có listUId = null
          status: "Todo", // Mặc định là Todo
        },
      };
      await addCardToInboxAPI(temp);
      setNewCard("");
      setAdding(false);
      
      // Delay nhẹ để đảm bảo backend lưu xong
      setTimeout(() => {
        setRefresh((r) => !r);
      }, 200);
    } catch (err) {
      toast.error("Lỗi khi thêm card!");
      console.error("handleAdd error:", err);
    }
  };

  return (
    <Droppable droppableId="inbox" type="CARD">
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`trello-column transition-all duration-200 ${
            snapshot.isDraggingOver ? "bg-[#12263d]" : "bg-[#0D1B2A]"
          }`}
        >
          <div className="inbox-header flex items-center gap-2 mb-2">
            <InboxIcon size={18} />
            <h3>Inbox</h3>
          </div>

          {!adding ? (
            <button className="add-card-btn" onClick={() => setAdding(true)}>
              + Thêm thẻ
            </button>
          ) : (
            <div className="add-card-box">
              <input
                className="add-card-input"
                placeholder="Nhập tiêu đề..."
                value={newCard}
                onChange={(e) => setNewCard(e.target.value)}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAdd();
                  if (e.key === 'Escape') setAdding(false);
                }}
              />
              <div className="btn-row">
                <button className="add-card-confirm" onClick={handleAdd}>
                  Thêm
                </button>
                <button
                  className="add-card-cancel"
                  onClick={() => setAdding(false)}
                >
                  Hủy
                </button>
              </div>
            </div>
          )}

          <ul className="card-list">
            {loading ? (
              <div className="text-white/50 text-sm p-2">Đang tải...</div>
            ) : (
              cards.map((card, index) => (
                <PortalAwareDraggable
                  key={card.cardUId}
                  draggableId={card.cardUId}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <Card
                      card={card}
                      provided={provided}
                      snapshot={snapshot}
                      onRefresh={() => setRefresh((r) => !r)}
                    />
                  )}
                </PortalAwareDraggable>
              ))
            )}
            {provided.placeholder}
          </ul>
        </div>
      )}
    </Droppable>
  );
}