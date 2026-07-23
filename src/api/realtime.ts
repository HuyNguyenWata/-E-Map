import * as signalR from "@microsoft/signalr";
import type { Camera } from "../types/camera";
import type { CameraAlert } from "../types/alert";
import type { SystemHealth } from "../types/systemHealth";
import { API_BASE_URL } from "./config";
import { getToken } from "./authToken";

export interface CameraHubHandlers {
  onCameraUpdated?: (camera: Camera) => void;
  onAlertCreated?: (alert: CameraAlert) => void;
  onSystemHealthUpdated?: (health: SystemHealth) => void;
}

export function createCameraHubConnection(
  handlers: CameraHubHandlers,
): signalR.HubConnection {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl(`${API_BASE_URL}/hubs/cameras`, {
      accessTokenFactory: () => getToken() ?? "",
    })
    .withAutomaticReconnect()
    // React StrictMode (dev) mount -> unmount -> mount lại khiến start() đầu tiên
    // luôn bị hủy giữa chừng; hạ log level để bỏ qua tiếng ồn vô hại đó.
    .configureLogging(signalR.LogLevel.Critical)
    .build();

  if (handlers.onCameraUpdated) connection.on("CameraUpdated", handlers.onCameraUpdated);
  if (handlers.onAlertCreated) connection.on("AlertCreated", handlers.onAlertCreated);
  if (handlers.onSystemHealthUpdated) connection.on("SystemHealthUpdated", handlers.onSystemHealthUpdated);

  return connection;
}
