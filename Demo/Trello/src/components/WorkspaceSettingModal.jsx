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
  const currentRole = currentMember?.role || "Undefined";

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

      toast.success(`Set role of ${member.userName} to ${newRole} successfully`);
      
      // Gọi onSuccess để refresh data bên ngoài
      onSuccess();
    } catch (err) {
      toast.error("Can't change role!");
      console.error(err);
    }
  };

  // Xử lý xóa thành viên
  const handleRemoveMember = async (member) => {
    if (!window.confirm(`Do you want to remove ${member.userName} from workspace?`))
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

      toast.success(`🗑️ Removed ${member.userName} from workspace`);
      onSuccess();
    } catch (err) {
      toast.error("You don't have permission to do this!");
      console.error(err);
    }
  };

  // Xử lý cập nhật thông tin workspace
  const handleUpdateWorkspace = async () => {
    if (!workspaceName.trim()) {
      toast.error("Workspace name must not be empty!");
      return;
    }

    try {
      await updateWorkspaceAPI(
        workspace.workspaceUId,
        workspaceName.trim(),
        workspaceDescription.trim(),
        currentUser.userUId
      );

      toast.success("Workspace information updated!");
      setIsEditingInfo(false);
      onSuccess(); // Refresh data bên ngoài
    } catch (err) {
      toast.error("Can't update workspace!");
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
    <div
      className="
        bg-white dark:bg-[#1E1F22]
        text-gray-800 dark:text-gray-200
        border border-gray-200 dark:border-[#3F4147]
        rounded-2xl shadow-2xl 
        max-w-3xl w-full max-h-[85vh] 
        overflow-y-auto relative p-8
      "
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="
          absolute top-4 right-4 p-2 rounded-full 
          hover:bg-gray-100 dark:hover:bg-white/10 transition
          text-gray-700 dark:text-gray-300
        "
      >
        <X size={22} />
      </button>

      <h2 className="text-2xl font-bold mb-2 flex items-center gap-2 text-gray-800 dark:text-gray-100">
        Workspace Settings
      </h2>

      {/* Current role */}
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        <span className="font-medium text-gray-800 dark:text-gray-200">Your role:</span>{" "}
        <span
          className={`font-semibold ${
            currentRole === "Owner"
              ? "text-blue-600 dark:text-blue-400"
              : currentRole === "Admin"
              ? "text-purple-600 dark:text-purple-400"
              : currentRole === "Member"
              ? "text-green-600 dark:text-green-400"
              : "text-gray-500 dark:text-gray-500"
          }`}
        >
          {currentRole}
        </span>
      </p>

      {/* Workspace info */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">

        {/* Workspace name */}
        <div className="sm:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">
              Workspace name
            </label>

            {(currentRole === "Owner" || currentRole === "Admin") && !isEditingInfo && (
              <button
                onClick={() => setIsEditingInfo(true)}
                className="
                  flex items-center gap-1 
                  text-blue-600 dark:text-blue-400 
                  hover:text-blue-700 dark:hover:text-blue-300
                  text-sm transition
                "
              >
                <Edit2 size={14} />
                Modify
              </button>
            )}
          </div>

          {isEditingInfo ? (
            <input
              type="text"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              className="
                w-full px-3 py-2 rounded-lg outline-none
                border border-gray-300 dark:border-[#4A4D52]
                bg-white dark:bg-[#2B2D31]
                text-gray-800 dark:text-gray-100
                placeholder:text-gray-400 dark:placeholder:text-gray-500
                focus:ring-2 focus:ring-blue-500
              "
              placeholder="Workspace name..."
              autoFocus
            />
          ) : (
            <p className="text-gray-800 dark:text-gray-100 text-base">{workspaceName}</p>
          )}
        </div>

        {/* Description */}
        <div className="sm:col-span-2">
          <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">
            Description
          </label>

          {isEditingInfo ? (
            <textarea
              value={workspaceDescription}
              onChange={(e) => setWorkspaceDescription(e.target.value)}
              rows="3"
              className="
                w-full px-3 py-2 rounded-lg resize-none outline-none
                border border-gray-300 dark:border-[#4A4D52]
                bg-white dark:bg-[#2B2D31]
                text-gray-800 dark:text-gray-100
                placeholder:text-gray-400 dark:placeholder:text-gray-500
                focus:ring-2 focus:ring-blue-500
              "
              placeholder="Workspace description..."
            />
          ) : (
            <p className="text-gray-700 dark:text-gray-300 mt-1">
              {workspaceDescription || "No description yet"}
            </p>
          )}
        </div>

        {/* Save / cancel */}
        {isEditingInfo && (
          <div className="sm:col-span-2 flex gap-2">
            <button
              onClick={handleUpdateWorkspace}
              className="
                flex items-center gap-1 px-4 py-2 rounded-lg
                bg-blue-600 hover:bg-blue-700
                text-white text-sm font-medium shadow-sm transition
              "
            >
              <Check size={16} />
              Save changes
            </button>

            <button
              onClick={handleCancelEdit}
              className="
                px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200
                border border-gray-300 dark:border-[#4A4D52]
                hover:bg-gray-50 dark:hover:bg-white/10 text-sm transition
              "
            >
              Cancel
            </button>
          </div>
        )}

        {/* Status */}
        <div>
          <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">
            State
          </label>

          <p
            className={`
              inline-block mt-1 px-2 py-1 rounded-md text-xs font-medium
              ${workspace.status === "Active"
                ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                : "bg-gray-100 text-gray-500 dark:bg-[#2B2D31] dark:text-gray-400"
              }
            `}
          >
            {workspace.status}
          </p>
        </div>
      </div>

      {/* Members list */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Member list ({members.length || 0})
        </h3>

        {members.length > 0 ? (
          <div className="space-y-2">
            {members.map((m) => (
              <div
                key={m.userUId}
                className="
                  flex items-center justify-between
                  bg-gray-50 dark:bg-[#2B2D31]
                  border border-gray-200 dark:border-[#3F4147]
                  px-4 py-3 rounded-lg
                  hover:bg-gray-100 dark:hover:bg-white/10 transition
                "
              >
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-100">
                    {m.userName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{m.role}</p>
                </div>

                {/* Role control */}
                <div className="flex items-center gap-3">
                  {currentRole === "Owner" ? (
                    m.userUId !== currentUser.userUId && (
                      <select
                        value={m.role}
                        onChange={(e) => handleRoleChange(m, e.target.value)}
                        className="
                          rounded-lg text-sm px-2 py-1 outline-none
                          bg-white dark:bg-[#1E1F22]
                          border border-gray-300 dark:border-[#4A4D52]
                          text-gray-800 dark:text-gray-100
                        "
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
                        className="
                          rounded-lg text-sm px-2 py-1 outline-none
                          bg-white dark:bg-[#1E1F22]
                          border border-gray-300 dark:border-[#4A4D52]
                          text-gray-800 dark:text-gray-100
                        "
                      >
                        <option value="Member">Member</option>
                        <option value="Viewer">Viewer</option>
                      </select>
                    )
                  ) : (
                    <span className="text-gray-400 dark:text-gray-500 text-sm">
                      Permission Required
                    </span>
                  )}

                  {/* Remove member */}
                  {(currentRole === "Owner" ||
                    (currentRole === "Admin" &&
                      m.role !== "Owner" &&
                      m.role !== "Admin")) &&
                    m.userUId !== currentUser.userUId && (
                      <button
                        onClick={() => handleRemoveMember(m)}
                        className="
                          p-2 rounded-lg transition
                          hover:bg-red-100 dark:hover:bg-red-900/40
                          text-red-600 dark:text-red-400
                        "
                        title="Delete member"
                      >
                        <UserMinus size={18} />
                      </button>
                    )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">No member yet</p>
        )}
      </div>

      {/* Bottom actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-[#3F4147]">
        <button
          onClick={onClose}
          className="
            px-4 py-2 rounded-lg
            border border-gray-300 dark:border-[#4A4D52]
            text-gray-700 dark:text-gray-200
            hover:bg-gray-50 dark:hover:bg-white/10 transition
          "
        >
          Close
        </button>

        {currentRole === "Owner" && (
          <button
            onClick={async () => {
              if (!window.confirm("Do you want to remove this workspace?")) return;
              try {
                await deleteWorkspaceAPI(workspace.workspaceUId, currentUser.userUId);
                toast.success("🗑️ Workspace deleted");
                onSuccess();
                onClose();
              } catch {
                toast.error("Can't remove this");
              }
            }}
            className="
              px-4 py-2 rounded-lg shadow-sm flex items-center gap-2 transition
              bg-red-600 hover:bg-red-700 text-white
            "
          >
            <Trash2 size={16} />
            Remove workspace
          </button>
        )}
      </div>
    </div>
  </div>
);

}