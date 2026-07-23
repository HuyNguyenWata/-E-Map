import "./App.css";
import EMap from "./page/EMap";
import LoginPage from "./page/LoginPage";
import { AuthProvider, useAuth } from "./auth/AuthContext";

function AppContent() {
  const { user } = useAuth();

  if (!user) return <LoginPage />;

  return <EMap />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
