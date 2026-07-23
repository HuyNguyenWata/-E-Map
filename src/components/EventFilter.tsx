import { useTranslation } from "react-i18next";

interface Props {
  value: string;

  onChange: (value: string) => void;
}

function EventFilter({ value, onChange }: Props) {
  const { t } = useTranslation();

  return (
    <select
      className="select-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        marginBottom: 10,
      }}
    >
      <option value="all">{t("filter.all")}</option>

      <option value="fire">🔥 Fire</option>

      <option value="person">👤 Person</option>

      <option value="vehicle">🚗 Vehicle</option>

      <option value="smoke">Smoke</option>
    </select>
  );
}

export default EventFilter;
