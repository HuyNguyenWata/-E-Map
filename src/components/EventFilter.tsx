interface Props {
  value: string;

  onChange: (value: string) => void;
}

function EventFilter({ value, onChange }: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: 8,
        marginBottom: 10,
      }}
    >
      <option value="all">Tất cả</option>

      <option value="fire">🔥 Fire</option>

      <option value="person">👤 Person</option>

      <option value="vehicle">🚗 Vehicle</option>

      <option value="smoke">Smoke</option>
    </select>
  );
}

export default EventFilter;
