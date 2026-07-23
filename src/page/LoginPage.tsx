import { useState } from "react";
import { useAuth } from "../auth/AuthContext";

function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await login(username, password);
    } catch {
      setError("Sai tên đăng nhập hoặc mật khẩu");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-app)",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="panel-block"
        style={{ width: 340, padding: 28, boxShadow: "var(--shadow-lg)" }}
      >
        <h2 style={{ marginBottom: 4 }}>📹 VMS Login</h2>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>
          Đăng nhập để tiếp tục
        </p>

        <div style={{ marginBottom: 14 }}>
          <span className="field-label">Tên đăng nhập</span>
          <input
            className="text-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <span className="field-label">Mật khẩu</span>
          <input
            className="text-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <p style={{ color: "var(--danger)", fontSize: 12, marginBottom: 14 }}>{error}</p>
        )}

        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
