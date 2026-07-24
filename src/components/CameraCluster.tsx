import { useEffect, useRef, useState } from "react";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import ClusterSource from "ol/source/Cluster";
import Feature from "ol/Feature";
import { Point } from "ol/geom";
import { Style } from "ol/style";
import { fromLonLat, toLonLat } from "ol/proj";

import { useOlMap } from "../map/MapContext";
import OverlayPopup from "../map/OverlayPopup";
import CameraPopup from "./CameraPopup";
import type { Camera } from "../types/camera";

interface Props {
  cameras: Camera[];
  onSelect: (camera: Camera) => void;
}

interface ClusterGroup {
  id: string;
  lat: number;
  lng: number;
  cameras: Camera[];
}

const CAMERA_KEY = "camera";
// Xấp xỉ maxClusterRadius mặc định (80px) của Leaflet.markercluster mà bản cũ
// đang dùng, để mật độ gộp cụm nhìn tương đương.
const CLUSTER_DISTANCE_PX = 70;

function cameraClassName(camera: Camera): { className: string; alertIcon: string } {
  let className = "camera-marker";
  let alertIcon = "";

  if (camera.alert) {
    if (camera.alert.severity === "critical") {
      className += " camera-critical";
      alertIcon = "🔥";
    } else if (camera.alert.severity === "warning") {
      className += " camera-warning";
      alertIcon = "⚠️";
    }
  } else if (camera.status === "offline") {
    className += " camera-offline";
  } else {
    className += " camera-online";
  }

  return { className, alertIcon };
}

function CameraCluster({ cameras, onSelect }: Props) {
  const map = useOlMap();
  const [groups, setGroups] = useState<ClusterGroup[]>([]);
  const [openCameraId, setOpenCameraId] = useState<number | null>(null);
  const groupsRef = useRef<ClusterGroup[]>([]);
  groupsRef.current = groups;

  useEffect(() => {
    const pointSource = new VectorSource({
      features: cameras.map((camera) => {
        const feature = new Feature(new Point(fromLonLat([camera.longitude, camera.latitude])));
        feature.set(CAMERA_KEY, camera);
        return feature;
      }),
    });

    const clusterSource = new ClusterSource({ distance: CLUSTER_DISTANCE_PX, source: pointSource });

    // Layer thật được thêm vào map để driver vòng render nội bộ của OL tính
    // cluster đúng theo resolution hiện tại — nhưng style rỗng nên không vẽ
    // gì lên canvas cả, marker thật sự hiển thị qua Overlay HTML bên dưới
    // (để tái dùng đúng CSS/animation .camera-marker đã có, không vẽ lại
    // bằng canvas).
    const layer = new VectorLayer({ source: clusterSource, style: new Style({}) });
    map.addLayer(layer);

    const recompute = () => {
      const features = clusterSource.getFeatures();
      const nextGroups: ClusterGroup[] = features.map((f) => {
        const inner = (f.get("features") as Feature[]).map((ff) => ff.get(CAMERA_KEY) as Camera);
        const geom = f.getGeometry() as Point;
        const [lng, lat] = toLonLat(geom.getCoordinates());
        return { id: inner.map((c) => c.id).join("-"), lat, lng, cameras: inner };
      });
      setGroups(nextGroups);
    };

    recompute();
    map.on("moveend", recompute);
    map.on("rendercomplete", recompute);

    return () => {
      map.un("moveend", recompute);
      map.un("rendercomplete", recompute);
      map.removeLayer(layer);
    };
  }, [map, cameras]);

  // Click vào khoảng trống trên bản đồ (không phải marker — marker overlay
  // đã stopEvent nên không lọt tới đây) thì đóng popup camera đang mở, giống
  // hành vi mặc định của Leaflet Popup.
  useEffect(() => {
    const handleMapClick = () => setOpenCameraId(null);
    map.on("click", handleMapClick);
    return () => {
      map.un("click", handleMapClick);
    };
  }, [map]);

  const handleClusterClick = (group: ClusterGroup) => {
    if (group.cameras.length === 1) {
      setOpenCameraId(group.cameras[0].id);
      onSelect(group.cameras[0]);
      return;
    }

    const view = map.getView();
    view.animate({
      center: fromLonLat([group.lng, group.lat]),
      zoom: Math.min(19, (view.getZoom() ?? 15) + 2),
      duration: 300,
    });
  };

  const openCamera = groups.flatMap((g) => g.cameras).find((c) => c.id === openCameraId) ?? null;

  return (
    <>
      {groups.map((group) => {
        if (group.cameras.length === 1) {
          const camera = group.cameras[0];
          const { className, alertIcon } = cameraClassName(camera);

          return (
            <OverlayPopup key={group.id} lat={group.lat} lng={group.lng} positioning="center-center">
              <div
                className={className}
                style={{ cursor: "pointer" }}
                onClick={() => handleClusterClick(group)}
              >
                {alertIcon}
              </div>
            </OverlayPopup>
          );
        }

        return (
          <OverlayPopup key={group.id} lat={group.lat} lng={group.lng} positioning="center-center">
            <div className="marker-cluster" style={{ cursor: "pointer" }} onClick={() => handleClusterClick(group)}>
              <div>{group.cameras.length}</div>
            </div>
          </OverlayPopup>
        );
      })}

      {openCamera && (
        <OverlayPopup lat={openCamera.latitude} lng={openCamera.longitude} className="ol-popup">
          <div className="ol-popup-content">
            <CameraPopup camera={openCamera} />
          </div>
        </OverlayPopup>
      )}
    </>
  );
}

export default CameraCluster;
