import type { Camera } from "../types/camera";

interface Props {
  camera: Camera;
}

function CameraPopup({ camera }: Props) {
  return (
    <div
      style={{
        width: 280,
      }}
    >
      <h3>{camera.name}</h3>

      <p>
        Địa chỉ:
        <br />
        {camera.address}
      </p>

      <p>
        Trạng thái:
        <b
          style={{
            color: camera.status === "online" ? "green" : "gray",
          }}
        >
          {" "}
          {camera.status}
        </b>
      </p>

      <p>
        Signal:
        <b> {camera.signal}%</b>
      </p>

      <p>
        Last Seen:
        <br />
        {camera.lastSeen}
      </p>

      {camera.alert && (
        <div>
          <hr />

          <h4>🚨 Alert</h4>

          <p>
            Loại:
            {camera.alert.type}
          </p>

          <p>
            Mức độ:
            <b> {camera.alert.severity}</b>
          </p>
        </div>
      )}

      <video width="100%" controls muted>
        <source src={camera.streamUrl} type="video/mp4" />
      </video>
    </div>
  );
}

export default CameraPopup;
