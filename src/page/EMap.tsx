import { useMemo, useState } from "react";

import EMapLayout from "../components/EMapLayout";

import LeftPanel from "../components/LeftPanel";

import MapView from "../components/MapView";
import useCameraWall from "../hooks/useCameraWall";
import CameraWallButton from "../components/CameraWallButton";
import CameraWall from "../components/CameraWall";
import RightPanel from "../components/RightPanel";

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

  const [selectedCamera, setSelectedCamera] = useState(null);
  const {
    selectedCameras,

    addCamera,

    removeCamera,

    clearCamera,
  } = useCameraWall();
  const [showHeatmap, setShowHeatmap] = useState(true);

  const [showCamera, setShowCamera] = useState(true);

  const [map, setMap] = useState<any>(null);
  const [showWall, setShowWall] = useState(false);

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
  return (
    <EMapLayout
      left={
        <LeftPanel
          cameras={cameras}
          filtered={filtered}
          filter={filter}
          setFilter={setFilter}
          onSelect={(camera) => {
            setSelectedCamera(camera);

            addCamera(camera);
          }}
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
            cameras={filtered}
            alerts={alerts}
            onSelect={(camera) => {
              setSelectedCamera(camera);
              addCamera(camera);
            }}
            showHeatmap={showHeatmap}
            showCamera={showCamera}
            onMapReady={setMap}
            zones={zones}
          />

          {/* Overlay trên map */}
          <div
            style={{
              position: "absolute",
              top: 20,
              left: 20,
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

                background: "#fff",
              }}
            >
              <button onClick={() => setShowWall(false)}>
                Đóng Camera Wall
              </button>
              <button onClick={clearCamera}>Clear All</button>{" "}
              <CameraWall cameras={selectedCameras} onRemove={removeCamera} />
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
