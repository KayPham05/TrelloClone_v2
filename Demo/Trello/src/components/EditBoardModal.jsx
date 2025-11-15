// src/components/EditBoardModal.jsx
import React, { useState, useEffect } from "react";
import { X, Trash2, Globe, Lock } from "lucide-react";
import { toast } from "react-toastify";
import { updateBoardAPI, deleteBoardAPI } from "../services/BoardAPI";
import {
  getBoardMembersAPI,
  updateBoardMemberRoleAPI,
  removeBoardMemberAPI,
  addBoardMemberAPI,       
} from "../services/BoardMemberAPI";

export default function EditBoardModal({
  open,
  onClose,
  board,          // { boardUId, boardName, visibility, workspaceUId, isPersonal }
  onSaved,        // callback sau khi lưu/xoá để refresh danh sách
  workspaceMembers = [],   // mảng member của workspace (userUId, userName, email, role)
}) {
  const [name, setName] = useState(board?.boardName || "");
  const [visibility, setVisibility] = useState(board?.visibility || "Private");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [members, setMembers] = useState([]);          // member hiện tại trong board
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [currentUserUId, setCurrentUserUId] = useState(null);

  // Lấy user hiện tại từ localStorage để gửi requesterUId lên BE
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCurrentUserUId(parsed.userUId);
      } catch {
        console.warn("Cannot parse user from localStorage");
      }
    }
  }, []);

  // Khi mở modal thì load lại name, visibility + members
  useEffect(() => {
    if (!open || !board) return;

    setName(board?.boardName || "");
    setVisibility(board?.visibility || "Private");
    setMembers([]);

    if (board.workspaceUId) {
      loadMembers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, board]);

  if (!open || !board) return null;

  const loadMembers = async () => {
    try {
      setLoadingMembers(true);
      const res = await getBoardMembersAPI(board.boardUId);

      let data = res; // axiosClient đang trả data trực tiếp

      if (Array.isArray(data)) {
        setMembers(data);
      } else if (data && Array.isArray(data.members)) {
        setMembers(data.members);
      } else {
        console.warn("API returned unexpected format:", data);
        setMembers([]);
      }
    } catch (err) {
      console.error("API ERROR:", err?.response?.status, err?.response?.data);
      setMembers([]);
    } finally {
      setLoadingMembers(false);
    }
  };
  

  // ====== Save tên + visibility ======
  const handleSave = async (e) => {
    e?.preventDefault?.();
    if (!name.trim()) {
      toast.error("Board name is required");
      return;
    }
    try {
      setSaving(true);
      const payload = {
        boardUId: board.boardUId,
        boardName: name.trim(),
        visibility,
        isPersonal: true,
        userUId: board.userUId, // giữ owner hiện tại
        status: board.status || "Active",
        createdAt: board.createdAt || new Date().toISOString(),
      };
      await updateBoardAPI(board.boardUId, payload);
      toast.success("Saved");

      const updateBoard = {
        ...board,
        boardName: payload.boardName,
        visibility: payload.visibility,
      };
      onSaved?.(updateBoard);
      onClose?.();
    } catch (err) {
      console.error(err);
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  // ====== Delete board ======
  const handleDelete = async () => {
    if (!confirm("Delete this board? This cannot be undone.")) return;
    try {
      setDeleting(true);
      await deleteBoardAPI(board.boardUId);
      toast.success("Board deleted");
      onSaved?.({ type: "delete", boardUId: board.boardUId });
      onClose?.();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  // ====== Remove member khỏi board ======
  const handleRemoveMember = async (userUId) => {
    if (!currentUserUId) return toast.error("Missing requester");

    try {
      await removeBoardMemberAPI(board.boardUId, userUId, currentUserUId);
      toast.success("Member removed");
      loadMembers();
    } catch (err) {
      console.error(err);
      toast.error("Remove failed");
    }
  };

  // ====== Change role của member đang có trong board ======
  const handleChangeRole = async (userUId, newRole) => {
    if (!currentUserUId) {
      toast.error("Missing requester!");
      return;
    }

    // Chọn "Not participating in" => confirm rồi mới xóa
    if (!newRole || newRole === "") {
      const ok = window.confirm(
        "Are you sure you want to remove this member from the board?"
      );
      if (!ok) {
        // Không làm gì => select sẽ tự trả về role cũ (vì state chưa đổi)
        return;
      }
      return handleRemoveMember(userUId);
    }

    try {
      await updateBoardMemberRoleAPI(
        board.boardUId,
        userUId,
        newRole,
        currentUserUId
      );
      toast.success("Updated role");
      loadMembers();
    } catch (err) {
      console.error("Failed to update role:", err);
      toast.error("Failed to update role");
    }
  };

  // ====== Add member từ workspace vào board ======
  const handleAddMember = async (userUId, role) => {
    if (!role) return; // chọn lại "Not participating in" thì bỏ qua
    if (!currentUserUId) {
      toast.error("Missing requester!");
      return;
    }

    try {
      await addBoardMemberAPI(board.boardUId, userUId, currentUserUId, role);
      toast.success("Member added to board");
      // reload lại danh sách member trong board
      loadMembers();
      console.log("workspaceMembers:", workspaceMembers);
console.log("availableWorkspaceMembers:", availableWorkspaceMembers);
    } catch (err) {
      console.error("Failed to add member:", err);
      toast.error("Failed to add member");
    }
    
  };
  const getUserLabel = (userUId, fallback) => {
    const wsMember =
      Array.isArray(workspaceMembers)
        ? workspaceMembers.find((wm) => wm.userUId === userUId)
        : null;

    return (
      wsMember?.userName ||
      wsMember?.email ||
      fallback?.email ||
      fallback?.userName ||
      fallback?.userUId ||
      userUId
    );
  };

  // Workspace members chưa ở trong board
  const availableWorkspaceMembers =
    Array.isArray(workspaceMembers) && workspaceMembers.length > 0
      ? workspaceMembers.filter(
          (wm) => !members.some((bm) => bm.userUId === wm.userUId)
        )
      : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div className="dark:bg-zinc-900 dark:border dark:border-zinc-700 relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6">
        <button
          onClick={onClose}
          className="dark:hover:bg-zinc-800 absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100"
          aria-label="Close"
        >
          <X className="text-gray-700 dark:!text-gray-200" size={18} />
        </button>

        <h3 className="dark:!text-gray-100 text-xl font-bold mb-4">
          Board settings
        </h3>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Name */}
          <div>
            <label className="dark:!text-gray-200 block text-sm font-medium text-gray-700 mb-1">
              Board name
            </label>
            <input
              className="dark:bg-zinc-800 dark:border-zinc-700 dark:!text-gray-100 dark:placeholder-zinc-400
                        w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Board name..."
            />
          </div>

          {/* Visibility */}
          <div>
            <label className="dark:!text-gray-200 block text-sm font-medium text-gray-700 mb-2">
              Visibility
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setVisibility("Public")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition
                  ${
                    visibility === "Public"
                      ? "dark:bg-blue-900/30 dark:border-blue-400 dark:!text-blue-200 bg-blue-100 border-blue-500 text-blue-700"
                      : "dark:border-zinc-700 dark:hover:bg-zinc-800 dark:!text-gray-200 border-gray-300 hover:bg-gray-50"
                  }`}
              >
                <Globe size={16} /> Public
              </button>
              <button
                type="button"
                onClick={() => setVisibility("Private")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition
                  ${
                    visibility === "Private"
                      ? "dark:bg-blue-900/30 dark:border-blue-400 dark:!text-blue-200 bg-blue-100 border-blue-500 text-blue-700"
                      : "dark:border-zinc-700 dark:hover:bg-zinc-800 dark:!text-gray-200 border-gray-300 hover:bg-gray-50"
                  }`}
              >
                <Lock size={16} /> Private
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1 dark:!text-gray-300">
              {visibility === "Public"
                ? "All workspace members can view this board."
                : "Only invited members can access this board."}
            </p>
          </div>

          {/* Board members (hiện cho workspace + Private) */}
          {board.workspaceUId && visibility === "Private" && (
            <>
              {/* LIST thành viên đang ở trong board */}
              <div className="mt-4 pt-4 border-t dark:border-zinc-700">
                <label className="dark:!text-gray-200 block text-sm font-medium text-gray-700 mb-2">
                  Board members
                </label>

                {loadingMembers ? (
                  <p className="text-sm text-gray-500 dark:!text-gray-300">
                    Loading...
                  </p>
                ) : members.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:!text-gray-300">
                    No members in this board.
                  </p>
                ) : (
                  <div className="space-y-3 max-h-56 overflow-y-auto pr-2">
                    {members.map((m) => {
                      const isOwner = m.role === "Owner";

                      return (
                        <div
                          key={m.userUId}
                          className="flex justify-between items-center bg-gray-50 dark:bg-zinc-800 rounded-lg px-3 py-2"
                        >
                          <span className="text-sm font-medium text-gray-700 dark:!text-gray-100">
                            {getUserLabel(m.userUId, m)}
                            {isOwner && (
                              <span className="ml-2 text-xs text-blue-600 dark:!text-blue-300 font-medium">
                                (Owner)
                              </span>
                            )}
                          </span>

                          {/* phần select role giữ nguyên */}
                          {isOwner ? (
                            <select
                              disabled
                              value="Owner"
                              className="border border-gray-200 bg-gray-100 rounded-md text-sm px-2 py-1 text-gray-500 cursor-not-allowed dark:bg-zinc-700 dark:border-zinc-600 dark:!text-gray-300"
                            >
                              <option value="Owner">Owner</option>
                            </select>
                          ) : (
                            <select
                              value={m.role || ""}
                              onChange={(e) =>
                                handleChangeRole(m.userUId, e.target.value)
                              }
                              className="border border-gray-300 rounded-md text-sm px-2 py-1 text-gray-700 cursor-pointer dark:bg-zinc-700 dark:border-zinc-600 dark:!text-gray-200"
                            >
                              <option value="">Not participating in</option>
                              <option value="Admin">Admin</option>
                              <option value="Member">Member</option>
                              <option value="Viewer">Viewer</option>
                            </select>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ADD member từ workspace (nếu có truyền vào) */}
              {availableWorkspaceMembers.length > 0 && (
                <div className="mt-4 pt-4 border-t dark:border-zinc-700">
                  <label className="dark:!text-gray-200 block text-sm font-medium text-gray-700 mb-2">
                    Add members from workspace
                  </label>
                  <p className="text-xs text-gray-500 dark:!text-gray-400 mb-2">
                    These people are in this workspace but not in this board.
                  </p>

                  <div className="space-y-3 max-h-56 overflow-y-auto pr-2">
                    {availableWorkspaceMembers.map((m) => (
                      <div
                        key={m.userUId}
                        className="flex justify-between items-center bg-gray-50 dark:bg-zinc-800 rounded-lg px-3 py-2"
                      >
                        <span className="text-sm font-medium text-gray-700 dark:!text-gray-100">
                          {getUserLabel(m.userUId, m)}
                        </span>

                        <select
                          defaultValue=""
                          onChange={(e) =>
                            handleAddMember(m.userUId, e.target.value)
                          }
                          className="border border-gray-300 rounded-md text-sm px-2 py-1 text-gray-700 cursor-pointer dark:bg-zinc-700 dark:border-zinc-600 dark:!text-gray-200"
                        >
                          <option value="">
                            Not participating in
                          </option>
                          <option value="Admin">Admin</option>
                          <option value="Member">Member</option>
                          <option value="Viewer">Viewer</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Footer */}
          <div className=" dark:border-zinc-700 flex justify-between items-center pt-4 border-t">
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="dark:border-red-400/40 dark:!text-red-300 dark:hover:bg-red-900/20 
                        inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50"
            >
              <Trash2 size={16} /> {deleting ? "Deleting..." : "Delete board"}
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border hover:bg-gray-50
                           border-gray-300 text-gray-700
                           dark:border-zinc-700 dark:hover:bg-zinc-800 dark:!text-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className={`px-4 py-2 rounded-lg text-white ${
                  saving ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
