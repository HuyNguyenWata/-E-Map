import { Marker, Popup } from "react-leaflet";

import L from "leaflet";

import CameraPopup from "./CameraPopup";

import type { Camera } from "../types/camera";

interface Props {
  camera: Camera;

  onSelect?: (camera: Camera) => void;
}

function createCameraIcon(camera: Camera) {
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

  return L.divIcon({
    className: "",

    html: `
    <div class="${className}">
        ${alertIcon}
    </div>
    `,

    iconSize: [24, 24],

    iconAnchor: [12, 12],
  });
}

function CameraMarker({
  camera,

  onSelect,
}: Props) {
  return (
    <Marker
      position={[camera.latitude, camera.longitude]}
      icon={createCameraIcon(camera)}
      eventHandlers={{
        click: () => {
          onSelect?.(camera);
        },
      }}
    >
      <Popup>
        <CameraPopup camera={camera} />
      </Popup>
    </Marker>
  );
}

export default CameraMarker;
