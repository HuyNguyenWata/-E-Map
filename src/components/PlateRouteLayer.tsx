import { useEffect, useRef, useState } from "react";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import { LineString, Point } from "ol/geom";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import { fromLonLat } from "ol/proj";
import type { FeatureLike } from "ol/Feature";
import type MapBrowserEvent from "ol/MapBrowserEvent";
import { useOlMap } from "../map/MapContext";
import OverlayPopup from "../map/OverlayPopup";

export interface RoutePoint {
  lat: number;
  lng: number;
  detectedAt: string;
}

interface Props {
  points: RoutePoint[];
}

const POINT_KEY = "routePoint";

function pointStyle(isStart: boolean, isEnd: boolean, big: boolean) {
  return new Style({
    image: new CircleStyle({
      radius: big ? 8 : 6,
      stroke: new Stroke({ color: "#7c3aed", width: 2 }),
      fill: new Fill({ color: isStart ? "#22c55e" : isEnd ? "#ef4444" : "#7c3aed" }),
    }),
  });
}

function PlateRouteLayer({ points }: Props) {
  const map = useOlMap();
  const layerRef = useRef<VectorLayer | null>(null);
  const [hovered, setHovered] = useState<{ point: RoutePoint; isStart: boolean; isEnd: boolean } | null>(null);

  useEffect(() => {
    if (points.length === 0) return;

    const lineFeature = new Feature(
      new LineString(points.map((p) => fromLonLat([p.lng, p.lat]))),
    );
    lineFeature.setStyle(
      new Style({ stroke: new Stroke({ color: "#7c3aed", width: 3, lineDash: [8, 6] }) }),
    );

    const pointFeatures = points.map((p, i) => {
      const isStart = i === 0;
      const isEnd = i === points.length - 1;
      const feature = new Feature({ geometry: new Point(fromLonLat([p.lng, p.lat])) });
      feature.set(POINT_KEY, { point: p, isStart, isEnd });
      feature.setStyle(pointStyle(isStart, isEnd, isStart || isEnd));
      return feature;
    });

    const layer = new VectorLayer({
      source: new VectorSource({ features: [lineFeature, ...pointFeatures] }),
    });
    layerRef.current = layer;
    map.addLayer(layer);

    return () => {
      map.removeLayer(layer);
      layerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, points]);

  useEffect(() => {
    const handler = (evt: MapBrowserEvent) => {
      const layer = layerRef.current;
      if (!layer) return;

      const feature = map.forEachFeatureAtPixel(
        evt.pixel,
        (f: FeatureLike) => f,
        { layerFilter: (l) => l === layer, hitTolerance: 4 },
      );

      const data = feature?.get(POINT_KEY) as { point: RoutePoint; isStart: boolean; isEnd: boolean } | undefined;
      setHovered(data ?? null);
    };

    map.on("pointermove", handler);
    return () => {
      map.un("pointermove", handler);
    };
  }, [map]);

  if (points.length === 0) return null;

  return hovered ? (
    <OverlayPopup lat={hovered.point.lat} lng={hovered.point.lng} className="ol-tooltip" positioning="bottom-center">
      <div className="ol-tooltip-content">
        {hovered.isStart ? "🟢 Điểm đầu · " : hovered.isEnd ? "🔴 Điểm cuối · " : ""}
        {hovered.point.detectedAt}
      </div>
    </OverlayPopup>
  ) : null;
}

export default PlateRouteLayer;
