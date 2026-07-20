import { useState } from "react";
import { cameras as mockData } from "../data/cameras";
import type { Camera } from "../types/camera";

export default function useCamera() {
  const [cameras, setCameras] = useState<Camera[]>(mockData);

  const updateCamera = (id: number, data: Partial<Camera>) => {
    setCameras((prev) =>
      prev.map((camera) =>
        camera.id === id
          ? {
              ...camera,
              ...data,
            }
          : camera,
      ),
    );
  };

  return {
    cameras,
    updateCamera,
  };
}
