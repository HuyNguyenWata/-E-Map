import { useCallback, useMemo, useState } from "react";
import useZoneCamera from "../hooks/useZoneCamera";
import EMapLayout from "../components/EMapLayout";

import LeftPanel from "../components/LeftPanel";

import MapView from "../components/MapView";
import useCameraWall from "../hooks/useCameraWall";
import CameraWallButton from "../components/CameraWallButton";
import CameraWall from "../components/CameraWall";
import CameraWallGridControl from "../components/CameraWallGridControl";
import RightPanel from "../components/RightPanel";
import type { ZoneWithCamera } from "../types/zoneWithCamera";
import type { Camera } from "../types/camera";
import useCamera from "../hooks/useCamera";
import useCameraFilter from "../hooks/useCameraFilter";
import useCameraRealtime from "../hooks/useCameraRealtime";
import useRadiusCameras from "../hooks/useRadiusCameras";
import MapToolbar from "../components/MapToolbar";
import SearchBox from "../components/SearchBox";
import RadiusControl from "../components/RadiusControl";
import HeatmapLegend from "../components/HeatmapLegend";
import useZone from "../hooks/useZone";
import useSystemHealth from "../hooks/useSystemHealth";
import useAlertStats from "../hooks/useAlertStats";
import useZoneStats from "../hooks/useZoneStats";
import CameraFormModal from "../components/CameraFormModal";
import ZoneFormModal from "../components/ZoneFormModal";
import AnprPanel from "../components/AnprPanel";
import FacePanel from "../components/FacePanel";
import BehaviorPanel from "../components/BehaviorPanel";
import type { RoutePoint } from "../components/PlateRouteLayer";
function EMap() {
  const { cameras, updateCamera, upsertCamera, createCamera, deleteCamera, editCamera } =
    useCamera();
  const { zones, createZone, toggleZoneWatch } = useZone(cameras);

  const {
    filter,

    setFilter,

    filtered,
  } = useCameraFilter(cameras);
  const { alerts } = useCameraRealtime(cameras, updateCamera, upsertCamera);
  const { health } = useSystemHealth();
  const { stats: alertStats } = useAlertStats(7, alerts.length);
  const { stats: zoneStats } = useZoneStats(7, alerts.length);
  const [selectedZone, setSelectedZone] = useState<ZoneWithCamera | null>(null);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [cameraFormOpen, setCameraFormOpen] = useState(false);
  const [editingCamera, setEditingCamera] = useState<Camera | null>(null);
  const [zoneFormOpen, setZoneFormOpen] = useState(false);
  const [pendingPolygon, setPendingPolygon] = useState<[number, number][] | null>(null);
  const [showAnpr, setShowAnpr] = useState(false);
  const [showFace, setShowFace] = useState(false);
  const [showBehavior, setShowBehavior] = useState(false);
  const [routePlate, setRoutePlate] = useState<string | null>(null);
  const [routePoints, setRoutePoints] = useState<RoutePoint[]>([]);
  const {
    selectedCameras,

    addCamera,

    removeCamera,

    clearCamera,
  } = useCameraWall();
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [drawZone, setDrawZone] = useState(false);
  const [showCamera, setShowCamera] = useState(true);

  const [radiusMode, setRadiusMode] = useState(false);
  const [radiusCenter, setRadiusCenter] = useState<[number, number] | null>(
    null,
  );
  const [radiusValue, setRadiusValue] = useState(500);
  const [radiusKeyword, setRadiusKeyword] = useState("");

  const [map, setMap] = useState<any>(null);
  const [showWall, setShowWall] = useState(false);
  const [wallGridSize, setWallGridSize] = useState(4);
  const { zoneCameras } = useZoneCamera(filtered, selectedZone);
  const { camerasInRadius } = useRadiusCameras(
    cameras,
    radiusCenter,
    radiusValue,
  );

  const radiusSearchResults = useMemo(() => {
    const keyword = radiusKeyword.trim().toLowerCase();

    if (!keyword) return [];

    return cameras
      .filter(
        (camera) =>
          camera.name.toLowerCase().includes(keyword) ||
          camera.address.toLowerCase().includes(keyword),
      )
      .slice(0, 6);
  }, [cameras, radiusKeyword]);

  const resetMap = () => {
    if (!map) return;

    map.setView(
      [10.776889, 106.700806],

      15,
    );
  };
  const fullscreen = () => {
    const element = document.documentElement;

    if (element.requestFullscreen) {
      element.requestFullscreen();
    }
  };
  const handleCreateZone = useCallback((polygon: [number, number][]) => {
    setPendingPolygon(polygon);
    setZoneFormOpen(true);
    setDrawZone(false);
  }, []);

  const handleOpenAddCamera = () => {
    setEditingCamera(null);
    setCameraFormOpen(true);
  };

  const handleOpenEditCamera = (camera: Camera) => {
    setEditingCamera(camera);
    setCameraFormOpen(true);
  };

  const handleDeleteCamera = async (camera: Camera) => {
    if (!window.confirm(`Xoá camera "${camera.name}"?`)) return;

    await deleteCamera(camera.id);
    setSelectedCamera((current) => (current?.id === camera.id ? null : current));
  };

  const toggleDrawZone = () => {
    setDrawZone((prev) => !prev);
    setRadiusMode(false);
  };

  const toggleRadiusMode = () => {
    setRadiusMode((prev) => {
      const next = !prev;

      if (next) {
        setDrawZone(false);
      } else {
        setRadiusCenter(null);
        setRadiusKeyword("");
      }

      return next;
    });
  };

  const handleRadiusPick = (lat: number, lng: number) => {
    setRadiusCenter([lat, lng]);
    setRadiusKeyword("");
  };

  const clearRadiusSearch = () => {
    setRadiusCenter(null);
    setRadiusKeyword("");
  };

  const handlePickSearchResult = (camera: Camera) => {
    setRadiusCenter([camera.latitude, camera.longitude]);
    setRadiusKeyword(camera.name);

    if (map) {
      map.flyTo([camera.latitude, camera.longitude], 17, { duration: 1.2 });
    }
  };

  const handleSelectRadiusCamera = (camera: Camera) => {
    setSelectedCamera(camera);
    addCamera(camera);
  };

  const handleLocateOnMap = (lat: number, lng: number) => {
    if (map) {
      map.flyTo([lat, lng], 17, { duration: 1.2 });
    }
  };

  const handleShowRoute = (plateNumber: string, points: RoutePoint[]) => {
    setRoutePlate(plateNumber);
    setRoutePoints(points);

    if (map && points.length > 0) {
      map.fitBounds(
        points.map((p) => [p.lat, p.lng] as [number, number]),
        { padding: [60, 60] },
      );
    }
  };

  const clearRoute = () => {
    setRoutePlate(null);
    setRoutePoints([]);
  };
  return (
    <>
      <EMapLayout
        left={
        <LeftPanel
          cameras={zoneCameras}
          filtered={zoneCameras}
          alerts={alerts}
          health={health}
          alertStats={alertStats}
          zoneStats={zoneStats}
          filter={filter}
          setFilter={setFilter}
          onSelect={(camera) => {
            setSelectedCamera(camera);

            addCamera(camera);
          }}
          zones={zones}
          selectedZone={selectedZone?.id ?? null}
          onSelectZone={setSelectedZone}
          onClear={() => setSelectedZone(null)}
          onAddCamera={handleOpenAddCamera}
        />
      }
      center={
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
          }}
        >
          <MapView
            cameras={zoneCameras}
            alerts={alerts}
            onSelect={(camera) => {
              setSelectedCamera(camera);
              addCamera(camera);
            }}
            showHeatmap={showHeatmap}
            showCamera={showCamera}
            onMapReady={setMap}
            zones={zones}
            selectedZone={selectedZone?.id ?? null}
            onSelectZone={setSelectedZone}
            drawZone={drawZone}
            onCreateZone={handleCreateZone}
            radiusMode={radiusMode}
            radiusCenter={radiusCenter}
            radiusValue={radiusValue}
            onRadiusPick={handleRadiusPick}
            routePoints={routePoints}
          />

          {/* Overlay trên map */}
          <div
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              zIndex: 2000,
            }}
          >
            <MapToolbar
              showHeatmap={showHeatmap}
              setShowHeatmap={setShowHeatmap}
              showCamera={showCamera}
              setShowCamera={setShowCamera}
              fullscreen={fullscreen}
              reset={resetMap}
              drawZone={drawZone}
              onToggleDrawZone={toggleDrawZone}
              radiusMode={radiusMode}
              onToggleRadiusMode={toggleRadiusMode}
              onOpenAnpr={() => setShowAnpr(true)}
              onOpenFace={() => setShowFace(true)}
              onOpenBehavior={() => setShowBehavior(true)}
            />
          </div>

          {radiusMode && (
            <div
              style={{
                position: "absolute",
                top: 20,
                left: 20,
                zIndex: 2000,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <SearchBox
                value={radiusKeyword}
                onChange={setRadiusKeyword}
                results={radiusSearchResults}
                onPick={handlePickSearchResult}
              />

              {radiusCenter && (
                <RadiusControl
                  radius={radiusValue}
                  setRadius={setRadiusValue}
                  matchedCameras={camerasInRadius}
                  onSelectCamera={handleSelectRadiusCamera}
                  onClear={clearRadiusSearch}
                />
              )}
            </div>
          )}

          {(showHeatmap || routePoints.length > 0) && (
            <div
              style={{
                position: "absolute",
                bottom: 20,
                left: 20,
                zIndex: 1500,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {routePoints.length > 0 && (
                <div className="panel-block" style={{ padding: "10px 14px", fontSize: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                    <span>
                      🗺️ Lộ trình <b>{routePlate}</b> ({routePoints.length} điểm)
                    </span>
                    <button className="btn btn-sm" onClick={clearRoute}>
                      ✕
                    </button>
                  </div>
                </div>
              )}

              {showHeatmap && <HeatmapLegend />}
            </div>
          )}

          <div
            style={{
              position: "absolute",
              right: 20,
              bottom: 20,
              zIndex: 2000,
            }}
          >
            <CameraWallButton
              open={() => setShowWall(true)}
              count={selectedCameras.length}
            />
          </div>
        </div>
      }
      right={
        <RightPanel
          camera={selectedCamera}
          alerts={alerts}
          close={() => setSelectedCamera(null)}
          onEdit={handleOpenEditCamera}
          onDelete={handleDeleteCamera}
        />
      }
      />

      <CameraFormModal
        open={cameraFormOpen}
        onClose={() => setCameraFormOpen(false)}
        camera={editingCamera}
        zones={zones}
        onCreate={createCamera}
        onEdit={editCamera}
      />

      <ZoneFormModal
        open={zoneFormOpen}
        polygon={pendingPolygon}
        onClose={() => setZoneFormOpen(false)}
        onCreate={createZone}
      />

      {showAnpr && (
        <AnprPanel
          onClose={() => setShowAnpr(false)}
          onLocate={handleLocateOnMap}
          onShowRoute={handleShowRoute}
          zones={zones}
          onToggleZoneWatch={toggleZoneWatch}
        />
      )}

      {showFace && <FacePanel onClose={() => setShowFace(false)} />}

      {showBehavior && <BehaviorPanel onClose={() => setShowBehavior(false)} />}

      {showWall && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 5000,
            background: "var(--panel-bg)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
              padding: "12px 20px",
              borderBottom: "1px solid var(--border)",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <h2 style={{ margin: 0 }}>📺 Camera Wall</h2>

              <CameraWallGridControl
                value={wallGridSize}
                onChange={setWallGridSize}
              />

              {selectedCameras.length > wallGridSize * wallGridSize && (
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  Đang hiển thị {wallGridSize * wallGridSize}/
                  {selectedCameras.length} camera — tăng kích thước lưới để
                  xem thêm
                </span>
              )}
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-danger" onClick={clearCamera}>
                Clear All
              </button>
              <button className="btn" onClick={() => setShowWall(false)}>
                ✕ Đóng
              </button>
            </div>
          </div>

          <div style={{ flex: 1, minHeight: 0 }}>
            <CameraWall
              cameras={selectedCameras}
              onRemove={removeCamera}
              gridSize={wallGridSize}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default EMap;
