import { useEffect } from "react";
import type Map from "ol/Map";
import { useOlMap } from "../map/MapContext";

interface Props {
  onReady: (map: Map) => void;
}

function MapController({ onReady }: Props) {
  const map = useOlMap();

  useEffect(() => {
    onReady(map);
  }, [map, onReady]);

  return null;
}

export default MapController;
