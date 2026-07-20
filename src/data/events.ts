import type { CameraAlert } from "../types/alert";

export const mockEvents: CameraAlert[] = [
  {
    id: 1,

    cameraId: 1,

    cameraName: "Camera Cổng Chính",

    type: "person",

    severity: "warning",

    time: "10:00:12",
  },

  {
    id: 2,

    cameraId: 1,

    cameraName: "Camera Cổng Chính",

    type: "vehicle",

    severity: "info",

    time: "10:05:30",
  },

  {
    id: 3,

    cameraId: 1,

    cameraName: "Camera Cổng Chính",

    type: "fire",

    severity: "critical",

    time: "10:10:22",
  },

  {
    id: 4,

    cameraId: 2,

    cameraName: "Camera Bãi Xe",

    type: "vehicle",

    severity: "info",

    time: "10:15:00",
  },

  {
    id: 5,

    cameraId: 3,

    cameraName: "Camera Kho",

    type: "smoke",

    severity: "critical",

    time: "10:20:45",
  },
];
