import { TileLayer } from "react-leaflet";

interface Props {
  dark: boolean;
}

function BaseMap({ dark }: Props) {
  return (
    <TileLayer
      url={
        dark
          ? "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
          : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      }
    />
  );
}

export default BaseMap;
