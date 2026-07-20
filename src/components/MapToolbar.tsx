interface Props {
  showHeatmap: boolean;

  setShowHeatmap: (value: boolean) => void;

  showCamera: boolean;

  setShowCamera: (value: boolean) => void;

  fullscreen: () => void;

  reset: () => void;
}

function MapToolbar({
  showHeatmap,

  setShowHeatmap,

  showCamera,

  setShowCamera,

  fullscreen,

  reset,
}: Props) {
  return (
    <div
      style={{
        position: "absolute",

        right: 20,

        top: 20,

        zIndex: 2000,

        background: "#fff",

        padding: 10,

        borderRadius: 10,

        boxShadow: "0 4px 15px rgba(0,0,0,.2)",

        display: "flex",

        flexDirection: "column",

        gap: 10,
      }}
    >
      <button onClick={() => setShowHeatmap(!showHeatmap)}>🔥 Heatmap</button>

      <button onClick={() => setShowCamera(!showCamera)}>📷 Camera</button>

      <button onClick={reset}>🎯 Reset</button>

      <button onClick={fullscreen}>⛶ Fullscreen</button>
    </div>
  );
}

export default MapToolbar;
