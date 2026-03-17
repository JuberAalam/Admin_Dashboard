import { useEffect, useState } from "react";
import socket from "../socket";
import API from "../services/api";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  // Load existing notifications
  useEffect(() => {
    API.get("/notifications")
      .then((res) => setNotifications(res.data))
      .catch((err) => console.log(err));
  }, []);

  // Listen to live events
  useEffect(() => {
    socket.on("notification", (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => socket.off("notification");
  }, []);

  return { notifications, setNotifications };
};