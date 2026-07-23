import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

  return (
    <div className="panel-block" style={{ padding: 14 }}>
      <h3 className="panel-title">{t("filter.title")}</h3>

      <input
        className="text-input"
        placeholder={t("filter.keywordPlaceholder")}
        value={filter.keyword}
        onChange={(e) =>
          setFilter({
            ...filter,

            keyword: e.target.value,
          })
        }
      />

      <div style={{ marginTop: 12 }}>
        <span className="field-label">{t("filter.status")}</span>

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
            {t("filter.all")}
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
            {t("filter.online")}
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
            {t("filter.offline")}
          </label>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <span className="field-label">{t("filter.alertLabel")}</span>

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
          <option value="all">{t("filter.all")}</option>

          <option value="critical">{t("filter.critical")}</option>

          <option value="warning">{t("filter.warning")}</option>

          <option value="none">{t("filter.none")}</option>
        </select>
      </div>

      <p
        style={{
          marginTop: 12,
          fontSize: 12,
          color: "var(--text-muted)",
        }}
      >
        {t("filter.showing")}:{" "}
        <b style={{ color: "var(--text)" }}>
          {result}/{total}
        </b>{" "}
        {t("common.camera")}
      </p>
    </div>
  );
}

export default FilterPanel;
