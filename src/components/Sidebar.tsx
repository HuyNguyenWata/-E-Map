import type { Camera } from "../types/camera";

interface Props {
  cameras: Camera[];
  onSelect: (camera: Camera) => void;
}

function Sidebar({ cameras, onSelect }: Props) {
  return (
    <div
      style={{
        width: "100%",

        display: "flex",

        flexDirection: "column",

        gap: 12,
      }}
    >
      <h3>Danh sách Camera</h3>

      {cameras.map((camera) => (
        <div
          key={camera.id}
          onClick={() => onSelect(camera)}
          style={{
            cursor: "pointer",

            padding: 12,

            background: "#fff",

            border: "1px solid #ddd",

            borderRadius: 8,
          }}
        >
          <b>{camera.name}</b>

          <br />

          {camera.address}

          <br />

          <span
            style={{
              color: camera.status === "online" ? "green" : "red",
            }}
          >
            {camera.status}
          </span>
        </div>
      ))}
    </div>
  );
}
export default Sidebar;
