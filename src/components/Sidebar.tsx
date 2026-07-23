import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { Camera } from "../types/camera";
import { useAuth } from "../auth/AuthContext";

interface Props {
  cameras: Camera[];
  onSelect: (camera: Camera) => void;
  onAddCamera: () => void;
  favoriteIds: Set<number>;
  onToggleFavorite: (cameraId: number) => void;
}

function Sidebar({ cameras, onSelect, onAddCamera, favoriteIds, onToggleFavorite }: Props) {
  const { t } = useTranslation();
  const { hasPermission } = useAuth();
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const visibleCameras = onlyFavorites
    ? cameras.filter((c) => favoriteIds.has(c.id))
    : cameras;

  return (
    <div
      style={{
        width: "100%",

        display: "flex",

        flexDirection: "column",

        gap: 8,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 2,
        }}
      >
        <h3 className="panel-title" style={{ margin: 0 }}>
          {t("sidebar.title")} ({visibleCameras.length})
        </h3>

        <div style={{ display: "flex", gap: 6 }}>
          <button
            className={"btn btn-sm" + (onlyFavorites ? " btn-active" : "")}
            onClick={() => setOnlyFavorites((prev) => !prev)}
            title={t("sidebar.favoritesOnly")}
          >
            {onlyFavorites ? t("sidebar.favoritesOnly") : t("sidebar.favoritesOnlyOff")}
          </button>

          {hasPermission("ManageCameras") && (
            <button className="btn btn-sm btn-primary" onClick={onAddCamera}>
              {t("sidebar.add")}
            </button>
          )}
        </div>
      </div>

      {visibleCameras.length === 0 && (
        <div className="empty-state">
          {onlyFavorites ? t("sidebar.emptyFavorites") : t("sidebar.empty")}
        </div>
      )}

      {visibleCameras.map((camera) => (
        <div
          key={camera.id}
          onClick={() => onSelect(camera)}
          className="card card-clickable"
          style={{
            padding: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
              <button
                className="btn btn-icon btn-ghost"
                style={{ padding: 0, fontSize: 14, lineHeight: 1 }}
                title={
                  favoriteIds.has(camera.id)
                    ? t("sidebar.removeFromFavorite")
                    : t("sidebar.addToFavorite")
                }
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(camera.id);
                }}
              >
                {favoriteIds.has(camera.id) ? "⭐" : "☆"}
              </button>
              <b style={{ fontSize: 13 }}>{camera.name}</b>
            </div>

            <span
              className={
                "badge " +
                (camera.status === "online" ? "badge-online" : "badge-offline")
              }
            >
              <span className="badge-dot" />
              {camera.status === "online" ? t("common.online") : t("common.offline")}
            </span>
          </div>

          <div
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
              marginTop: 4,
            }}
          >
            {camera.address}
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              fontSize: 11,
              color: "var(--text-faint)",
              marginTop: 2,
            }}
          >
            <span>{t("sidebar.signal")} {camera.signal}%</span>
            <span>{camera.lastSeen}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
export default Sidebar;
