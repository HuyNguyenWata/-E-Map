import { useMemo, useState } from "react";
import useZoneCamera from "../hooks/useZoneCamera";
import EMapLayout from "../components/EMapLayout";

import LeftPanel from "../components/LeftPanel";

import MapView from "../components/MapView";
import useCameraWall from "../hooks/useCameraWall";
import CameraWallButton from "../components/CameraWallButton";
import CameraWall from "../components/CameraWall";
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
function EMap() {
  const { cameras, updateCamera } = useCamera();
  const { zones } = useZone(cameras);

  const {
    filter,

    setFilter,

    filtered,
  } = useCameraFilter(cameras);
  const { alerts } = useCameraRealtime(cameras, updateCamera);
  const [selectedZone, setSelectedZone] = useState<ZoneWithCamera | null>(null);
  const [selectedCamera, setSelectedCamera] = useState(null);
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
  const handleCreateZone = (polygon: [number, number][]) => {
    console.log("Polygon:", polygon);

    alert("Đã tạo polygon gồm " + polygon.length + " điểm");
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
  return (
    <EMapLayout
      left={
        <LeftPanel
          cameras={zoneCameras}
          filtered={zoneCameras}
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

          {showHeatmap && (
            <div
              style={{
                position: "absolute",
                bottom: 20,
                left: 20,
                zIndex: 1500,
              }}
            >
              <HeatmapLegend />
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

          {showWall && (
            <div
              style={{
                position: "absolute",

                inset: 0,

                zIndex: 3000,

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
                  padding: "12px 20px",
                  borderBottom: "1px solid var(--border)",
                  flexShrink: 0,
                }}
              >
                <h2 style={{ margin: 0 }}>📺 Camera Wall</h2>

                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn btn-danger" onClick={clearCamera}>
                    Clear All
                  </button>
                  <button
                    className="btn"
                    onClick={() => setShowWall(false)}
                  >
                    ✕ Đóng
                  </button>
                </div>
              </div>

              <div style={{ flex: 1, minHeight: 0 }}>
                <CameraWall
                  cameras={selectedCameras}
                  onRemove={removeCamera}
                />
              </div>
            </div>
          )}
        </div>
      }
      right={
        <RightPanel
          camera={selectedCamera}
          alerts={alerts}
          close={() => setSelectedCamera(null)}
        />
      }
    />
  );
}

export default EMap;
