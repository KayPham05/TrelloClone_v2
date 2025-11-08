// src/components/settings/SettingsContent.jsx
import React, { useMemo, useState } from "react";

export default function SettingsContent({ tab, currentUser, onSaveProfile }) {
  if (tab === "profile") return <ProfileVisibility currentUser={currentUser} onSave={onSaveProfile} />;
  if (tab === "settings") return <Placeholder title="Settings" />;
  if (tab === "activity") return <Placeholder title="Activity" />;
  if (tab === "cards")    return <Placeholder title="Cards" />;
  if (tab === "theme")    return <Placeholder title="Theme" />;
  return null;
}

function Placeholder({ title }) {
  return (
    <div className="h-full flex flex-col">
      <Header title={title} subtitle="Bạn có thể tự triển khai nội dung tab này sau." />
      <div className="px-8 pb-8 overflow-auto">
        <div className="text-sm text-gray-600 dark:!text-gray-300">
          Khung layout đã sẵn sàng.
        </div>
      </div>
      <SaveBar disabled />
    </div>
  );
}

/* ================= Profile & Visibility ================= */

function ProfileVisibility({ currentUser, onSave }) {
  const init = useMemo(() => ({
    username: currentUser?.username || "",
    email: currentUser?.email || "",
    bio: currentUser?.bio || "",
    visibility: {
      username: "public",
      email:    "private",
      bio:      "public",
    }
  }), [currentUser]);

  const [form, setForm] = useState(init);
  React.useEffect(() => { setForm(init); }, [init]);
  const [saving, setSaving] = useState(false);
  const dirty = JSON.stringify(form) !== JSON.stringify(init);

  const onField = (k, v) => setForm(s => ({ ...s, [k]: v }));
  const onVis   = (k, v) => setForm(s => ({ ...s, visibility: { ...s.visibility, [k]: v }}));

  const handleSave = async () => {
    if (!dirty || saving) return;
    setSaving(true);
    try { await onSave?.(form); } finally { setSaving(false); }
  };

  return (
    <div className="h-full flex flex-col dark:!text-gray-300">
      <Header
        title="Profile and Visibility"
        subtitle="Quản lý thông tin cá nhân và mức độ hiển thị."
      />

      <div className="px-8 pb-28 overflow-auto space-y-6">
        {/* Info banner */}
        <div className="rounded-xl border border-gray-200 dark:border-neutral-800 overflow-hidden">
          <div className="bg-gray-50 dark:bg-neutral-950/40 px-5 py-4">
            <h3 className="font-semibold dark:!text-gray-300 dark:font-bold">Manage your personal information</h3>
            <p className="text-sm text-gray-600 dark:!text-gray-300">
              Đây là tài khoản Trello clone. Bạn có thể chỉnh sửa thông tin và quyền hiển thị ngay bên dưới.
            </p>
          </div>
          {/* Form grid */}
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Username */}
            <Field label="Username">
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2
                           border-gray-300 dark:border-neutral-700
                           bg-white dark:bg-neutral-900 focus:outline-none
                           focus:ring-2 focus:ring-blue-500/50"
                value={form.username}
                onChange={e => onField("username", e.target.value)}
                placeholder="your_name"
              />
              <VisPicker value={form.visibility.username} onChange={v => onVis("username", v)} />
            </Field>

            {/* Email (read-only) */}
            <Field label="Email">
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2
                           border-gray-300 dark:border-neutral-700
                           bg-gray-50 dark:bg-neutral-800/50 text-gray-700 dark:!text-gray-200"
                value={form.email}
                readOnly
              />
              <VisPicker value={form.visibility.email} onChange={v => onVis("email", v)} />
            </Field>

            {/* Bio */}
            <Field label="Bio" className="md:col-span-2">
              <textarea
                rows={6}
                className="mt-1 w-full rounded-lg border px-3 py-2
                           border-gray-300 dark:border-neutral-700
                           bg-white dark:bg-neutral-900 focus:outline-none
                           focus:ring-2 focus:ring-blue-500/50"
                value={form.bio}
                onChange={e => onField("bio", e.target.value)}
                placeholder="Tell people a bit about you…"
              />
              <VisPicker value={form.visibility.bio} onChange={v => onVis("bio", v)} />
            </Field>
          </div>
        </div>
      </div>

      {/* Sticky Save bar */}
      <SaveBar
        disabled={!dirty || saving}
        saving={saving}
        onSave={handleSave}
      />
    </div>
  );
}

/* ================= Small Pieces ================= */

function Header({ title, subtitle }) {
  return (
    <div className="px-8 pt-8 pb-4">
      <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
      {subtitle && (
        <p className="text-sm text-gray-600 dark:!text-gray-300 mt-1">{subtitle}</p>
      )}
    </div>
  );
}

function Field({ label, children, className = "" }) {
  return (
    <div className={className}>
      <label className="text-sm font-medium dark:!text-gray-300 dark:font-bold">{label}</label>
      {children}
    </div>
  );
}

function VisPicker({ value, onChange }) {
  const Opt = ({ v, label }) => (
    <button
      type="button"
      onClick={() => onChange(v)}
      className={[
        "mt-2 text-xs px-2 py-1 rounded-md border transition",
        value === v
          ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:!text-blue-300 dark:border-blue-900/60"
          : "text-gray-600 dark:!text-gray-300 border-gray-300 dark:border-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-800"
      ].join(" ")}
    >
      {label}
    </button>
  );
  return (
    <div className="flex items-center gap-2">
      <span className="mt-2 text-xs text-gray-500 dark:!text-gray-300">Visibility:</span>
      <Opt v="public" label="Public" />
      <Opt v="workspace" label="Workspace" />
      <Opt v="private" label="Private" />
    </div>
  );
}

function SaveBar({ disabled = true, saving = false, onSave }) {
  return (
    <div className="
      sticky bottom-0 w-full border-t
      border-gray-200 dark:border-neutral-800
      bg-white/85 dark:bg-neutral-900/85 backdrop-blur
      px-8 py-3
    ">
      <button
        onClick={onSave}
        disabled={disabled}
        className={[
          "px-4 py-2 rounded-lg text-white transition",
          !disabled ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed dark:!text-gray-600" 
        ].join(" ")}
      >
        {saving ? "Saving…" : "Save"}
      </button>
    </div>
  );
}
