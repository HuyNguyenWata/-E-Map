import Dashboard from "./Dashboard";
import Sidebar from "./Sidebar";
import FilterPanel from "./FilterPanel";

import type { Camera } from "../types/camera";
import type { CameraFilter } from "../types/filter";

interface Props {
  cameras: Camera[];

  filtered: Camera[];

  filter: CameraFilter;

  setFilter: (value: CameraFilter) => void;

  onSelect: (camera: Camera) => void;
}

function LeftPanel({ cameras, filtered, filter, setFilter, onSelect }: Props) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",

        padding: 20,

        display: "flex",
        flexDirection: "column",

        gap: 20,

        boxSizing: "border-box",

        overflow: "hidden",

        background: "#f8fafc",
      }}
    >
      {/* Dashboard */}
      <div
        style={{
          flexShrink: 0,
        }}
      >
        <Dashboard cameras={cameras} alerts={[]} />
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
        style={{
          flex: 1,

          minHeight: 0,

          overflowY: "auto",

          paddingRight: 4,
        }}
      >
        <Sidebar cameras={filtered} onSelect={onSelect} />
      </div>
    </div>
  );
}

export default LeftPanel;
