import React, { useEffect, useState } from 'react';
import { getActivitiesAPI } from '../services/ActivityAPI';
import './css/Activity.css';

const ActivityList = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [error, setError] = useState(null);
  const LIMIT = 10;

  useEffect(() => {
    loadActivities(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Parse date strings that may not include timezone.
  // If dateString already contains timezone (Z or +hh:mm/-hh:mm), parse normally.
  // If it has no timezone (e.g. "2025-11-13T10:00:00"), treat it as UTC+7 by appending "+07:00".
  const parseDateAsUTC7 = (dateString) => {
    if (!dateString) return null;
    try {
      // if ends with Z or has explicit offset like +07:00 or -05:00 -> use directly
      if (/[zZ]$|[+\-]\d{2}:\d{2}$/.test(dateString)) return new Date(dateString);
      // otherwise append +07:00 so the timestamp is interpreted as UTC+7
      if (dateString.includes('T')) {
        return new Date(dateString + '+07:00');
      }
      // fallback
      return new Date(dateString);
    } catch {
      return new Date(dateString);
    }
  };

  const loadActivities = async (loadMore = false) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.userUId) {
      setError('User not found. Please login.');
      return;
    }

    try {
      setError(null);
      setLoading(true);

      const currentOffset = loadMore ? offset : 0;
      const payload = await getActivitiesAPI(user.userUId, LIMIT, currentOffset);

      const items = Array.isArray(payload?.data) ? payload.data : [];
      if (loadMore) setActivities((p) => [...p, ...items]);
      else setActivities(items);

      setOffset(currentOffset + LIMIT);
      setHasMore(Boolean(payload?.pagination?.hasMore));
    } catch (err) {
      console.error('Error loading activities:', err);
      setError(err?.message || 'Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) loadActivities(true);
  };

  const formatTimeAgo = (dateString) => {
    const date = parseDateAsUTC7(dateString);
    if (!date || isNaN(date.getTime())) return '';
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    if (seconds < 60) return 'vừa xong';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} phút trước`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} ngày trước`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks} tuần trước`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} tháng trước`;
    const years = Math.floor(days / 365);
    return `${years} năm trước`;
  };

  const formatAbsoluteInUTC7 = (dateString) => {
    const date = parseDateAsUTC7(dateString);
    if (!date || isNaN(date.getTime())) return '';
    try {
      return date.toLocaleString('vi-VN', {
        timeZone: 'Asia/Bangkok',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return date.toString();
    }
  };

  if (loading && activities.length === 0) return <div style={{ padding: 20 }}>⏳ Đang tải...</div>;

  if (error)
    return (
      <div style={{ padding: 20, color: 'red' }}>
        <p>❌ {error}</p>
        <button onClick={() => loadActivities(false)}>🔄 Thử lại</button>
      </div>
    );

  if (activities.length === 0) return <div style={{ padding: 20 }}>📭 Chưa có hoạt động</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>🕓 Lịch sử hoạt động ({activities.length})</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {activities.map((activity, i) => (
          <li
            key={activity.activityUId || i}
            style={{
              padding: 12,
              marginBottom: 8,
              background: '#f8f9fa',
              borderRadius: 8,
              borderLeft: '4px solid #0052cc',
            }}
          >
            <div>
              <strong style={{ color: '#0052cc' }}>
                {activity.user?.name || activity.user?.userName || activity.userName || 'Unknown'}
              </strong>
              {': '}
              {activity.action}
            </div>
            <div style={{ fontSize: '0.85em', color: '#666', marginTop: 4 }}>
              ⏰ {formatTimeAgo(activity.createdAt)} — {formatAbsoluteInUTC7(activity.createdAt)}
            </div>
          </li>
        ))}
      </ul>

      {hasMore && (
        <div style={{ marginTop: 12 }}>
          <button onClick={handleLoadMore} disabled={loading}>
            {loading ? 'Đang tải...' : 'Tải thêm'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivityList;