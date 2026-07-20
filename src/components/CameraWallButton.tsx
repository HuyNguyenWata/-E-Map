interface Props {
  open: () => void;

  count: number;
}

function CameraWallButton({
  open,

  count,
}: Props) {
  return <button onClick={open}>📺 Camera Wall ({count})</button>;
}

export default CameraWallButton;
