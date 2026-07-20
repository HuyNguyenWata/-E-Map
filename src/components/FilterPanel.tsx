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
    <div>
      <h3>🔍 Camera Filter</h3>

      <input
        placeholder="Tên hoặc địa chỉ"
        value={filter.keyword}
        onChange={(e) =>
          setFilter({
            ...filter,

            keyword: e.target.value,
          })
        }
      />

      <hr />

      <h4>Status</h4>

      <label>
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

      <label>
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

      <label>
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

      <hr />

      <h4>Alert</h4>

      <select
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

      <p>
        Hiển thị:
        <b>
          {" "}
          {result}/{total}
        </b>
        camera
      </p>
    </div>
  );
}

export default FilterPanel;
