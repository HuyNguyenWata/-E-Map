import { useTranslation } from "react-i18next";
import { useAuth } from "../auth/AuthContext";

interface Props {
  showHeatmap: boolean;

  setShowHeatmap: (value: boolean) => void;

  showCamera: boolean;

  setShowCamera: (value: boolean) => void;

  fullscreen: () => void;

  reset: () => void;
  drawZone: boolean;

  onToggleDrawZone: () => void;

  radiusMode: boolean;

  onToggleRadiusMode: () => void;

  onOpenAnpr: () => void;

  onOpenFace: () => void;

  onOpenBehavior: () => void;
}

function MapToolbar({
  showHeatmap,

  setShowHeatmap,

  showCamera,

  setShowCamera,

  fullscreen,

  reset,
  drawZone,
  onToggleDrawZone,
  radiusMode,
  onToggleRadiusMode,
  onOpenAnpr,
  onOpenFace,
  onOpenBehavior,
}: Props) {
  const { t } = useTranslation();
  const { hasPermission } = useAuth();

  return (
    <div className="map-toolbar">
      <button
        className={"btn" + (showHeatmap ? " btn-active" : "")}
        onClick={() => setShowHeatmap(!showHeatmap)}
        title={t("mapToolbar.heatmapTitle")}
      >
        {t("mapToolbar.heatmap")}
      </button>

      <button
        className={"btn" + (showCamera ? " btn-active" : "")}
        onClick={() => setShowCamera(!showCamera)}
        title={t("mapToolbar.cameraTitle")}
      >
        {t("mapToolbar.camera")}
      </button>

      <button className="btn" onClick={reset} title={t("mapToolbar.resetTitle")}>
        {t("mapToolbar.reset")}
      </button>

      <button className="btn" onClick={fullscreen} title={t("mapToolbar.fullscreenTitle")}>
        {t("mapToolbar.fullscreen")}
      </button>

      {hasPermission("ManageZones") && (
        <button
          className={"btn" + (drawZone ? " btn-active" : "")}
          onClick={onToggleDrawZone}
          title={t("mapToolbar.drawZoneTitle")}
        >
          {drawZone ? t("mapToolbar.cancelDrawZone") : t("mapToolbar.drawZone")}
        </button>
      )}

      <button
        className={"btn" + (radiusMode ? " btn-active" : "")}
        onClick={onToggleRadiusMode}
        title={t("mapToolbar.radiusTitle")}
      >
        {radiusMode ? t("mapToolbar.cancelRadius") : t("mapToolbar.radius")}
      </button>

      <button className="btn" onClick={onOpenAnpr} title={t("mapToolbar.anprTitle")}>
        {t("mapToolbar.anpr")}
      </button>

      <button className="btn" onClick={onOpenFace} title={t("mapToolbar.faceTitle")}>
        {t("mapToolbar.face")}
      </button>

      <button className="btn" onClick={onOpenBehavior} title={t("mapToolbar.behaviorTitle")}>
        {t("mapToolbar.behavior")}
      </button>
    </div>
  );
}

export default MapToolbar;
