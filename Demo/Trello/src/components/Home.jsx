import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import RightSidebar from "../components/RightSidebar";
import RecentBoardsSection from "../components/RecentBoardsSection";
import PersonalBoardSection from "../components/PersonalBoardSection";
import WorkspaceSection from "../components/WorkspaceSection";
import InviteUserModal from "./InviteUserModel";
import { getBoardsAPI } from "../services/BoardAPI";
import WorkspaceSettingModal from "./WorkspaceSettingModal";
import {
  getAllWorkspacesAPI,
  createWorkspaceAPI,
  getWorkspaceBoardsAPI,
} from "../services/WorkspaceAPI";
import {
  getRecentBoardsAPI,
  saveRecentBoardAPI,
} from "../services/RecentBoardAPI";
import CreateBoardModal from "./CreateBoardModal";
import { getBoardMembersAPI } from "../services/BoardMemberAPI";
import { logoutAPI } from "../services/LoginAPI";
import { Ping } from "../services/PingPoinAPI";
import "../components/css/home.css";

export default function Home() {
  const [boardsPersonal, setBoardsPersonal] = useState([]);
  const [boardsWorkspace, setBoardsWorkspace] = useState([]);
  const [recentBoards, setRecentBoards] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [boardMembers, setBoardMembers] = useState({});
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] =
    useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [showSettingModal, setShowSettingModal] = useState(false);
  const [selectedWorkspaceSetting, setSelectedWorkspaceSetting] =
    useState(null);
  const [showCreateBoardModal, setShowCreateBoardModal] = useState(false);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(null);
  const navigate = useNavigate();

  const fetchBoards = useCallback(async (currentUser, userWorkspaces = []) => {
    if (!currentUser) return [];

    try {
      const userUId = currentUser.userUId;

      const personalPromise = getBoardsAPI(userUId)
        .then((res) => (Array.isArray(res) ? res : []))
        .catch(() => {
          toast.error("Lỗi khi lấy danh sách bảng cá nhân");
          return [];
        });

      const workspacePromise = Promise.all(
        userWorkspaces.map((ws) =>
          getWorkspaceBoardsAPI(ws.workspaceUId, userUId)
            .then((res) => (Array.isArray(res) ? res : []))
            .catch(() => [])
        )
      )
        .then((arr) => arr.flat())
        .catch(() => {
          toast.error("Lỗi khi lấy danh sách bảng trong workspace");
          return [];
        });

      const recentPromise = getRecentBoardsAPI(userUId)
        .then((res) => (Array.isArray(res) ? res : []))
        .catch(() => {
          toast.error("Lỗi khi lấy danh sách bảng gần đây");
          return [];
        });

      const [personalBoards, workspaceBoards, recentBoardsData] =
        await Promise.all([personalPromise, workspacePromise, recentPromise]);

      setBoardsPersonal(personalBoards);
      setBoardsWorkspace(workspaceBoards);
      setRecentBoards(recentBoardsData);

      console.log("Boards loaded:", {
        personal: personalBoards.length,
        workspace: workspaceBoards.length,
        recent: recentBoardsData.length,
      });
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu boards:", err);
      setBoardsPersonal([]);
      setBoardsWorkspace([]);
      setRecentBoards([]);
    }
  }, []);

  const fetchWorkspaces = useCallback(async (currentUser) => {
    if (!currentUser) return [];

    try {
      const userUId = currentUser.userUId;
      const res = await getAllWorkspacesAPI(userUId);
      const workspacesData = Array.isArray(res) ? res : res.data || [];

      setWorkspaces(workspacesData);
      console.log("Workspaces loaded:", workspacesData.length);
      return workspacesData;
    } catch (err) {
      console.error("Lỗi khi tải workspaces:", err);
      setWorkspaces([]);
      return [];
    }
  }, []);

  const fetchBoardMembers = useCallback(async (boards) => {
    try {
      const membersData = {};
      await Promise.all(
        boards.map(async (board) => {
          try {
            const res = await getBoardMembersAPI(board.boardUId);
            membersData[board.boardUId] = Array.isArray(res) ? res : [];
          } catch (err) {
            console.error(
              `Lỗi khi lấy member cho board ${board.boardName}`,
              err
            );
            membersData[board.boardUId] = [];
          }
        })
      );
      setBoardMembers(membersData);
      console.log("👥 Board members loaded:", membersData);
    } catch (err) {
      console.error("Lỗi khi tải toàn bộ member:", err);
    }
  }, []);

  const refreshAllData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const userWorkspaces = await fetchWorkspaces(user);
    await fetchBoards(user, userWorkspaces);
    setLoading(false);
  }, [user, fetchBoards, fetchWorkspaces]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      window.location.href = "/";
      return;
    }
    setUser(storedUser);

    // Cải thiện: Không logout nếu chỉ là lỗi network/timeout thông thường
    (async () => {
      try {
        await Ping(); // Trigger refresh token nếu accessToken hết hạn
        const workspacesData = await fetchWorkspaces(storedUser);
        await fetchBoards(storedUser, workspacesData);
        setLoading(false);
      } catch (err) {
        console.error("Error during initial load:", err);
        console.log("Error details:", {
          status: err.response?.status,
          message: err.message,
          code: err.code,
        });
        // CHỈ LOGOUT KHI LÀ LỖI AUTHENTICATION (401/403)
        if (err.response?.status === 401 || err.response?.status === 403) {
          console.error("Authentication failed, logging out...");
          handleLogout();
        } else {
          // Các lỗi khác (network, timeout, 500...) vẫn cho phép dùng app
          console.warn("Non-auth error, keeping session active");
          setLoading(false);
        }
      }
    })();
  }, [fetchBoards, fetchWorkspaces]);

  const handleLogout = async () => {
    try {
      await logoutAPI(user.userUId); // gọi API xóa refreshToken cookie
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }
  };

  useEffect(() => {
    if (boardsWorkspace.length > 0) {
      fetchBoardMembers(boardsWorkspace);
    }
  }, [boardsWorkspace, fetchBoardMembers]);
  const handleCreateWorkspace = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get("name");
    const description = formData.get("description");

    if (!name?.trim() || !user) return;

    const creatorUserId = user.userUId;

    try {
      await createWorkspaceAPI(
        creatorUserId,
        name.trim(),
        description?.trim() || ""
      );
      toast.success("Tạo workspace thành công");
      await refreshAllData();
      setShowCreateWorkspaceModal(false);
    } catch (err) {
      console.error("Lỗi khi tạo workspace:", err);
      toast.error("Không thể tạo workspace");
    }
  };

  const handleCreateBoard = (workspaceId = null) => {
    setSelectedWorkspaceId(workspaceId);
    setShowCreateBoardModal(true);
  };

  const openDashboard = async (board) => {
    localStorage.setItem("currentBoard", JSON.stringify(board));
    try {
      await saveRecentBoardAPI(user.userUId, board.boardUId);
    } catch (err) {
      console.error("Lỗi khi lưu recent board:", err);
    }
    navigate("/dashboard");
  };

  const workspacesWithBoards = workspaces.map((ws) => ({
    ...ws,
    boards: boardsWorkspace.filter((b) => b.workspaceUId === ws.workspaceUId),
  }));

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 home">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          workspaces={workspacesWithBoards}
          onCreateWorkspace={() => setShowCreateWorkspaceModal(true)}
          onCreateBoard={handleCreateBoard}
          onSelectBoard={openDashboard}
        />

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-10">
            <RecentBoardsSection
              recentBoards={recentBoards}
              workspaces={workspaces}
              loading={loading}
              onSelectBoard={openDashboard}
              boardMembers={boardMembers}
            />

            <PersonalBoardSection
              boards={boardsPersonal}
              loading={loading}
              onCreateBoard={handleCreateBoard}
              onSelectBoard={openDashboard}
            />

            <WorkspaceSection
              workspaces={workspacesWithBoards}
              loading={loading}
              onCreateWorkspace={() => setShowCreateWorkspaceModal(true)}
              onCreateBoard={handleCreateBoard}
              onSelectBoard={openDashboard}
              onInviteUser={(ws) => {
                setSelectedWorkspace(ws);
                setShowInviteModal(true);
              }}
              onOpenSetting={(ws) => {
                setSelectedWorkspaceSetting(ws);
                setShowSettingModal(true);
              }}
              boardMembers={boardMembers}
            />
          </div>
        </main>

        <RightSidebar
          recentBoards={recentBoards}
          onCreateBoard={() => handleCreateBoard()}
          onSelectBoard={openDashboard}
        />
      </div>

      {showCreateWorkspaceModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget)
              setShowCreateWorkspaceModal(false);
          }}
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-5">
              Tạo Workspace mới
            </h2>

            <form onSubmit={handleCreateWorkspace} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên Workspace <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  autoFocus
                  placeholder="VD: Dev Team, Marketing Team..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả (tùy chọn)
                </label>
                <textarea
                  name="description"
                  rows="3"
                  placeholder="VD: Quản lý dự án phát triển sản phẩm"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition"
                ></textarea>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateWorkspaceModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition"
                >
                  Tạo Workspace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showInviteModal && selectedWorkspace && (
        <InviteUserModal
          workspace={selectedWorkspace}
          onClose={() => {
            setShowInviteModal(false);
            setSelectedWorkspace(null);
          }}
          currentUser={user}
          onSuccess={refreshAllData}
        />
      )}
      {showSettingModal && selectedWorkspaceSetting && (
        <WorkspaceSettingModal
          workspace={selectedWorkspaceSetting}
          currentUser={user}
          onClose={() => {
            setShowSettingModal(false);
            setSelectedWorkspaceSetting(null);
          }}
          onSuccess={refreshAllData}
        />
      )}
      {showCreateBoardModal && (
        <CreateBoardModal
          currentUser={user}
          workspaces={workspaces}
          defaultWorkspaceId={selectedWorkspaceId}
          onClose={() => setShowCreateBoardModal(false)}
          onSuccess={refreshAllData}
        />
      )}
    </div>
  );
}
