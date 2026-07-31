import { useEffect, useRef, useState } from "react";

import { createCameraHubConnection } from "../api/realtime";
import { getAlerts, resolveAlert } from "../api/client";

import type { Camera } from "../types/camera";

import type { CameraAlert } from "../types/alert";
import type { VehicleBox } from "../types/behavior";

export default function useCameraRealtime(
  _cameras: Camera[],
  updateCamera: (id: number, data: Partial<Camera>) => void,
  upsertCamera: (camera: Camera) => void,
) {
  const [alerts, setAlerts] = useState<CameraAlert[]>([]);
  const alertClearTimers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  // Chỉ giữ khung phương tiện của camera đang xem gần nhất mỗi camera — dữ
  // liệu này chỉ để vẽ live, không có ý nghĩa lưu lịch sử (xem VehicleBoxDto
  // phía backend), nên không cần giới hạn số lượng như alerts.
  const [vehiclesByCamera, setVehiclesByCamera] = useState<Record<number, VehicleBox[]>>({});
  // Nếu 1 camera ngừng nhận cập nhật (service quá tải/bỏ nhịp lấy mẫu) thì
  // khung xe cũ phải TỰ BIẾN MẤT thay vì đứng hình mãi ở vị trí xe đã đi mất
  // từ lâu — đã gặp thật: máy quá tải, khung xe "dính" sai vị trí trông như
  // tính năng bị lỗi. 12s = hơn gấp đôi nhịp lấy mẫu 5s, đủ chịu được 1-2 lần
  // lỡ nhịp mà không xoá khung quá sớm.
  const vehicleClearTimers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  useEffect(() => {
    let cancelled = false;

    // Nạp các alert đang active từ trước khi trang được mở (vd. sau khi
    // refresh), tránh dashboard hiển thị sai số liệu do chỉ dựa vào sự kiện
    // nhận được trong phiên hiện tại.
    getAlerts()
      .then((initialAlerts) => {
        if (!cancelled) setAlerts(initialAlerts);
      })
      .catch((err) => console.error("Không tải được lịch sử alert:", err));

    const clearTimers = alertClearTimers.current;
    const vehicleTimers = vehicleClearTimers.current;
    const VEHICLE_STALE_MS = 12000;

    const connection = createCameraHubConnection({
      onCameraUpdated: (camera) => {
        upsertCamera(camera);
      },

      onAlertCreated: (alert) => {
        setAlerts((prev) => [alert, ...prev].slice(0, 50));

        // Cảnh báo tự hết hiệu lực trên bản đồ sau 10s để marker không bị
        // kẹt đỏ vĩnh viễn khi camera đã hết sự kiện.
        const existingTimer = clearTimers.get(alert.cameraId);

        if (existingTimer) {
          clearTimeout(existingTimer);
        }

        clearTimers.set(
          alert.cameraId,
          setTimeout(() => {
            updateCamera(alert.cameraId, { alert: undefined });
            resolveAlert(alert.id).catch((err) =>
              console.error("Không resolve được alert:", err),
            );
            clearTimers.delete(alert.cameraId);
          }, 10000),
        );
      },

      onVehiclesDetected: (detection) => {
        setVehiclesByCamera((prev) => ({ ...prev, [detection.cameraId]: detection.vehicles }));

        const existingTimer = vehicleTimers.get(detection.cameraId);
        if (existingTimer) clearTimeout(existingTimer);

        vehicleTimers.set(
          detection.cameraId,
          setTimeout(() => {
            setVehiclesByCamera((prev) => ({ ...prev, [detection.cameraId]: [] }));
            vehicleTimers.delete(detection.cameraId);
          }, VEHICLE_STALE_MS),
        );
      },
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
      console.error("Lỗi kết nối SignalR:", err);
    });

    return () => {
      cancelled = true;
      connection.stop();
      clearTimers.forEach((timeoutId) => clearTimeout(timeoutId));
      clearTimers.clear();
      vehicleTimers.forEach((timeoutId) => clearTimeout(timeoutId));
      vehicleTimers.clear();
    };
  }, [updateCamera, upsertCamera]);

  return {
    alerts,
    vehiclesByCamera,
  };
}
