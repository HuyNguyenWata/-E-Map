import { useTranslation } from "react-i18next";
import CameraDetailPanel from "./CameraDetailPanel";

import type { Camera } from "../types/camera";

import type { CameraAlert } from "../types/alert";

interface Props {
  camera: Camera | null;

  alerts: CameraAlert[];

  close: () => void;

  onEdit: (camera: Camera) => void;

  onDelete: (camera: Camera) => void;

  favoriteIds: Set<number>;
  onToggleFavorite: (cameraId: number) => void;
}

function RightPanel({
  camera,

  alerts,

  close,

  onEdit,

  onDelete,

  favoriteIds,
  onToggleFavorite,
}: Props) {
  const { t } = useTranslation();

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
        <div style={{ fontSize: 13 }}>{t("cameraDetail.selectPrompt")}</div>
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
      isFavorite={favoriteIds.has(camera.id)}
      onToggleFavorite={() => onToggleFavorite(camera.id)}
    />
  );
}

export default RightPanel;
