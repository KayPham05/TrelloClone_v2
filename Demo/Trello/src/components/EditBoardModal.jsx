// src/components/EditBoardModal.jsx
import React, { useState, useEffect } from "react";
import { X, Trash2, Globe, Lock } from "lucide-react";
import { toast } from "react-toastify";
import { updateBoardAPI, deleteBoardAPI } from "../services/BoardAPI";

export default function EditBoardModal({
  open,
  onClose,
  board,              // { boardUId, boardName, visibility, workspaceUId, isPersonal }
  onSaved,            // callback sau khi lưu/xoá để refresh danh sách
}) {
  const [name, setName] = useState(board?.boardName || "");
  const [visibility, setVisibility] = useState(board?.visibility || "Private");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName(board?.boardName || "");
    setVisibility(board?.visibility || "Private");
  }, [open, board]);

  if (!open || !board) return null;

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
      }
      onSaved?.(updateBoard);
      onClose?.();
    } catch (err) {
      console.error(err);
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this board? This cannot be undone.")) return;
    try {
      setDeleting(true);
      await deleteBoardAPI(board.boardUId);
      toast.success("Board deleted");
      onSaved?.({type: "delete", boardUId: board.boardUId});
      onClose?.();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
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

        <h3 className="dark:!text-gray-100 text-xl font-bold mb-4">Board settings</h3>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Name */}
          <div>
            <label className="dark:!text-gray-200 block text-sm font-medium text-gray-700 mb-1">Board name</label>
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
            <label className="dark:!text-gray-200 block text-sm font-medium text-gray-700 mb-2">Visibility</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setVisibility("Public")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition
                  ${visibility === "Public" 
                    ? "dark:bg-blue-900/30 dark:border-blue-400 dark:!text-blue-200 bg-blue-100 border-blue-500 text-blue-700"
                    : "dark:border-zinc-700 dark:hover:bg-zinc-800 dark:!text-gray-200 border-gray-300 hover:bg-gray-50"}`}
              >
                <Globe size={16} /> Public
              </button>
              <button
                type="button"
                onClick={() => setVisibility("Private")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition
                  ${visibility === "Private" 
                    ? "dark:bg-blue-900/30 dark:border-blue-400 dark:!text-blue-200 bg-blue-100 border-blue-500 text-blue-700"
                    : "dark:border-zinc-700 dark:hover:bg-zinc-800 dark:!text-gray-200 border-gray-300 hover:bg-gray-50"}`}
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
                className={`px-4 py-2 rounded-lg text-white ${saving ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
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
