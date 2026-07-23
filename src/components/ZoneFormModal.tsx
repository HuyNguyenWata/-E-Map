import { useEffect, useState } from "react";
import Modal from "./Modal";
import type { CreateZoneInput, Zone } from "../types/zone";

const COLOR_OPTIONS = [
  { label: "Xanh dương", value: "#2563eb" },
  { label: "Xanh lá", value: "#16a34a" },
  { label: "Đỏ", value: "#dc2626" },
  { label: "Cam", value: "#d97706" },
  { label: "Tím", value: "#7c3aed" },
];

interface Props {
  open: boolean;
  polygon: [number, number][] | null;
  onClose: () => void;
  onCreate: (input: CreateZoneInput) => Promise<Zone>;
}

function ZoneFormModal({ open, polygon, onClose, onCreate }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(COLOR_OPTIONS[0].value);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setName("");
      setDescription("");
      setColor(COLOR_OPTIONS[0].value);
      setError(null);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Tên khu vực không được để trống");
      return;
    }

    if (!polygon || polygon.length < 3) {
      setError("Chưa có vùng vẽ hợp lệ");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await onCreate({ name, description, color, polygon });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra, thử lại sau");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} title="Đặt tên khu vực mới" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <span className="field-label">Tên khu vực</span>
          <input
            className="text-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Bãi xe, Kho, Tòa nhà A..."
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <span className="field-label">Mô tả</span>
          <input
            className="text-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <span className="field-label">Màu hiển thị</span>
          <div style={{ display: "flex", gap: 8 }}>
            {COLOR_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setColor(option.value)}
                title={option.label}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: option.value,
                  border:
                    color === option.value
                      ? "3px solid var(--text)"
                      : "1px solid var(--border)",
                  cursor: "pointer",
                }}
              />
            ))}
          </div>
        </div>

        {polygon && (
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>
            Vùng vẽ gồm {polygon.length} điểm
          </p>
        )}

        {error && (
          <p style={{ color: "var(--danger)", fontSize: 12, marginBottom: 12 }}>{error}</p>
        )}

        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" className="btn" style={{ flex: 1 }} onClick={onClose}>
            Huỷ
          </button>
          <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={submitting}>
            {submitting ? "Đang lưu..." : "Tạo khu vực"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default ZoneFormModal;
