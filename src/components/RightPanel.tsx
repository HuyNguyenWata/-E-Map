import CameraDetailPanel from "./CameraDetailPanel";

import type { Camera } from "../types/camera";

import type { CameraAlert } from "../types/alert";

interface Props {
  camera: Camera | null;

  alerts: CameraAlert[];

  close: () => void;
}

function RightPanel({
  camera,

  alerts,

  close,
}: Props) {
  return <CameraDetailPanel camera={camera} alerts={alerts} onClose={close} />;
}

export default RightPanel;
