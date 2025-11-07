import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Trash2, X, UserMinus, Edit2, Check } from "lucide-react";
import {
  deleteWorkspaceAPI,
  updateWorkspaceMemberRole,
  removeMemberFromWorkspaceAPI,
  updateWorkspaceAPI,
} from "../services/WorkspaceAPI";

export default function WorkspaceSettingModal({
  workspace,
  onClose,
  onSuccess,
  currentUser,
}) {
  // State local để quản lý members
  const [members, setMembers] = useState([]);
  
  // State cho chỉnh sửa workspace info
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceDescription, setWorkspaceDescription] = useState("");

  // Sync members và workspace info từ props
  useEffect(() => {
    if (workspace?.members) {
      setMembers([...workspace.members]);
    }
    if (workspace) {
      setWorkspaceName(workspace.name || "");
      setWorkspaceDescription(workspace.description || "");
    }
  }, [workspace]);

  if (!workspace) return null;

  // Lấy role thực tế của user hiện tại
  const currentMember = members.find(
    (m) => m.userUId === currentUser?.userUId
  );
  const currentRole = currentMember?.role || "Không xác định";

  const handleRoleChange = async (member, newRole) => {
    try {
      // Gọi API cập nhật
      await updateWorkspaceMemberRole(
        workspace.workspaceUId,
        member.userUId,
        newRole,
        currentUser.userUId
      );

      // Cập nhật state local ngay lập tức
      setMembers((prevMembers) =>
        prevMembers.map((m) =>
          m.userUId === member.userUId ? { ...m, role: newRole } : m
        )
      );

      toast.success(`Đã cập nhật quyền của ${member.userName} thành ${newRole}`);
      
      // Gọi onSuccess để refresh data bên ngoài
      onSuccess();
    } catch (err) {
      toast.error("Không thể cập nhật quyền!");
      console.error(err);
    }
  };

  // Xử lý xóa thành viên
  const handleRemoveMember = async (member) => {
    if (!window.confirm(`Bạn có chắc muốn xóa ${member.userName} khỏi workspace?`))
      return;
    try {
      await removeMemberFromWorkspaceAPI(
        workspace.workspaceUId,
        member.userUId,
        currentUser.userUId
      );

      // Xóa member khỏi state local ngay lập tức
      setMembers((prevMembers) =>
        prevMembers.filter((m) => m.userUId !== member.userUId)
      );

      toast.success(`🗑️ Đã xóa ${member.userName} khỏi workspace`);
      onSuccess();
    } catch (err) {
      toast.error(" Bạn không có quyền xóa thành viên này!");
      console.error(err);
    }
  };

  // Xử lý cập nhật thông tin workspace
  const handleUpdateWorkspace = async () => {
    if (!workspaceName.trim()) {
      toast.error("Tên workspace không được để trống!");
      return;
    }

    try {
      await updateWorkspaceAPI(
        workspace.workspaceUId,
        workspaceName.trim(),
        workspaceDescription.trim(),
        currentUser.userUId
      );

      toast.success(" Đã cập nhật thông tin workspace!");
      setIsEditingInfo(false);
      onSuccess(); // Refresh data bên ngoài
    } catch (err) {
      toast.error(" Không thể cập nhật workspace!");
      console.error(err);
    }
  };

  // Hủy chỉnh sửa
  const handleCancelEdit = () => {
    setWorkspaceName(workspace.name || "");
    setWorkspaceDescription(workspace.description || "");
    setIsEditingInfo(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto relative p-8">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition"
        >
          <X size={22} />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          Cài đặt Workspace
        </h2>

        {/* Vai trò hiện tại */}
        <p className="text-sm text-gray-600 mb-6">
          <span className="font-medium text-gray-800">Vai trò của bạn:</span>{" "}
          <span
            className={`font-semibold ${
              currentRole === "Owner"
                ? "text-blue-600"
                : currentRole === "Admin"
                ? "text-purple-600"
                : currentRole === "Member"
                ? "text-green-600"
                : "text-gray-500"
            }`}
          >
            {currentRole}
          </span>
        </p>

        {/* Thông tin workspace */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {/* Tên Workspace - Có thể chỉnh sửa */}
          <div className="sm:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-600">
                Tên Workspace
              </label>
              {(currentRole === "Owner" || currentRole === "Admin") && !isEditingInfo && (
                <button
                  onClick={() => setIsEditingInfo(true)}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm transition"
                >
                  <Edit2 size={14} />
                  Chỉnh sửa
                </button>
              )}
            </div>
            
            {isEditingInfo ? (
              <input
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Nhập tên workspace..."
                autoFocus
              />
            ) : (
              <p className="text-gray-800 text-base">{workspaceName}</p>
            )}
          </div>

          {/* Mô tả - Có thể chỉnh sửa */}
          <div className="sm:col-span-2">
            <label className="text-sm font-semibold text-gray-600">Mô tả</label>
            {isEditingInfo ? (
              <textarea
                value={workspaceDescription}
                onChange={(e) => setWorkspaceDescription(e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                placeholder="Nhập mô tả workspace..."
              />
            ) : (
              <p className="text-gray-700 mt-1">
                {workspaceDescription || "Chưa có mô tả"}
              </p>
            )}
          </div>

          {/* Nút Lưu/Hủy khi đang chỉnh sửa */}
          {isEditingInfo && (
            <div className="sm:col-span-2 flex gap-2">
              <button
                onClick={handleUpdateWorkspace}
                className="flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition shadow-sm"
              >
                <Check size={16} />
                Lưu thay đổi
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm transition"
              >
                Hủy
              </button>
            </div>
          )}

          {/* Trạng thái */}
          <div>
            <label className="text-sm font-semibold text-gray-600">Trạng thái</label>
            <p
              className={`inline-block mt-1 px-2 py-1 rounded-md text-xs font-medium ${
                workspace.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {workspace.status}
            </p>
          </div>
        </div>

        {/* --- Danh sách thành viên --- */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Danh sách thành viên ({members.length || 0})
          </h3>

          {members.length > 0 ? (
            <div className="space-y-2">
              {members.map((m) => (
                <div
                  key={m.userUId}
                  className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                >
                  <div>
                    <p className="font-medium text-gray-800">{m.userName}</p>
                    <p className="text-xs text-gray-500">{m.role}</p>
                  </div>

                  {/* Quyền thao tác */}
                  <div className="flex items-center gap-3">
                    {/* Dropdown đổi vai trò */}
                    {currentRole === "Owner" ? (
                      m.userUId !== currentUser.userUId && (
                        <select
                          value={m.role}
                          onChange={(e) => handleRoleChange(m, e.target.value)}
                          className="border border-gray-300 rounded-lg text-sm px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="Admin">Admin</option>
                          <option value="Member">Member</option>
                          <option value="Viewer">Viewer</option>
                        </select>
                      )
                    ) : currentRole === "Admin" ? (
                      m.role !== "Owner" &&
                      m.role !== "Admin" && (
                        <select
                          value={m.role}
                          onChange={(e) => handleRoleChange(m, e.target.value)}
                          className="border border-gray-300 rounded-lg text-sm px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="Member">Member</option>
                          <option value="Viewer">Viewer</option>
                        </select>
                      )
                    ) : (
                      <span className="text-gray-400 text-sm">Không có quyền</span>
                    )}

                    {/* Nút xóa thành viên */}
                    {(currentRole === "Owner" ||
                      (currentRole === "Admin" &&
                        m.role !== "Owner" &&
                        m.role !== "Admin")) &&
                      m.userUId !== currentUser.userUId && (
                        <button
                          onClick={() => handleRemoveMember(m)}
                          className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition"
                          title="Xóa thành viên"
                        >
                          <UserMinus size={18} />
                        </button>
                      )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Chưa có thành viên nào</p>
          )}
        </div>

        {/* --- Hành động cuối --- */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            Đóng
          </button>

          {currentRole === "Owner" && (
            <button
              onClick={async () => {
                if (!window.confirm("Bạn có chắc muốn xóa workspace này?")) return;
                try {
                  await deleteWorkspaceAPI(workspace.workspaceUId, currentUser.userUId);
                  toast.success("🗑️ Đã xóa workspace thành công!");
                  onSuccess();
                  onClose();
                } catch {
                  toast.error("Không thể xóa workspace!");
                }
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm flex items-center gap-2 transition"
            >
              <Trash2 size={16} />
              Xóa Workspace
            </button>
          )}
        </div>
      </div>
    </div>
  );
}