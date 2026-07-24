import { useEffect } from "react";
import { toLonLat } from "ol/proj";
import { useOlMap } from "../map/MapContext";

interface Props {
  onClick: (lat: number, lng: number) => void;
}

function MapClickHandler({ onClick }: Props) {
  const map = useOlMap();

  useEffect(() => {
    const handler = (evt: { coordinate: number[] }) => {
      const [lng, lat] = toLonLat(evt.coordinate);
      onClick(lat, lng);
    };

    map.on("click", handler);
    return () => {
      map.un("click", handler);
    };
  }, [map, onClick]);

  return null;
}

export default MapClickHandler;
