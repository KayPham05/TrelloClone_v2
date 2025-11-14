import React from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Search, UserCircle, Grid3x3, Plus } from "lucide-react";
import Profile from "./AccountMenu";
import PersonalSettings from "./PersonalSetting";
import Notification from "../components/Notification.jsx";

export default function Header({ className = "" }) {
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const profileWrapRef = React.useRef(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const onDocPointer = (e) => {
      // 1) Nếu click nằm trong bất kỳ node có data-profile-keepopen thì bỏ qua
      const path = (e.composedPath && e.composedPath()) || [];
      if (
        path.some(
          (el) => el && el.dataset && el.dataset.profileKeepopen !== undefined
        )
      ) {
        return;
      }

      // 2) Nếu click không nằm trong wrap của profile thì mới đóng
      if (!profileWrapRef.current) return;
      if (!profileWrapRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };

    const onKey = (e) => {
      if (e.key === "Escape") setIsProfileOpen(false);
    };

    // dùng pointerdown ổn hơn mousedown/click cho case menu
    document.addEventListener("pointerdown", onDocPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDocPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const user = React.useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  return (
    <>
      <header
        className={`flex items-center justify-between px-6  bg-white border-b shadow-sm ${className}`}
      >
        {/* Logo & Brand */}
        <div
          onClick={() => navigate("/home")}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          {/* Logo icon */}
          <div
            className="
                        w-9 h-9 rounded-xl 
                        bg-gradient-to-br from-indigo-500 to-purple-600 
                        shadow-[0_2px_8px_rgba(0,0,0,0.25)] 
                        flex items-center justify-center
                        group-hover:scale-110 transition-transform
                      "
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <rect x="3" y="3" width="8" height="18" rx="2" opacity="0.9" />
              <rect x="13" y="3" width="8" height="10" rx="2" opacity="0.9" />
            </svg>
          </div>

          {/* Logo text */}
          <span
            className="
                        text-2xl font-extrabold tracking-wide
                        bg-gradient-to-r from-blue-400 via-blue-400 to-red-400
                        bg-clip-text text-transparent
                        group-hover:tracking-wider transition-all
                      "
          >
            Trello
          </span>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2 w-96 hover:bg-gray-200 transition">
            <Search className="text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search Boards, Members..."
              className="bg-transparent border-none outline-none text-sm w-full px-3 text-gray-700 placeholder:text-gray-500"
            />
          </div>

          {/* Create Button */}
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm">
            <Plus size={16} />
            Create New
          </button>

          {/* User Actions */}
          <div className="flex items-center gap-3" ref={profileWrapRef}>
            {/* Notification */}
            <Notification />

            {/* User Profile */}
            <button
              aria-haspopup="menu"
              aria-expanded={isProfileOpen}
              onClick={() => setIsProfileOpen((v) => !v)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <UserCircle className="text-gray-600" size={28} />
            </button>
            <Profile
              open={isProfileOpen}
              onClose={() => setIsProfileOpen(false)}
              onOpenSettings={() => {
                setSettingsOpen(true);
                setIsProfileOpen(false);
              }}
            />
          </div>
        </div>
      </header>
      <PersonalSettings
        open={settingsOpen}
        initialTab="profile"
        onClose={() => setSettingsOpen(false)}
        currentUser={{
          userName: user?.userName ?? "",
          email: user?.email ?? "",
          bio: user?.bio ?? "",
        }}
        onSaveProfile={async (payload) => {
          // TODO: call API .NET 9 lưu profile
          // await fetch('/api/profile', { method: 'PUT', headers: {...}, body: JSON.stringify(payload) })
          console.log("SAVE PROFILE", payload);
        }}
      />
    </>
  );
}
