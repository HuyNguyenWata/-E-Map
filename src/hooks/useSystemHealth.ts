import { useEffect, useState } from "react";
import { getSystemHealth } from "../api/client";
import { createCameraHubConnection } from "../api/realtime";
import type { SystemHealth } from "../types/systemHealth";

export default function useSystemHealth() {
  const [health, setHealth] = useState<SystemHealth | null>(null);

  useEffect(() => {
    let cancelled = false;

    getSystemHealth()
      .then((data) => {
        if (!cancelled) setHealth(data);
      })
      .catch(() => {
        // Chưa có dữ liệu ngay sau khi server khởi động — bỏ qua, SignalR sẽ
        // đẩy dữ liệu đầu tiên vào sau vài giây.
      });

    const connection = createCameraHubConnection({
      onSystemHealthUpdated: (data) => setHealth(data),
    });

    connection.start().catch((err) => {
      // Trong React StrictMode (dev), effect chạy mount -> unmount -> mount lại,
      // khiến lần start() đầu tiên bị stop() giữa chừng — bỏ qua lỗi này.
      const message = String(err?.message ?? err);
      if (
        err?.name === "AbortError" ||
        message.includes("stopped during negotiation") ||
        message.includes("before stop() was called")
      ) {
        return;
      }
      console.error("Lỗi kết nối SignalR (system health):", err);
    });

    return () => {
      cancelled = true;
      connection.stop();
    };
  }, []);

  return { health };
}
