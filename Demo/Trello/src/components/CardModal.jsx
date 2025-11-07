import React, { useState, useEffect } from "react";
import {
  X,
  CreditCard,
  AlignLeft,
  MessageSquare,
  User,
  Calendar,
  Paperclip,
  CheckSquare,
  Clock,
  Tag,
  Copy,
  Archive,
  Share2,
} from "lucide-react";
import {
  getCommentsAPI,
  addCommentAPI,
  deleteCommentAPI,
} from "../services/CommentAPI";
import {
  getTodoItemsAPI,
  addTodoItemAPI,
  deleteTodoItemAPI,
  updateStatusTodoItemAPI,
} from "../services/AddTodoItem";
import { updateCardAPI } from "../services/todoApi";
import { getCardMembersAPI } from "../services/CardMemberAPI";
import "./css/CardModal.css";

export default function CardModal({ card, onClose, onSave }) {
  const [title, setTitle] = useState(card.title || "");
  const [description, setDescription] = useState(card.description || "");
  const [dueDate, setDueDate] = useState(card.dueDate || "");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [todoItems, setTodoItems] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [cardMembers, setCardMembers] = useState([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const storedUser = JSON.parse(localStorage.getItem("user"));

  // Load dữ liệu khi mở modal
  useEffect(() => {
    if (card?.cardUId) {
      fetchComments(card.cardUId);
      fetchTodos(card.cardUId);
      fetchCardMembers(card.cardUId);
    }
  }, [card]);

  // Load card members
  const fetchCardMembers = async (cardUId) => {
    setIsLoadingMembers(true);
    try {
      const res = await getCardMembersAPI(cardUId);
      setCardMembers(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Không thể tải card members:", err);
      setCardMembers([]);
    } finally {
      setIsLoadingMembers(false);
    }
  };

  // Comments
  const fetchComments = async (id) => {
    try {
      const data = await getCommentsAPI(id);
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Lỗi khi lấy comments:", err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    const comment = {
      content: newComment,
      cardUId: card.cardUId,
      userUId: storedUser.userUId,
    };
    try {
      const added = await addCommentAPI(comment);
      setComments((prev) => [added, ...prev]);
      setNewComment("");
    } catch (err) {
      console.error("Lỗi khi thêm comment:", err);
    }
  };

  const handleDeleteComment = async (id) => {
    try {
      await deleteCommentAPI(id);
      setComments((prev) => prev.filter((c) => c.commentUId !== id));
    } catch (err) {
      console.error("Lỗi khi xóa comment:", err);
    }
  };

  // Checklist (TodoItem)
  const fetchTodos = async (cardUId) => {
    try {
      const data = await getTodoItemsAPI(cardUId);
      setTodoItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Lỗi khi lấy todo items:", err);
    }
  };

  const handleAddTodo = async () => {
    if (!newTodo.trim()) return;
    try {
      await addTodoItemAPI(card.cardUId, newTodo);
      setNewTodo("");
      fetchTodos(card.cardUId);
    } catch (err) {
      console.error("Lỗi khi thêm todo item:", err);
    }
  };

  const handleToggleTodo = async (item) => {
    const newStatus = item.isCompleted ? "incomplete" : "completed";
    try {
      await updateStatusTodoItemAPI(item.todoItemUId, newStatus);
      fetchTodos(card.cardUId);
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái todo:", err);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await deleteTodoItemAPI(id);
      fetchTodos(card.cardUId);
    } catch (err) {
      console.error("Lỗi khi xóa todo item:", err);
    }
  };

  // Ngày đến hạn (due date)
  const getDueStatus = () => {
    if (!dueDate) return null;
    const now = new Date();
    const target = new Date(dueDate);
    if (target < now) return "overdue";
    const diff = target - now;
    if (diff < 1000 * 60 * 60 * 24) return "soon";
    return "normal";
  };
  const dueStatus = getDueStatus();

  // Lưu thay đổi (update card)
  const handleSave = async () => {
    try {
      const updated = {
        ...card,
        title,
        description,
        dueDate,
      };
      await updateCardAPI(updated);
      onSave(updated);
    } catch (err) {
      console.error("Lỗi khi cập nhật card:", err);
    }
  };

  return (
    <div className="modal-overlay-new" onClick={onClose}>
      <div className="cardmodal-wrapper" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="cardmodal-header">
          <div className="header-left">
            <CreditCard size={24} className="header-icon" />
            <div>
              <textarea
                className="header-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                rows="1"
              />
              <p className="header-subtitle">
                trong danh sách <span>Inbox</span>
              </p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* THÀNH VIÊN TRONG THẺ */}
        {isLoadingMembers ? (
          <div className="flex items-center gap-2 px-4 py-2">
            <User size={16} className="text-gray-500" />
            <div className="w-8 h-8 bg-gray-200 animate-pulse rounded-full"></div>
          </div>
        ) : (
          cardMembers.length > 0 && (
            <div className="flex items-center gap-2 px-4 py-2">
              <User size={16} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Thành viên:</span>
              <div className="flex items-center gap-1">
                {cardMembers.map((member, index) => {
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
                      className={`w-8 h-8 ${color} text-white text-xs flex items-center justify-center rounded-full font-semibold flex-shrink-0 cursor-pointer hover:scale-110 transition-transform`}
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
              </div>
            </div>
          )
        )}

        {/* NGÀY HẾT HẠN */}
        <div className="due-section">
          <div className="due-label">
            <Clock size={16} />
            <span>Ngày hết hạn:</span>
          </div>
          <div className="due-content">
            <input
              type="datetime-local"
              value={
                dueDate ? new Date(dueDate).toISOString().slice(0, 16) : ""
              }
              onChange={(e) => setDueDate(e.target.value)}
              className="due-input"
            />
            {dueDate && (
              <span
                className={`due-status ${
                  dueStatus === "overdue"
                    ? "overdue"
                    : dueStatus === "soon"
                    ? "soon"
                    : "normal"
                }`}
              >
                {dueStatus === "overdue"
                  ? "Quá hạn"
                  : dueStatus === "soon"
                  ? "Sắp đến hạn"
                  : "Đúng hạn"}
              </span>
            )}
          </div>
        </div>

        {/* BODY */}
        <div className="cardmodal-body">
          {/* LEFT */}
          <div className="cardmodal-left">
            {/* MÔ TẢ */}
            <div className="modal-section">
              <div className="section-header">
                <AlignLeft size={20} />
                <h3>Mô tả</h3>
              </div>
              {!isEditingDesc ? (
                <div
                  className="description-display"
                  onClick={() => setIsEditingDesc(true)}
                >
                  {description || "Thêm mô tả chi tiết hơn..."}
                </div>
              ) : (
                <div className="description-edit">
                  <textarea
                    className="description-textarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    autoFocus
                  />
                  <div className="description-actions">
                    <button
                      className="btn-primary"
                      onClick={() => setIsEditingDesc(false)}
                    >
                      Lưu
                    </button>
                    <button
                      className="btn-secondary"
                      onClick={() => {
                        setIsEditingDesc(false);
                        setDescription(card.description || "");
                      }}
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* CHECKLIST */}
            <div className="modal-section">
              <div className="section-header">
                <CheckSquare size={20} />
                <h3>Việc cần làm</h3>
                {todoItems.length > 0 && (
                  <div className="section-actions">
                    <button
                      className="btn-secondary btn-sm"
                      onClick={() =>
                        setTodoItems(todoItems.filter((t) => !t.isCompleted))
                      }
                    >
                      Ẩn các mục đã chọn
                    </button>
                    <button
                      className="btn-secondary btn-sm"
                      onClick={() => {
                        if (window.confirm("Xóa tất cả việc cần làm?"))
                          todoItems.forEach((t) =>
                            handleDeleteTodo(t.todoItemUId)
                          );
                      }}
                    >
                      Xóa
                    </button>
                  </div>
                )}
              </div>

              {/* Thanh tiến trình */}
              {todoItems.length > 0 && (
                <div className="progress-wrapper">
                  <span className="progress-text">
                    {Math.round(
                      (todoItems.filter((t) => t.isCompleted).length /
                        todoItems.length) *
                        100
                    )}
                    %
                  </span>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${
                          (todoItems.filter((t) => t.isCompleted).length /
                            todoItems.length) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Ô thêm mới */}
              <div className="todo-add">
                <input
                  className="todo-input"
                  placeholder="Thêm một mục"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddTodo()}
                />
                <button className="btn-primary btn-sm" onClick={handleAddTodo}>
                  Thêm
                </button>
              </div>

              {/* Danh sách Checklist */}
              <ul className="todo-list">
                {todoItems.map((t) => (
                  <li key={t.todoItemUId} className="todo-item">
                    <label className="todo-label">
                      <input
                        type="checkbox"
                        checked={t.isCompleted}
                        onChange={() => handleToggleTodo(t)}
                      />
                      <span
                        className={`todo-text ${
                          t.isCompleted ? "line-through text-gray-500" : ""
                        }`}
                      >
                        {t.content}
                      </span>
                    </label>
                    <button
                      className="todo-delete"
                      onClick={() => handleDeleteTodo(t.todoItemUId)}
                    >
                      🗑️
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* RIGHT - COMMENT */}
          <div className="cardmodal-right">
            <div className="sidebar-section">
              <h4>Nhận xét và hoạt động</h4>
              <div className="comment-input">
                <div className="comment-avatar">KP</div>
                <div className="comment-box">
                  <textarea
                    className="comment-textarea"
                    placeholder="Viết bình luận..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  {newComment && (
                    <button
                      className="btn-primary btn-sm"
                      onClick={handleAddComment}
                    >
                      Lưu
                    </button>
                  )}
                </div>
              </div>

              <div className="comment-list">
                {comments.map((c) => (
                  <div key={c.commentUId} className="comment-item">
                    <div className="comment-avatar">
                      {c.user?.userName?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div className="comment-content">
                      <div className="comment-header">
                        <strong>{c.user?.userName || "Ẩn danh"}</strong>
                        <span className="comment-time">
                          {new Date(c.createdAt).toLocaleString("vi-VN", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="comment-text">{c.content}</p>
                      <button
                        className="comment-delete"
                        onClick={() => handleDeleteComment(c.commentUId)}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button className="btn-save" onClick={handleSave}>
              💾 Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}