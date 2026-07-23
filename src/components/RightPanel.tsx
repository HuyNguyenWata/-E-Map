import CameraDetailPanel from "./CameraDetailPanel";

import type { Camera } from "../types/camera";

import type { CameraAlert } from "../types/alert";

interface Props {
  camera: Camera | null;

  alerts: CameraAlert[];

  close: () => void;

  onEdit: (camera: Camera) => void;

  onDelete: (camera: Camera) => void;
}

function RightPanel({
  camera,

  alerts,

  close,

  onEdit,

  onDelete,
}: Props) {
  if (!camera) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          color: "var(--text-faint)",
          textAlign: "center",
          padding: 24,
          boxSizing: "border-box",
        }}
      >
        <div style={{ fontSize: 32 }}>📷</div>
        <div style={{ fontSize: 13 }}>Chọn một camera để xem chi tiết</div>
      </div>
    );
  }

  return (
    <CameraDetailPanel
      camera={camera}
      alerts={alerts}
      onClose={close}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
}

export default RightPanel;
