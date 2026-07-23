import type { ReactNode } from "react";

interface Props {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  width?: number;
}

function Modal({ open, title, onClose, children, width = 420 }: Props) {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 6000,
        background: "rgba(15, 23, 42, 0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="panel-block"
        style={{
          width: "100%",
          maxWidth: width,
          maxHeight: "90vh",
          overflow: "auto",
          padding: 20,
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 14,
          }}
        >
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button className="btn btn-icon btn-ghost" onClick={onClose} title="Đóng">
            ✕
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

export default Modal;
