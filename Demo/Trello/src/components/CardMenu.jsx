import React, { useEffect } from "react";
import {
  CreditCard,
  Edit3,
  Archive,
  Trash2,
  Copy,
  ArrowRight,
  Users,
} from "lucide-react";
import "./css/CardMenu.css";

export default function CardMenu({
  position,
  onEdit,
  onDelete,
  onOpenCard,
  onClose,
  onManageMembers, // callback để mở popup thành viên
  listUId, // truyền từ card xuống
}) {
  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest(".card-menu-floating")) onClose();
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  return (
    <div
      className="card-menu-floating"
      style={{
        position: "fixed",
        top: position.top,
        left: position.left,
      }}
    >
      <div className="card-menu-header">
        <span>Card handle</span>
        <button className="menu-close-btn" onClick={onClose}>
          ×
        </button>
      </div>

      <div className="card-menu-section">
        <button className="card-menu-item" onClick={onOpenCard}>
          <CreditCard size={16} />
          <span>Open card</span>
        </button>

        <button className="card-menu-item" onClick={onEdit}>
          <Edit3 size={16} />
          <span>Modify</span>
        </button>

        {/*  Chỉ hiện nếu có listUId (tức là card đã thuộc 1 list) */}
        {listUId && (
          <button
            className="card-menu-item"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              onManageMembers({
                top: rect.top + window.scrollY,
                left: rect.right + 8 + window.scrollX,
              });
            }}
          >
            <Users size={16} />
            <span>Change member</span>
          </button>
        )}

        <button className="card-menu-item">
          <Copy size={16} />
          <span>Duplicate card</span>
        </button>

        <button className="card-menu-item">
          <ArrowRight size={16} />
          <span>Move</span>
        </button>
      </div>

      <div className="card-menu-divider"></div>

      <div className="card-menu-section">
        <button className="card-menu-item">
          <Archive size={16} />
          <span>Archive</span>
        </button>

        <button className="card-menu-item danger" onClick={onDelete}>
          <Trash2 size={16} />
          <span>Delete card</span>
        </button>
      </div>
    </div>
  );
}
