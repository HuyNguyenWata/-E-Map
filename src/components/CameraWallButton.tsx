interface Props {
  open: () => void;

  count: number;
}

function CameraWallButton({
  open,

  count,
}: Props) {
  return (
    <button className="btn btn-primary btn-fab" onClick={open}>
      📺 Camera Wall{count > 0 ? ` (${count})` : ""}
    </button>
  );
}

export default CameraWallButton;
