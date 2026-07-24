import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Overlay from "ol/Overlay";
import type { Positioning } from "ol/Overlay";
import { fromLonLat } from "ol/proj";
import { useOlMap } from "./MapContext";

interface Props {
  lat: number;
  lng: number;
  className?: string;
  positioning?: Positioning;
  offset?: [number, number];
  children: React.ReactNode;
}

// Thay cho <Popup>/<Tooltip> của react-leaflet — OpenLayers không có sẵn,
// dùng ol/Overlay (chỉ định vị theo toạ độ bản đồ) + React Portal để render
// component React thật (kể cả HlsVideo có state/effect riêng) vào bên trong.
function OverlayPopup({ lat, lng, className, positioning = "bottom-center", offset = [0, -14], children }: Props) {
  const map = useOlMap();
  const elRef = useRef<HTMLDivElement | null>(null);
  if (!elRef.current) {
    elRef.current = document.createElement("div");
  }

  useEffect(() => {
    const el = elRef.current!;
    const overlay = new Overlay({
      element: el,
      positioning,
      offset,
      stopEvent: true,
    });
    map.addOverlay(overlay);

    return () => {
      map.removeOverlay(overlay);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  useEffect(() => {
    const el = elRef.current!;
    el.className = className ?? "";
  }, [className]);

  useEffect(() => {
    const overlays = map.getOverlays().getArray();
    const overlay = overlays.find((o) => o.getElement() === elRef.current);
    overlay?.setPosition(fromLonLat([lng, lat]));
  }, [map, lat, lng]);

  return createPortal(children, elRef.current);
}

export default OverlayPopup;
