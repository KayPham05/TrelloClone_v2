// src/components/settings/PersonalSettings.jsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import SettingsSidebar from "./SettingsSidebar.jsx";
import SettingsContent from "./SettingsContent.jsx";
import {
  getUsernameByUserUIdAPI,
  getBioByUserUIdAPI,
  addBioByUserUIdAPI,
  addUsernameByUserUIdAPI,
} from "../services/UserAPI.jsx";

export default function PersonalSettings({
  open,
  initialTab = "profile",
  onClose,
  currentUser: currentUserProp, // có thể truyền từ cha, nếu không có sẽ tự load
}) {
  const [tab, setTab] = useState(initialTab);
  const [currentUser, setCurrentUser] = useState(currentUserProp || null);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => { if (open) setTab(initialTab); }, [open, initialTab]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Load profile từ DB bằng userUId trong localStorage
  useEffect(() => {
    if (!open) return;

    // nếu cha đã cấp currentUser thì dùng luôn
    if (currentUserProp) { setCurrentUser(currentUserProp); return; }

    const userLocal = JSON.parse(localStorage.getItem("user"));
    const userUId = userLocal?.userUId;
    const email = userLocal?.email || "";
    if (!userUId) return;

    (async () => {
      try {
        setLoading(true);
        const [uRes, bRes] = await Promise.all([
          getUsernameByUserUIdAPI(userUId),
          getBioByUserUIdAPI(userUId),
        ]);

        const username = uRes?.data?.username ?? "";
        const bio = bRes?.data?.bio ?? "";

        setCurrentUser({ username, email, bio });
      } catch (e) {
        console.error("Load profile failed:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [open, currentUserProp]);

  // Lưu xuống DB: ADD Username + ADD Bio
  const handleSaveProfile = useCallback(async (form) => {
    const userLocal = JSON.parse(localStorage.getItem("user"));
    const userUId = userLocal?.userUId;
    if (!userUId) return;

    await Promise.all([
      addUsernameByUserUIdAPI(userUId, form.username),
      addBioByUserUIdAPI(userUId, form.bio),
    ]);

    // cập nhật state để reset dirty ở SettingsContent
    setCurrentUser((prev) => ({
      ...(prev || {}),
      username: form.username,
      bio: form.bio,
      email: prev?.email ?? form.email ?? "",
    }));
  }, []);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" onClick={onClose} />

      {/* Wrapper */}
      <div className="relative h-full w-full flex justify-center items-start p-4 md:p-6">
        {/* Panel */}
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          className="
            relative w-full max-w-[1280px]
            h-[calc(100vh-2rem)] md:h-[calc(100vh-3rem)]
            bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100
            rounded-2xl shadow-2xl overflow-hidden
            grid grid-cols-12
            border border-gray-200 dark:border-neutral-800
          "
        >
          {/* Sidebar */}
          <aside className="col-span-12 md:col-span-3 lg:col-span-3 h-full">
            <SettingsSidebar tab={tab} onChange={setTab} />
          </aside>

          {/* Content */}
          <section className="col-span-12 md:col-span-9 lg:col-span-9 h-full overflow-hidden">
            <SettingsContent
              tab={tab}
              currentUser={currentUser}
              onClose={onClose}
              onSaveProfile={handleSaveProfile}
            />
          </section>

          {/* Close */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
