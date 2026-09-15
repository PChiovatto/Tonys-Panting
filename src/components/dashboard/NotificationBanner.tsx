import { useState } from "react";
import {
  requestNotificationPermission,
  subscribeUserToPush,
} from "@/lib/pushNotifications";

interface Props {
  userId: string;
}

const NotificationBanner = ({ userId }: Props) => {
  const initial =
    typeof window !== "undefined" &&
    "Notification" in window &&
    Notification.permission !== "granted";
  const [visible, setVisible] = useState(initial);

  if (!visible) return null;

  const handleEnable = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      await subscribeUserToPush(userId);
      setVisible(false);
    }
  };

  return (
    <div
      className="notif-banner"
      style={{
        background: "#FAEEDA",
        borderBottom: "1px solid #F5D5A0",
        padding: "10px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        fontFamily: "'Montserrat', sans-serif",
        position: "sticky",
        top: 64,
        zIndex: 9,
        transition: "all 0.2s ease",
      }}
    >
      <style>{`
        @media (max-width: 767px) {
          .notif-banner { padding: 8px 16px !important; }
          .notif-banner-text { font-size: 12px !important; }
          .notif-banner-btn { padding: 4px 10px !important; font-size: 12px !important; }
        }
      `}</style>
      <span className="notif-banner-text" style={{ fontSize: 13, color: "#854F0B", fontWeight: 400 }}>
        Enable notifications to get alerted when new leads arrive.
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button
          className="notif-banner-btn"
          onClick={handleEnable}
          style={{
            background: "#854F0B",
            color: "#FFFFFF",
            padding: "6px 14px",
            borderRadius: 6,
            border: "none",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Enable
        </button>
        <button
          onClick={() => setVisible(false)}
          aria-label="Dismiss"
          style={{
            background: "transparent",
            border: "none",
            color: "#854F0B",
            cursor: "pointer",
            fontSize: 18,
            lineHeight: 1,
            padding: "0 4px",
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default NotificationBanner;
