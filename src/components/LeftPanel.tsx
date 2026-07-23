import Dashboard from "./Dashboard";
import Sidebar from "./Sidebar";
import { useAuth } from "../auth/AuthContext";
import FilterPanel from "./FilterPanel";
import ZoneList from "./ZoneList";
import EventTrendChart from "./EventTrendChart";
import SystemHealthPanel from "./SystemHealthPanel";
import ZoneStatsChart from "./ZoneStatsChart";
import type { ZoneWithCamera } from "../types/zoneWithCamera";
import type { Camera } from "../types/camera";
import type { CameraAlert } from "../types/alert";
import type { CameraFilter } from "../types/filter";
import type { SystemHealth } from "../types/systemHealth";
import type { AlertStats } from "../types/alertStats";
import type { ZoneAlertStat } from "../types/zoneStats";

interface Props {
  cameras: Camera[];

  filtered: Camera[];

  alerts: CameraAlert[];

  health: SystemHealth | null;

  alertStats: AlertStats | null;

  zoneStats: ZoneAlertStat[];

  filter: CameraFilter;

  setFilter: (value: CameraFilter) => void;

  onSelect: (camera: Camera) => void;
  zones: ZoneWithCamera[];

  selectedZone: number | null;

  onSelectZone: (zone: ZoneWithCamera) => void;
  onClear: () => void;
  onAddCamera: () => void;
}

function LeftPanel({
  cameras,
  filtered,
  alerts,
  health,
  alertStats,
  zoneStats,
  filter,
  setFilter,
  onSelect,
  zones,
  selectedZone,
  onSelectZone,
  onClear,
  onAddCamera,
}: Props) {
  const { user, logout } = useAuth();

  return (
    <div
      style={{
        width: "100%",
        height: "100%",

        padding: 16,

        display: "flex",
        flexDirection: "column",

        boxSizing: "border-box",

        overflow: "hidden",

        background: "var(--panel-bg-soft)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
          flexShrink: 0,
        }}
      >
        <div style={{ fontSize: 13 }}>
          👤 <b>{user?.username}</b>{" "}
          <span
            className={"badge " + (user?.role === "admin" ? "badge-online" : "badge-offline")}
            style={{ marginLeft: 4 }}
          >
            {user?.role === "admin" ? "Admin" : "Viewer"}
          </span>
        </div>

        <button className="btn btn-sm" onClick={logout}>
          Đăng xuất
        </button>
      </div>

      {/* Toàn bộ sidebar cuộn như MỘT vùng duy nhất — tách 2 vùng cuộn riêng
          trước đây khiến người dùng bị "kẹt" ở Zone, không cuộn tiếp xuống
          được danh sách camera bên dưới. */}
      <div
        className="scroll-area"
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          paddingRight: 2,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Dashboard cameras={cameras} alerts={alerts} />

          <div className="panel-block" style={{ padding: 14 }}>
            <SystemHealthPanel health={health} />
          </div>

          <div className="panel-block" style={{ padding: 14 }}>
            <EventTrendChart stats={alertStats} />
          </div>

          <div className="panel-block" style={{ padding: 14 }}>
            <ZoneStatsChart stats={zoneStats} />
          </div>

          <button className="btn btn-block" onClick={() => onClear()}>
            Hiển thị tất cả
          </button>
          <ZoneList
            zones={zones}
            selectedZone={selectedZone}
            onSelect={onSelectZone}
          />
        </div>

        {/* Dính lại (sticky) khi cuộn qua để luôn thao tác lọc được mà không
            phải cuộn ngược lên trên. */}
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            background: "var(--panel-bg-soft)",
            paddingTop: 4,
            paddingBottom: 4,
          }}
        >
          <FilterPanel
            filter={filter}
            setFilter={setFilter}
            total={cameras.length}
            result={filtered.length}
          />
        </div>

        <Sidebar cameras={filtered} onSelect={onSelect} onAddCamera={onAddCamera} />
      </div>
    </div>
  );
}

export default LeftPanel;
