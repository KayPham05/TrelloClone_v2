import { useEffect, useRef, useState } from "react";
import { Bell, MessageSquareText, UserPlus, ArrowLeftRight, CalendarCheck2, AtSign, KanbanSquare } from "lucide-react";
import { getNotificationsAPI, markAsReadAPI, markAllAsReadAPI } from "../services/NotificationAPI";

// === utilities ===
const timeAgo = (iso) => {
    const s = Math.max(1, Math.floor((Date.now() - new Date(iso)) / 1000));
    if (s < 60) return `${s}s ago`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    return `${d}d ago`;
};

const TypeIcon = ({ type }) => {
    const map = {
        comment: MessageSquareText,
        assign: UserPlus,
        move: ArrowLeftRight,
        due: CalendarCheck2,
        mention: AtSign,
        board: KanbanSquare
    };
    const Icon = map[type] || MessageSquareText;
    return <Icon size={18} strokeWidth={2} className="text-gray-700" />;
};

// === component ===
export default function Notification() {
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const ref = useRef(null);

    const unread = items.reduce((n, i) => n + (i.read ? 0 : 1), 0);
    const user = JSON.parse(localStorage.getItem("user"));

    const fetchPage = async (p = 1) => {
        if (!user?.userUId) return;
        setLoading(true);
        try {
            const data = await getNotificationsAPI(user.userUId, p, 10);
            const list = Array.isArray(data) ? data : data.items || [];        
            setItems((prev) => (p === 1 ? list : [...prev, ...list]));
            setHasMore(list.length === 10);
            setPage(p);
            console.log("Fetched notifications:", list);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => { fetchPage(1); }, [user?.userUId]);

    useEffect(() => {
        const onClick = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, []);

    const onItemClick = async (n) => {
        if (!n.read) {
            await markAsReadAPI(n.notiId);
            setItems((prev) => prev.map((i) => (i.notiId === n.notiId ? { ...i, read: true } : i)));
        }
        if (n.link) window.location.href = n.link;
        setOpen(false);
    };

    const onMarkAll = async () => {
        await markAllAsReadAPI(user.userUId);
        setItems((prev) => prev.map((i) => ({ ...i, read: true })));
    };

    return (
        <div className="relative" ref={ref}>
            {/* Bell */}
            <button
                onClick={() => setOpen((v) => !v)}
                className="p-2 hover:bg-gray-100 rounded-lg transition relative"
                aria-label="Notifications"
            >
                <Bell className="text-gray-700" size={22} strokeWidth={2.4} />
                {unread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] min-w-4 h-4 px-1 rounded-full flex items-center justify-center font-bold">
                        {unread > 9 ? "9+" : unread}
                    </span>
                )}
            </button>

            {/* Popup */}
            {open && (
                <div className="absolute right-0 mt-2 w-96 bg-white border shadow-xl rounded-xl overflow-hidden z-50">
                    <div className="flex items-center justify-between px-3 py-2 bg-gray-50">
                        <div className="text-sm font-semibold">Notifications</div>
                        <button onClick={onMarkAll} className="text-xs text-blue-600 hover:underline">
                            Mark all as read
                        </button>
                    </div>

                    <div className="max-h-96 overflow-auto divide-y">
                        {!loading && items.length === 0 && (
                            <div className="p-4 text-sm text-gray-500">No notifications</div>
                        )}

                        {items.map((n) => (
                            <button
                                key={n.notiId}
                                onClick={() => onItemClick(n)}
                                className={`w-full text-left p-3 hover:bg-gray-50 transition flex gap-3 ${n.read ? "opacity-85" : "bg-blue-50/70"
                                    }`}
                            >
                                <TypeIcon type={n.type} />
                                <div className="min-w-0">
                                    <div className="text-sm font-semibold text-gray-800 truncate">{n.title}</div>
                                    <div className="text-xs text-gray-600 line-clamp-2">{n.message}</div>
                                    <div className="text-[11px] text-gray-400 mt-1">{timeAgo(n.createdAt)}</div>
                                </div>
                                {!n.read && <span className="ml-auto w-2 h-2 bg-blue-600 rounded-full self-center" />}
                            </button>
                        ))}

                        {hasMore && (
                            <button
                                onClick={() => fetchPage(page + 1)}
                                className="w-full py-2 text-sm text-blue-600 hover:bg-gray-50"
                            >
                                Load more
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
