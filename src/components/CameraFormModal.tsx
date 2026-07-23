import { useEffect, useState } from "react";
import Modal from "./Modal";
import type { Camera, CreateCameraInput } from "../types/camera";
import type { Zone } from "../types/zone";

interface Props {
  open: boolean;
  onClose: () => void;
  camera?: Camera | null; // truyền vào => chế độ sửa, không truyền => chế độ thêm
  zones: Zone[];
  onCreate: (input: CreateCameraInput) => Promise<Camera>;
  onEdit: (id: number, data: Partial<Camera>) => Promise<Camera>;
}

function CameraFormModal({ open, onClose, camera, zones, onCreate, onEdit }: Props) {
  const isEdit = !!camera;

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [streamUrl, setStreamUrl] = useState("");
  const [latitude, setLatitude] = useState("10.776889");
  const [longitude, setLongitude] = useState("106.700806");
  const [zoneId, setZoneId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    if (camera) {
      setName(camera.name);
      setAddress(camera.address);
      setStreamUrl(camera.streamUrl);
      setLatitude(String(camera.latitude));
      setLongitude(String(camera.longitude));
      setZoneId(camera.zoneId ? String(camera.zoneId) : "");
    } else {
      setName("");
      setAddress("");
      setStreamUrl("");
      setLatitude("10.776889");
      setLongitude("106.700806");
      setZoneId("");
    }

    setError(null);
  }, [camera, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (!name.trim()) {
      setError("Tên camera không được để trống");
      return;
    }

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      setError("Vĩ độ/kinh độ không hợp lệ");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const zoneIdValue = zoneId ? Number(zoneId) : null;

      if (isEdit && camera) {
        await onEdit(camera.id, {
          name,
          address,
          streamUrl,
          latitude: lat,
          longitude: lng,
          zoneId: zoneIdValue ?? undefined,
        });
      } else {
        await onCreate({
          name,
          address,
          streamUrl,
          latitude: lat,
          longitude: lng,
          zoneId: zoneIdValue,
        });
      }

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra, thử lại sau");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} title={isEdit ? "Sửa camera" : "Thêm camera"} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <span className="field-label">Tên camera</span>
          <input
            className="text-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Camera Cổng Chính"
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <span className="field-label">Địa chỉ</span>
          <input
            className="text-input"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Quận 1, TP.HCM"
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <span className="field-label">Stream URL</span>
          <input
            className="text-input"
            value={streamUrl}
            onChange={(e) => setStreamUrl(e.target.value)}
            placeholder="rtsp://... hoặc http://.../index.m3u8"
          />
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <span className="field-label">Vĩ độ (lat)</span>
            <input
              className="text-input"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
            />
          </div>
          <div style={{ flex: 1 }}>
            <span className="field-label">Kinh độ (lng)</span>
            <input
              className="text-input"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
            />
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <span className="field-label">Zone</span>
          <select className="select-input" value={zoneId} onChange={(e) => setZoneId(e.target.value)}>
            <option value="">-- Không thuộc zone --</option>
            {zones.map((zone) => (
              <option key={zone.id} value={zone.id}>
                {zone.name}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <p style={{ color: "var(--danger)", fontSize: 12, marginBottom: 12 }}>{error}</p>
        )}

        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" className="btn" style={{ flex: 1 }} onClick={onClose}>
            Huỷ
          </button>
          <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={submitting}>
            {submitting ? "Đang lưu..." : isEdit ? "Lưu thay đổi" : "Thêm camera"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default CameraFormModal;
