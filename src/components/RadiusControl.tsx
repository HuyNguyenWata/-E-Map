interface Props {
  radius: number;

  setRadius: (value: number) => void;
}

function RadiusControl({ radius, setRadius }: Props) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 20,
        left: 20,
        zIndex: 1000,
        background: "#fff",
        padding: 15,
        borderRadius: 10,
        boxShadow: "0 4px 15px rgba(0,0,0,.2)",
      }}
    >
      <b>Bán kính giám sát</b>

      <select
        value={radius}
        onChange={(e) => setRadius(Number(e.target.value))}
        style={{
          display: "block",
          marginTop: 10,
          padding: 8,
        }}
      >
        <option value={100}>100m</option>

        <option value={500}>500m</option>

        <option value={1000}>1km</option>

        <option value={2000}>2km</option>
      </select>
    </div>
  );
}

export default RadiusControl;
