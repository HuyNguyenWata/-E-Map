import type { CameraFilter } from "../types/filter";

interface Props {
  filter: CameraFilter;

  setFilter: (value: CameraFilter) => void;

  total: number;

  result: number;
}

function FilterPanel({
  filter,

  setFilter,

  total,

  result,
}: Props) {
  return (
    <div className="panel-block" style={{ padding: 14 }}>
      <h3 className="panel-title">🔍 Camera Filter</h3>

      <input
        className="text-input"
        placeholder="Tên hoặc địa chỉ"
        value={filter.keyword}
        onChange={(e) =>
          setFilter({
            ...filter,

            keyword: e.target.value,
          })
        }
      />

      <div style={{ marginTop: 12 }}>
        <span className="field-label">Status</span>

        <div className="radio-row">
          <label
            className={
              "radio-pill" + (filter.status === "all" ? " radio-pill-active" : "")
            }
          >
            <input
              type="radio"
              checked={filter.status === "all"}
              onChange={() =>
                setFilter({
                  ...filter,

                  status: "all",
                })
              }
            />
            All
          </label>

          <label
            className={
              "radio-pill" +
              (filter.status === "online" ? " radio-pill-active" : "")
            }
          >
            <input
              type="radio"
              checked={filter.status === "online"}
              onChange={() =>
                setFilter({
                  ...filter,

                  status: "online",
                })
              }
            />
            🟢 Online
          </label>

          <label
            className={
              "radio-pill" +
              (filter.status === "offline" ? " radio-pill-active" : "")
            }
          >
            <input
              type="radio"
              checked={filter.status === "offline"}
              onChange={() =>
                setFilter({
                  ...filter,

                  status: "offline",
                })
              }
            />
            ⚪ Offline
          </label>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <span className="field-label">Alert</span>

        <select
          className="select-input"
          value={filter.alert}
          onChange={(e) =>
            setFilter({
              ...filter,

              alert: e.target.value as any,
            })
          }
        >
          <option value="all">Tất cả</option>

          <option value="critical">🔥 Critical</option>

          <option value="warning">⚠ Warning</option>

          <option value="none">Không cảnh báo</option>
        </select>
      </div>

      <p
        style={{
          marginTop: 12,
          fontSize: 12,
          color: "var(--text-muted)",
        }}
      >
        Hiển thị:{" "}
        <b style={{ color: "var(--text)" }}>
          {result}/{total}
        </b>{" "}
        camera
      </p>
    </div>
  );
}

export default FilterPanel;
