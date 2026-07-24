import { createContext, useContext } from "react";
import type Map from "ol/Map";

// OpenLayers không có binding React chính thức — Context này thay cho
// useMap() của react-leaflet, các layer/overlay component tự lấy map ra rồi
// thêm/gỡ chính mình bằng useEffect (imperative), giống cách react-leaflet
// làm nội bộ, chỉ là ta tự viết tay.
export const MapContext = createContext<Map | null>(null);

export function useOlMap(): Map {
  const map = useContext(MapContext);
  if (!map) throw new Error("useOlMap phải được gọi bên trong <MapView>");
  return map;
}
