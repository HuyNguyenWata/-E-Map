import { useEffect } from "react";
import { useMap } from "react-leaflet";

interface Props {
  onReady: (map: any) => void;
}

function MapController({ onReady }: Props) {
  const map = useMap();

  useEffect(() => {
    onReady(map);
  }, [map, onReady]);

  return null;
}

export default MapController;
