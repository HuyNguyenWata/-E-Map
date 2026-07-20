import { useEffect } from "react";
import { useMap } from "react-leaflet";

import type { Camera } from "../types/camera";

interface Props {
  camera: Camera | null;
}

function FlyToCamera({ camera }: Props) {
  const map = useMap();

  useEffect(() => {
    if (!camera) return;

    map.flyTo([camera.latitude, camera.longitude], 18, {
      duration: 1.5,
    });
  }, [camera]);

  return null;
}

export default FlyToCamera;
