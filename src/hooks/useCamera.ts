import { useCallback, useEffect, useState } from "react";
import { createCameraApi, deleteCameraApi, getCameras, updateCameraApi } from "../api/client";
import type { Camera, CreateCameraInput } from "../types/camera";

export default function useCamera() {
  const [cameras, setCameras] = useState<Camera[]>([]);

  useEffect(() => {
    let cancelled = false;

    getCameras()
      .then((data) => {
        if (!cancelled) setCameras(data);
      })
      .catch((err) => console.error("Không tải được danh sách camera:", err));

    return () => {
      cancelled = true;
    };
  }, []);

  const updateCamera = useCallback((id: number, data: Partial<Camera>) => {
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
  }, []);

  // Dùng khi nhận CameraUpdated từ SignalR: camera có thể là mới tạo (chưa
  // từng nằm trong danh sách đã fetch) hoặc đã tồn tại và cần cập nhật.
  const upsertCamera = useCallback((camera: Camera) => {
    setCameras((prev) => {
      const exists = prev.some((c) => c.id === camera.id);

      if (exists) {
        return prev.map((c) => (c.id === camera.id ? camera : c));
      }

      return [...prev, camera];
    });
  }, []);

  const removeCamera = useCallback((id: number) => {
    setCameras((prev) => prev.filter((camera) => camera.id !== id));
  }, []);

  const createCamera = useCallback(
    async (input: CreateCameraInput) => {
      const camera = await createCameraApi(input);
      upsertCamera(camera);
      return camera;
    },
    [upsertCamera],
  );

  const deleteCamera = useCallback(
    async (id: number) => {
      await deleteCameraApi(id);
      removeCamera(id);
    },
    [removeCamera],
  );

  // Gọi API thật để sửa camera (khác với updateCamera ở trên, chỉ vá state
  // cục bộ khi nhận sự kiện realtime từ SignalR).
  const editCamera = useCallback(
    async (id: number, data: Partial<Camera>) => {
      const camera = await updateCameraApi(id, data);
      upsertCamera(camera);
      return camera;
    },
    [upsertCamera],
  );

  return {
    cameras,
    updateCamera,
    upsertCamera,
    removeCamera,
    createCamera,
    deleteCamera,
    editCamera,
  };
}
