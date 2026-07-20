import Dashboard from "./Dashboard";
import Sidebar from "./Sidebar";
import FilterPanel from "./FilterPanel";
import ZoneList from "./ZoneList";
import type { ZoneWithCamera } from "../types/zoneWithCamera";
import type { Camera } from "../types/camera";
import type { CameraFilter } from "../types/filter";

interface Props {
  cameras: Camera[];

  filtered: Camera[];

  filter: CameraFilter;

  setFilter: (value: CameraFilter) => void;

  onSelect: (camera: Camera) => void;
  zones: ZoneWithCamera[];

  selectedZone: number | null;

  onSelectZone: (zone: ZoneWithCamera) => void;
  onClear: () => void;
}

function LeftPanel({
  cameras,
  filtered,
  filter,
  setFilter,
  onSelect,
  zones,
  selectedZone,
  onSelectZone,
  onClear,
}: Props) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",

        padding: 16,

        display: "flex",
        flexDirection: "column",

        gap: 16,

        boxSizing: "border-box",

        overflow: "hidden",

        background: "var(--panel-bg-soft)",
      }}
    >
      {/* Dashboard */}
      <div
        className="scroll-area"
        style={{
          flexShrink: 0,
          maxHeight: "45%",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          paddingRight: 2,
        }}
      >
        <Dashboard cameras={cameras} alerts={[]} />
        <button className="btn btn-block" onClick={() => onClear()}>
          Hiển thị tất cả
        </button>
        <ZoneList
          zones={zones}
          selectedZone={selectedZone}
          onSelect={onSelectZone}
        />
      </div>
      {/* Filter */}
      <div
        style={{
          flexShrink: 0,
        }}
      >
        <FilterPanel
          filter={filter}
          setFilter={setFilter}
          total={cameras.length}
          result={filtered.length}
        />
      </div>
      {/* Camera List */}
      <div
        className="scroll-area"
        style={{
          flex: 1,

          minHeight: 0,

          paddingRight: 4,
        }}
      >
        <Sidebar cameras={filtered} onSelect={onSelect} />
      </div>
    </div>
  );
}

export default LeftPanel;
