import React from "react";
import { Bell, Search, UserCircle, Grid3x3, Plus } from "lucide-react";
import Profile from "./AccountMenu";
import PersonalSettings from "./PersonalSetting";
import Notification from "../components/Notification.jsx";

export default function Header({ className = "" }) {
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const profileWrapRef = React.useRef(null);


  React.useEffect(() => {
  const onDocPointer = e => {
    // 1) Nếu click nằm trong bất kỳ node có data-profile-keepopen thì bỏ qua
    const path = (e.composedPath && e.composedPath()) || [];
    if (path.some(el => el && el.dataset && el.dataset.profileKeepopen !== undefined)) {
      return;
    }

    // 2) Nếu click không nằm trong wrap của profile thì mới đóng
    if (!profileWrapRef.current) return;
    if (!profileWrapRef.current.contains(e.target)) {
      setIsProfileOpen(false);
    }
  };

  const onKey = e => {
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
    try { return JSON.parse(localStorage.getItem("user") || "null"); }
    catch { return null; }
  }, []);


  return (
  <>
    <header
      className={[
        "flex items-center justify-between px-6 border-b shadow-sm bg-white",
        "dark:bg-[#2B2D31] dark:border-[#3F4147]",
        className
      ].join(" ")}
    >
      {/* Logo & Brand */}
      <div className="flex items-center gap-4">
        <Grid3x3
          className="text-gray-600 dark:text-[#E8EAED] cursor-pointer hover:text-gray-800 dark:hover:text-white transition"
          size={20}
        />

        <div className="flex items-center gap-2">
          <div className="
            w-8 h-8 
            bg-gradient-to-br from-blue-600 to-blue-700 
            dark:from-blue-500 dark:to-blue-600
            rounded flex items-center justify-center shadow-md
          ">
            <span className="text-white font-bold text-sm">▤</span>
          </div>

          <span className="text-xl font-bold text-gray-800 dark:text-[#E8EAED]">
            Trello
          </span>
        </div>
      </div>

      {/* Search & Actions */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div
          className={[
            "flex items-center rounded-lg px-4 py-2 w-96 transition",
            "bg-gray-100 hover:bg-gray-200",
            "dark:bg-[#1E1F22] dark:hover:bg-[#3A3C42]"
          ].join(" ")}
        >
          <Search className="text-gray-500 dark:text-[#9AA0A6]" size={18} />
          <input
            type="text"
            placeholder="Search Boards, Members..."
            className="
              bg-transparent border-none outline-none text-sm w-full px-3
              text-gray-700 placeholder:text-gray-500
              dark:text-[#E8EAED] dark:placeholder:text-[#9AA0A6]
            "
          />
        </div>

        {/* Create Button */}
        <button className="
          flex items-center gap-2 
          bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 
          rounded-lg text-sm font-medium transition shadow-sm
          dark:bg-blue-500 dark:hover:bg-blue-600
        ">
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
            onClick={() => setIsProfileOpen(v => !v)}
            className="
              p-2 rounded-lg transition 
              hover:bg-gray-100 dark:hover:bg-[#3A3C42]
            "
          >
            <UserCircle className="text-gray-600 dark:text-[#E8EAED]" size={28} />
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
        console.log("SAVE PROFILE", payload);
      }}
    />
  </>
);

  
}