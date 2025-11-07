import React from "react";
import { Bell, Search, UserCircle, Grid3x3, Plus } from "lucide-react";

export default function Header({ className = "" }) {
  return (
    <header className={`flex items-center justify-between px-6  bg-white border-b shadow-sm ${className}`}>
      {/* Logo & Brand */}
      <div className="flex items-center gap-4">
        <Grid3x3 
          className="text-gray-600 cursor-pointer hover:text-gray-800 transition" 
          size={20} 
        />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-sm">▤</span>
          </div>
          <span className="text-xl font-bold text-gray-800">Trello</span>
        </div>
      </div>

      {/* Search & Actions */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2 w-96 hover:bg-gray-200 transition">
          <Search className="text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm bảng, thành viên..."
            className="bg-transparent border-none outline-none text-sm w-full px-3 text-gray-700 placeholder:text-gray-500"
          />
        </div>

        {/* Create Button */}
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm">
          <Plus size={16} />
          Tạo mới
        </button>

        {/* User Actions */}
        <div className="flex items-center gap-3">
          {/* Notification */}
          <button className="p-2 hover:bg-gray-100 rounded-lg transition relative">
            <Bell className="text-gray-600" size={22} />
            <span className="absolute top-1 right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
              3
            </span>
          </button>

          {/* User Profile */}
          <button className="p-2 hover:bg-gray-100 rounded-lg transition">
            <UserCircle className="text-gray-600" size={28} />
          </button>
        </div>
      </div>
    </header>
  );
}