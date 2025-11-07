import React, { useState } from 'react';
import { X, Mail, UserPlus, AlertCircle } from 'lucide-react';
import { getUserByEmailAPI } from '../services/UserAPI';
import { inviteUserToWorkspaceAPI } from '../services/WorkspaceAPI';

export default function InviteUserModal({ workspace, onClose, currentUser, onSuccess }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Member');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Vui lòng nhập email');
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Email không hợp lệ');
      return;
    }

    setLoading(true);
    setError('');

    try {
      //  Gọi API để tìm user theo email
      const res = await getUserByEmailAPI(email.trim());
      const user = res.data || res; // tùy backend trả JSON hay object
      if (!user?.userUId) {
        setError('Không tìm thấy user với email này');
        setLoading(false);
        return;
      }

      //  Mời user bằng userId
      await inviteUserToWorkspaceAPI(
        workspace.workspaceUId,
        user.userUId,
        currentUser.userUId,
        role
      );

      alert(`Đã mời ${email} vào workspace với vai trò ${role}`);
      onSuccess?.();
      onClose();

    } catch (err) {
      console.error('Error inviting user:', err);

      if (err.response?.status === 404)
        setError('Không tìm thấy user với email này');
      else if (err.response?.status === 400)
        setError('User đã là thành viên của workspace');
      else
        setError('Không thể mời user. Vui lòng thử lại sau');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Mời thành viên
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {workspace.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email thành viên <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="user@example.com"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                disabled={loading}
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vai trò
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              disabled={loading}
            >
              <option value="Member">Member - Thành viên</option>
              <option value="Admin">Admin - Quản trị viên</option>
              <option value="Admin">Viewer - Chỉ quan sát</option>
            </select>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Đang mời..." : "Mời vào Workspace"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
