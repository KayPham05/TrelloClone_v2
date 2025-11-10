import React, { useState, useEffect } from "react";
import { X, Globe, Lock } from "lucide-react";
import { toast } from "react-toastify";
import { createBoardAPI } from "../services/BoardAPI";

export default function CreateBoardModal({
  currentUser,
  workspaces = [],
  defaultWorkspaceId = null,
  onClose,
  onSuccess,
}) {
  const [boardName, setBoardName] = useState("");
  const [workspaceId, setWorkspaceId] = useState(defaultWorkspaceId);
  const [visibility, setVisibility] = useState("Private");
  const [isLoading, setIsLoading] = useState(false);

  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);

  useEffect(() => {
    if (!workspaceId) {
      setMembers([]);
      setSelectedMembers([]);
      return;
    }

    const selectedWs = workspaces.find((ws) => ws.workspaceUId === workspaceId);
    if (selectedWs && Array.isArray(selectedWs.members)) {
      setMembers(selectedWs.members);
      
      // TỰ ĐỘNG THÊM OWNER VÀO selectedMembers
      const ownerMember = selectedWs.members.find(
        m => m.userUId === currentUser?.userUId && m.role === "Owner"
      );
      
      if (ownerMember) {
        setSelectedMembers([{
          userUId: ownerMember.userUId,
          BoardRole: "Owner" // ← Đổi từ role thành BoardRole
        }]);
      }
    } else {
      setMembers([]);
      setSelectedMembers([]);
    }
  }, [workspaceId, workspaces, currentUser]);

  const handleMemberChange = (userUId, role) => {
    setSelectedMembers((prev) => {
      const exists = prev.find((m) => m.userUId === userUId);
      if (exists) {
        // Nếu chọn "Không tham gia" thì xóa khỏi danh sách
        if (!role || role === "") {
          return prev.filter(m => m.userUId !== userUId);
        }
        // Cập nhật role
        return prev.map((m) => 
          m.userUId === userUId ? { ...m, BoardRole: role } : m // ← Đổi role thành BoardRole
        );
      } else {
        // Thêm mới nếu có chọn role
        if (role && role !== "") {
          return [...prev, { userUId, BoardRole: role }]; // ← Đổi role thành BoardRole
        }
        return prev;
      }
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!boardName.trim() || !currentUser) {
      toast.error("Vui lòng nhập tên board!");
      return;
    }

    const newBoard = {
      boardName: boardName.trim(),
      userUId: currentUser.userUId,
      workspaceUId: workspaceId || null,
      visibility,
      isPersonal: !workspaceId,
      members: selectedMembers, // ← Giờ đã có BoardRole
      createdAt: new Date().toISOString(),
    };

    console.log(" Sending board data:", newBoard);

    try {
      setIsLoading(true);
      const createdBoard = await createBoardAPI(newBoard);
      if (createdBoard?.board?.boardUId) {
        toast.success("Tạo board thành công!");
        onSuccess?.();
        onClose?.();
      } else {
        toast.error("Không thể tạo board!");
      }
    } catch (err) {
      console.error("Lỗi tạo board:", err);
      toast.error("Đã xảy ra lỗi khi tạo board!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-6">Create new board</h2>

        <form onSubmit={handleCreate} className="space-y-5">
          {/* Tên board */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Board name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              placeholder="Ex: Website Project, Marketing Plan"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              required
              autoFocus
            />
          </div>

          {/* Workspace */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From workspace
            </label>
            <select
              value={workspaceId || ""}
              onChange={(e) => setWorkspaceId(e.target.value || null)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
            >
              <option value="">(None - Personal board)</option>
              {workspaces.map((ws) => (
                <option key={ws.workspaceUId} value={ws.workspaceUId}>
                  {ws.name}
                </option>
              ))}
            </select>
          </div>

          {/* Thành viên trong board (chỉ khi Private) */}
          {workspaceId && visibility === "Private" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thành viên trong board
              </label>
              <div className="max-h-40 overflow-y-auto border rounded-lg p-2 space-y-2">
                {members.length > 0 ? (
                  members.map((m) => {
                    const isThisMemberCurrentUser = m.userUId === currentUser?.userUId;
                    const isOwner = isThisMemberCurrentUser && m.role === "Owner";
                    const shouldLock = isOwner;

                    //  Lấy role hiện tại từ selectedMembers
                    const currentSelection = selectedMembers.find(
                      sm => sm.userUId === m.userUId
                    );
                    const currentRole = currentSelection?.BoardRole || "";

                    return (
                      <div
                        key={m.userUId}
                        className="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2"
                      >
                        <span className="text-sm text-gray-700 font-medium">
                          {m.userName || m.email}
                          {isOwner && (
                            <span className="ml-2 text-xs text-blue-600 font-medium">
                              (Owner)
                            </span>
                          )}
                        </span>

                        {shouldLock ? (
                          <select
                            disabled
                            value="Owner"
                            className="border border-gray-200 bg-gray-100 rounded-md text-sm px-2 py-1 text-gray-500 cursor-not-allowed"
                          >
                            <option>Owner</option>
                          </select>
                        ) : (
                          <select
                            value={currentRole}
                            onChange={(e) =>
                              handleMemberChange(m.userUId, e.target.value)
                            }
                            className="border border-gray-300 rounded-md text-sm px-2 py-1 text-gray-700 cursor-pointer"
                          >
                            <option value="">Not participating in</option>
                            <option value="Admin" title="🔱 Quản trị viên có thể quản lý board và điều chỉnh thành viên">
                              Admin
                            </option>
                            <option value="Member" title="👥 Thành viên có thể tạo, chỉnh sửa và di chuyển thẻ trong board">
                              Member
                            </option>
                            <option value="Viewer" title="👀 Người xem chỉ có quyền xem nội dung trong board, không thể chỉnh sửa">
                              Viewer
                            </option>
                          </select>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500 text-center">
                    There is no member in this workspace.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Quyền truy cập */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Permissions
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setVisibility("Public")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition ${
                  visibility === "Public"
                    ? "bg-blue-100 border-blue-500 text-blue-700"
                    : "border-gray-300 hover:bg-gray-50 text-gray-700"
                }`}
              >
                <Globe size={16} />
                Public
              </button>
              <button
                type="button"
                onClick={() => setVisibility("Private")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition ${
                  visibility === "Private"
                    ? "bg-blue-100 border-blue-500 text-blue-700"
                    : "border-gray-300 hover:bg-gray-50 text-gray-700"
                }`}
              >
                <Lock size={16} />
                Private
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {visibility === "Public"
                ? "All workspace members can view this board"
                : "Only one who invited can access this board"}
            </p>
          </div>

          {/* Nút hành động */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2.5 rounded-lg text-white font-medium shadow-sm transition ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isLoading ? "Creating..." : "Create Board"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}