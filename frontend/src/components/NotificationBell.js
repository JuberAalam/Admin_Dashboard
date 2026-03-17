import { useState } from "react";
import { useNotifications } from "../hooks/useNotifications";
import API from "../services/api";

const NotificationBell = () => {
  const { notifications, setNotifications } = useNotifications();
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);

      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, read: true } : n)
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      
      {/* 🔔 Bell */}
      <div onClick={() => setOpen(!open)} style={{ cursor: "pointer" }}>
        🔔
        {unreadCount > 0 && (
          <span style={{
            position: "absolute",
            top: -5,
            right: -5,
            background: "red",
            color: "white",
            borderRadius: "50%",
            padding: "2px 6px",
            fontSize: "12px"
          }}>
            {unreadCount}
          </span>
        )}
      </div>

      {/* 📥 Dropdown */}
      {open && (
        <div style={{
          position: "absolute",
          right: 0,
          top: 40,
          width: 300,
          background: "#fff",
          borderRadius: 10,
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          maxHeight: 400,
          overflowY: "auto"
        }}>
          {notifications.length === 0 ? (
            <p style={{ padding: 10 }}>No notifications</p>
          ) : (
            notifications.map(n => (
              <div
                key={n._id}
                onClick={() => markAsRead(n._id)}
                style={{
                  padding: 10,
                  borderBottom: "1px solid #eee",
                  background: n.read ? "#fff" : "#f0f8ff",
                  cursor: "pointer"
                }}
              >
                <div>{n.message}</div>
                <small>{new Date(n.createdAt).toLocaleString()}</small>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;