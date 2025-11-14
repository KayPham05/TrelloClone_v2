import React, { useState } from "react";
import Split from "react-split";
import { DragDropContext } from "@hello-pangea/dnd";
import Inbox from "./inbox-component";
import Board from "./Board";
import {
  Inbox as InboxIcon,
  LayoutGrid,
  Info,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import "./css/layout.css";
import { updateCardListAPI } from "../services/todoApi";

export default function Layout() {
  const [showInbox, setShowInbox] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeTab, setActiveTab] = useState("inbox");
  const [refresh, setRefresh] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user?.userUId);
  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    try {
      let newListUId = null;

      if (
        source.droppableId === "inbox" &&
        destination.droppableId.startsWith("list-")
      ) {
        newListUId = destination.droppableId.replace("list-", "");
      } else if (
        source.droppableId.startsWith("list-") &&
        destination.droppableId.startsWith("list-")
      ) {
        newListUId = destination.droppableId.replace("list-", "");
      } else if (
        source.droppableId.startsWith("list-") &&
        destination.droppableId === "inbox"
      );
      console.log("Update card:", draggableId, "→List:", newListUId);
      await updateCardListAPI(draggableId, newListUId, user.userUId);
      // Kích hoạt reload dữ liệu UI
      setRefresh((r) => !r);
    } catch (err) {
      console.error("Lỗi khi cập nhật list cho card:", err);
    }
  };

  // 🔹 Toggle Inbox hiển thị
  const toggleInbox = () => {
    if (showInbox) {
      setIsAnimating(true);
      setTimeout(() => {
        setShowInbox(false);
        setIsAnimating(false);
      }, 350);
    } else {
      setShowInbox(true);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 350);
    }
  };

  return (
  <DragDropContext onDragEnd={handleDragEnd}>
    <div className="fixed top-[64px] left-0 right-0 bottom-0 w-full overflow-hidden">

      <div className="h-full w-full dark:bg-[#2B2D31]">

        {showInbox ? (
          <Split
            className="flex h-full dark:bg-[#1E1F22]"
            sizes={[25, 75]}
            minSize={[0, 400]}
            gutterSize={8}
            onDragEnd={(newSizes) => {
              if (newSizes[0] <= 10) {
                setIsAnimating(true);
                setTimeout(() => {
                  setShowInbox(false);
                  setIsAnimating(false);
                }, 400);
              }
            }}
          >

            {/* LEFT – Inbox */}
            <div
              className={`
                h-full overflow-y-auto rounded-tr-xl transition-all
                bg-[#0D1B2A] 
                dark:bg-[#1E1F22] 
                ${isAnimating ? "animate-slideOutLeft" : "animate-slideInLeft"}
              `}
            >
              <Inbox refresh={refresh} setRefresh={setRefresh} />
            </div>

            {/* RIGHT – Board */}
            <div
              className="
                flex-1 overflow-y-auto rounded-tl-xl 
                bg-gradient-to-br from-[#46237A] to-[#7A1E6E] 
                dark:from-[#1E1F22] dark:to-[#2B2D31]
              "
            >
              <Board refresh={refresh} setRefresh={setRefresh} />
            </div>

          </Split>
        ) : (
          // Khi Inbox bị collapse hoàn toàn
          <div
            className="
              h-full w-full overflow-y-auto rounded-tl-xl
              bg-gradient-to-br from-purple-700 to-purple-500
              dark:from-[#1E1F22] dark:to-[#2B2D31]
            "
          >
            <Board refresh={refresh} setRefresh={setRefresh} />
          </div>
        )}


        {/* Bottom Toolbar */}
        <div
          className="
            absolute bottom-0 left-0 w-full
            flex items-center justify-center
            bg-[#0b1320]/80 backdrop-blur-md text-sm text-gray-200
            border-t border-gray-700
            dark:bg-[#1E1F22]/80 dark:border-[#3F4147]
          "
        >
          <div className="flex items-center gap-3 px-4 py-2">

            {/* Inbox Button */}
            <button
              className={[
                "flex items-center gap-1 px-3 py-2 rounded-lg transition-all",
                activeTab === "inbox"
                  ? "bg-indigo-600 text-white dark:bg-[#8AB4F8] dark:text-[#1E1F22]"
                  : "hover:bg-[#1d2945] dark:hover:bg-[#3A3C42]"
              ].join(" ")}
              onClick={() => {
                toggleInbox();
                setActiveTab("inbox");
              }}
            >
              <InboxIcon size={16} />
              <span className="dark:text-[#E8EAED]">Inbox</span>
              {showInbox ? (
                <ChevronDown size={14} className="ml-1" />
              ) : (
                <ChevronUp size={14} className="ml-1" />
              )}
            </button>

            {/* Planner Button */}
            <button
              className={[
                "flex items-center gap-1 px-3 py-2 rounded-lg transition-all",
                activeTab === "plan"
                  ? "bg-indigo-600 text-white dark:bg-[#8AB4F8] dark:text-[#1E1F22]"
                  : "hover:bg-[#1d2945] dark:hover:bg-[#3A3C42]"
              ].join(" ")}
              onClick={() => setActiveTab("plan")}
            >
              <LayoutGrid size={16} />
              <span className="dark:text-[#E8EAED]">Project Planner</span>
            </button>

            {/* Info Button */}
            <button
              className={[
                "flex items-center gap-1 px-3 py-2 rounded-lg transition-all",
                activeTab === "info"
                  ? "bg-indigo-600 text-white dark:bg-[#8AB4F8] dark:text-[#1E1F22]"
                  : "hover:bg-[#1d2945] dark:hover:bg-[#3A3C42]"
              ].join(" ")}
              onClick={() => setActiveTab("info")}
            >
              <Info size={16} />
              <span className="dark:text-[#E8EAED]">Information board</span>
            </button>

          </div>
        </div>

      </div>
    </div>
  </DragDropContext>
);

}
