import { useEffect, useState } from "react";
import Modal from "./Modal";
import { discoverOnvifCameras } from "../api/client";
import type { DiscoveredDevice } from "../api/client";
import type { Camera, CreateCameraInput, RecordingMode } from "../types/camera";
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
  const [sourceRtspUrl, setSourceRtspUrl] = useState("");
  const [latitude, setLatitude] = useState("10.776889");
  const [longitude, setLongitude] = useState("106.700806");
  const [zoneId, setZoneId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // A20/H8 — chế độ ghi hình.
  const [recordingMode, setRecordingMode] = useState<RecordingMode>("continuous");
  const [scheduleStart, setScheduleStart] = useState("00:00");
  const [scheduleEnd, setScheduleEnd] = useState("23:59");
  const [motionSeconds, setMotionSeconds] = useState("30");

  const minutesToHHmm = (m: number | null, fallback: string) => {
    if (m === null) return fallback;
    const h = Math.floor(m / 60).toString().padStart(2, "0");
    const mm = (m % 60).toString().padStart(2, "0");
    return `${h}:${mm}`;
  };
  const hhmmToMinutes = (v: string) => {
    const [h, m] = v.split(":").map(Number);
    return h * 60 + m;
  };

  useEffect(() => {
    if (!open) return;

    if (camera) {
      setName(camera.name);
      setAddress(camera.address);
      setStreamUrl(camera.streamUrl);
      setSourceRtspUrl(camera.sourceRtspUrl ?? "");
      setLatitude(String(camera.latitude));
      setLongitude(String(camera.longitude));
      setZoneId(camera.zoneId ? String(camera.zoneId) : "");
      setRecordingMode(camera.recordingMode ?? "continuous");
      setScheduleStart(minutesToHHmm(camera.recordingScheduleStartMinutes, "00:00"));
      setScheduleEnd(minutesToHHmm(camera.recordingScheduleEndMinutes, "23:59"));
      setMotionSeconds(String(camera.motionRecordingSeconds ?? 30));
    } else {
      setName("");
      setAddress("");
      setStreamUrl("");
      setSourceRtspUrl("");
      setLatitude("10.776889");
      setLongitude("106.700806");
      setZoneId("");
      setRecordingMode("continuous");
      setScheduleStart("00:00");
      setScheduleEnd("23:59");
      setMotionSeconds("30");
    }

    setError(null);
    setDiscoveredDevices(null);
    setDiscoverError(null);
  }, [camera, open]);

  // --- Tự tìm camera ONVIF trong LAN ---
  const [discovering, setDiscovering] = useState(false);
  const [discoveredDevices, setDiscoveredDevices] = useState<DiscoveredDevice[] | null>(null);
  const [discoverError, setDiscoverError] = useState<string | null>(null);

  const handleDiscover = async () => {
    setDiscovering(true);
    setDiscoverError(null);
    setDiscoveredDevices(null);

    try {
      const devices = await discoverOnvifCameras();
      setDiscoveredDevices(devices);
    } catch (err) {
      setDiscoverError(err instanceof Error ? err.message : "Tìm camera thất bại");
    } finally {
      setDiscovering(false);
    }
  };

  const handlePickDevice = (device: DiscoveredDevice) => {
    // Chỉ WS-Discovery không cho biết được đường dẫn RTSP/tài khoản thật của
    // camera — điền sẵn khung mẫu theo đúng IP tìm được, admin chỉnh lại
    // user/pass/path theo tài liệu của hãng camera đó.
    setSourceRtspUrl(`rtsp://admin:matkhau@${device.ipAddress}:554/`);
  };

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

    if (!streamUrl.trim() && !sourceRtspUrl.trim()) {
      setError("Cần điền Stream URL (nếu đã push sẵn) hoặc Nguồn RTSP camera thật");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const zoneIdValue = zoneId ? Number(zoneId) : null;
      const sourceRtspUrlValue = sourceRtspUrl.trim() || undefined;

      if (isEdit && camera) {
        await onEdit(camera.id, {
          name,
          address,
          streamUrl,
          sourceRtspUrl: sourceRtspUrlValue,
          latitude: lat,
          longitude: lng,
          zoneId: zoneIdValue ?? undefined,
          recordingMode,
          updateRecordingSchedule: true,
          recordingScheduleStartMinutes: hhmmToMinutes(scheduleStart),
          recordingScheduleEndMinutes: hhmmToMinutes(scheduleEnd),
          motionRecordingSeconds: Number(motionSeconds) || 30,
        });
      } else {
        await onCreate({
          name,
          address,
          streamUrl,
          sourceRtspUrl: sourceRtspUrlValue,
          latitude: lat,
          longitude: lng,
          zoneId: zoneIdValue,
          recordingMode,
          recordingScheduleStartMinutes: hhmmToMinutes(scheduleStart),
          recordingScheduleEndMinutes: hhmmToMinutes(scheduleEnd),
          motionRecordingSeconds: Number(motionSeconds) || 30,
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
          <span className="field-label">Nguồn RTSP camera thật (tuỳ chọn)</span>
          <input
            className="text-input"
            value={sourceRtspUrl}
            onChange={(e) => setSourceRtspUrl(e.target.value)}
            placeholder="rtsp://admin:matkhau@192.168.1.64:554/Streaming/Channels/101"
          />
          <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
            Điền khi camera có RTSP thật — hệ thống tự đăng ký với MediaMTX và tự tính Stream URL bên dưới, không cần gõ tay.
          </p>

          <button
            type="button"
            className="btn"
            style={{ marginTop: 6, fontSize: 12 }}
            onClick={handleDiscover}
            disabled={discovering}
          >
            {discovering ? "Đang quét mạng LAN..." : "🔍 Tìm camera ONVIF trong LAN"}
          </button>

          {discoverError && (
            <p style={{ color: "var(--danger)", fontSize: 11, marginTop: 4 }}>{discoverError}</p>
          )}

          {discoveredDevices && discoveredDevices.length === 0 && (
            <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
              Không tìm thấy camera ONVIF nào trong mạng LAN.
            </p>
          )}

          {discoveredDevices && discoveredDevices.length > 0 && (
            <ul style={{ listStyle: "none", padding: 0, marginTop: 6, display: "flex", flexDirection: "column", gap: 4 }}>
              {discoveredDevices.map((device) => (
                <li key={device.ipAddress}>
                  <button
                    type="button"
                    className="card"
                    style={{ width: "100%", textAlign: "left", padding: "6px 8px", fontSize: 12 }}
                    onClick={() => handlePickDevice(device)}
                  >
                    <strong>{device.ipAddress}</strong>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{device.deviceServiceUrl}</div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div style={{ marginBottom: 12 }}>
          <span className="field-label">Stream URL</span>
          <input
            className="text-input"
            value={streamUrl}
            onChange={(e) => setStreamUrl(e.target.value)}
            disabled={!!sourceRtspUrl.trim()}
            placeholder="http://.../index.m3u8 (bỏ trống nếu đã điền Nguồn RTSP ở trên)"
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

        <div style={{ marginBottom: 16 }}>
          <span className="field-label">Chế độ ghi hình</span>
          <select
            className="select-input"
            value={recordingMode}
            onChange={(e) => setRecordingMode(e.target.value as RecordingMode)}
            style={{ marginBottom: 8 }}
          >
            <option value="continuous">Liên tục</option>
            <option value="scheduled">Theo lịch biểu</option>
            <option value="motionOnly">Chỉ khi có chuyển động</option>
          </select>

          {recordingMode === "scheduled" && (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                type="time"
                className="text-input"
                value={scheduleStart}
                onChange={(e) => setScheduleStart(e.target.value)}
              />
              <span style={{ fontSize: 12 }}>→</span>
              <input
                type="time"
                className="text-input"
                value={scheduleEnd}
                onChange={(e) => setScheduleEnd(e.target.value)}
              />
            </div>
          )}

          {recordingMode === "motionOnly" && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12 }}>Ghi thêm sau chuyển động gần nhất:</span>
              <input
                type="number"
                min={5}
                className="text-input"
                style={{ width: 70 }}
                value={motionSeconds}
                onChange={(e) => setMotionSeconds(e.target.value)}
              />
              <span style={{ fontSize: 12 }}>giây</span>
            </div>
          )}
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
