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

  return {
    selectedCameras,

    addCamera,

    removeCamera,

    clearCamera,
  };
}
