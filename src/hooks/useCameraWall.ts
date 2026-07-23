import { useState } from "react";

import type { Camera } from "../types/camera";

export default function useCameraWall() {
  const [selectedCameras, setSelectedCameras] = useState<Camera[]>([]);

  const addCamera = (camera: Camera) => {
    setSelectedCameras((prev) => {
      const exists = prev.some((item) => item.id === camera.id);

      if (exists) return prev;

      return [...prev, camera];
    });
  };

  const removeCamera = (id: number) => {
    setSelectedCameras((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCamera = () => {
    setSelectedCameras([]);
  };

  // Thay toàn bộ danh sách — dùng khi mở 1 Favorite View đã lưu.
  const loadCameras = (cameras: Camera[]) => {
    setSelectedCameras(cameras);
  };

  return {
    selectedCameras,

    addCamera,

    removeCamera,

    clearCamera,

    loadCameras,
  };
}
