// src/components/settings/SettingsSidebar.jsx
import React from "react";
import { UserCircle2, Cog, Activity, CreditCard, Palette } from "lucide-react";

const NAV = [
  { key: "profile",   label: "Profile and Visibility", icon: UserCircle2 },
  { key: "settings",  label: "Settings",               icon: Cog },
  { key: "activity",  label: "Activity",               icon: Activity },
  { key: "cards",     label: "Cards",                  icon: CreditCard },
  { key: "theme",     label: "Theme",                  icon: Palette },
];

export default function SettingsSidebar({ tab, onChange }) {
  return (
    <div className="
      h-full w-full md:w-[320px]
      border-r border-gray-200 dark:border-neutral-800
      bg-gray-50 dark:bg-neutral-950/40
      flex flex-col
    ">
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-600 dark:!text-gray-300">
          Personal Settings
        </h3>
      </div>

      <nav className="px-2 space-y-1 overflow-auto">
        {NAV.map(item => {
          const Icon = item.icon;
          const active = tab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onChange(item.key)}
              className={[
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left dark:!text-gray-300",
                active
                  ? "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200 dark:bg-blue-950/30 dark:!text-blue-300 dark:ring-blue-800/60"
                  : "hover:bg-gray-100 dark:hover:bg-neutral-800"
              ].join(" ")}
            >
              <Icon size={18} className={active ? "text-inherit" : "text-gray-500 dark:!text-gray-400"} />
              <span className="text-sm truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
