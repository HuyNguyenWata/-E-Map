interface Props {
  value: string;
  onChange: (value: string) => void;
}

function SearchBox({ value, onChange }: Props) {
  return (
    <div
      style={{
        position: "absolute",
        top: 250,
        left: 20,
        zIndex: 1000,
        background: "#fff",
        padding: 12,
        borderRadius: 8,
        width: 300,
        boxShadow: "0 2px 10px rgba(0,0,0,.2)",
      }}
    >
      <input
        type="text"
        placeholder="Tìm camera..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          fontSize: 16,
        }}
      />
    </div>
  );
}

export default SearchBox;
