import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../auth/AuthContext";
import LanguageSwitcher from "../components/LanguageSwitcher";

function LoginPage() {
  const { t } = useTranslation();
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
      setError(t("login.error"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        background: "var(--bg-app)",
      }}
    >
      <div style={{ width: 340, display: "flex", justifyContent: "flex-end" }}>
        <LanguageSwitcher />
      </div>

      <form
        onSubmit={handleSubmit}
        className="panel-block"
        style={{ width: 340, padding: 28, boxShadow: "var(--shadow-lg)" }}
      >
        <h2 style={{ marginBottom: 4 }}>📹 {t("login.title")}</h2>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>
          {t("login.subtitle")}
        </p>

        <div style={{ marginBottom: 14 }}>
          <span className="field-label">{t("login.username")}</span>
          <input
            className="text-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <span className="field-label">{t("login.password")}</span>
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
          {submitting ? t("login.submitting") : t("login.submit")}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
