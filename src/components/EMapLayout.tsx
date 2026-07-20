import type { ReactNode } from "react";

interface Props {
  left: ReactNode;
  center: ReactNode;
  right: ReactNode;
}

function EMapLayout({ left, center, right }: Props) {
  return (
    <div
      style={{
        display: "grid",

        gridTemplateColumns: "320px minmax(0, 1fr) 380px",

        width: "100vw",
        height: "100vh",

        overflow: "hidden",

        background: "var(--bg-app)",
      }}
    >
      {/* LEFT */}
      <aside
        style={{
          minWidth: 0,
          minHeight: 0,

          height: "100%",

          background: "var(--panel-bg)",

          borderRight: "1px solid var(--border)",

          overflow: "hidden",

          zIndex: 1000,
          boxShadow: "var(--shadow-sm)",
        }}
      >
        {left}
      </aside>

      {/* CENTER */}
      <main
        style={{
          minWidth: 0,
          minHeight: 0,

          position: "relative",

          overflow: "hidden",
        }}
      >
        {center}
      </main>

      {/* RIGHT */}
      <aside
        style={{
          minWidth: 0,
          minHeight: 0,

          height: "100%",

          background: "var(--panel-bg)",

          borderLeft: "1px solid var(--border)",

          overflow: "hidden",

          zIndex: 1000,
          boxShadow: "var(--shadow-sm)",
        }}
      >
        {right}
      </aside>
    </div>
  );
}

export default EMapLayout;
