import { useEffect, useState } from "react";

import type { Camera } from "../types/camera";

import type { CameraAlert, AlertType, AlertSeverity } from "../types/alert";

const alertTypes: AlertType[] = [
  "fire",

  "smoke",

  "person",

  "vehicle",

  "offline",
];

function randomItem<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomSeverity(): AlertSeverity {
  const values: AlertSeverity[] = ["info", "warning", "critical"];

  return randomItem(values);
}

export default function useCameraRealtime(
  cameras: Camera[],

  updateCamera: (id: number, data: Partial<Camera>) => void,
) {
  const [alerts, setAlerts] = useState<CameraAlert[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!cameras.length) return;

      const camera = randomItem(cameras);

      const isOffline = Math.random() < 0.15;

      const signal = isOffline ? 0 : Math.floor(70 + Math.random() * 30);

      const now = new Date().toLocaleTimeString();

      updateCamera(
        camera.id,

        {
          status: isOffline ? "offline" : "online",

          signal,

          lastSeen: now,
        },
      );

      // 40% có event

      if (Math.random() < 0.4) {
        const type = randomItem(alertTypes);

        const severity = randomSeverity();

        updateCamera(
          camera.id,

          {
            alert: {
              type,

              severity,
            },
          },
        );

        setAlerts((prev) =>
          [
            {
              id: Date.now(),

              cameraId: camera.id,

              cameraName: camera.name,

              type,

              severity,

              time: now,
            },

            ...prev,
          ].slice(0, 50),
        );
      }
    }, 3000);

    return () => {
      clearInterval(timer);
    };
  }, [cameras, updateCamera]);

  return {
    alerts,
  };
}
