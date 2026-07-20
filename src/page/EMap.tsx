import { useState } from "react";
import useZoneCamera from "../hooks/useZoneCamera";
import EMapLayout from "../components/EMapLayout";

import LeftPanel from "../components/LeftPanel";

import MapView from "../components/MapView";
import useCameraWall from "../hooks/useCameraWall";
import CameraWallButton from "../components/CameraWallButton";
import CameraWall from "../components/CameraWall";
import RightPanel from "../components/RightPanel";
import type { ZoneWithCamera } from "../types/zoneWithCamera";
import useCamera from "../hooks/useCamera";
import useCameraFilter from "../hooks/useCameraFilter";
import useCameraRealtime from "../hooks/useCameraRealtime";
import MapToolbar from "../components/MapToolbar";
import useZone from "../hooks/useZone";
function EMap() {
  const { cameras } = useCamera();
  const { zones } = useZone(cameras);

  const {
    filter,

    setFilter,

    filtered,
  } = useCameraFilter(cameras);
  const { alerts } = useCameraRealtime(cameras, () => {});
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

  const [map, setMap] = useState<any>(null);
  const [showWall, setShowWall] = useState(false);
  const { zoneCameras } = useZoneCamera(filtered, selectedZone);
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
              setDrawZone={setDrawZone}
            />
          </div>

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
