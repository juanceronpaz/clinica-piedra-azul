import { useState } from "react";

function Login({ onLogin }: any) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const login = async () => {
    if (!username || !password) {
      setError("Por favor ingrese usuario y contraseña");
      return;
    }
    setError("");
    setCargando(true);
    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        setError("Usuario o contraseña incorrectos");
        return;
      }
      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      onLogin();
    } catch (err) {
      setError("Error al conectar con el servidor");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-split">
      <div className="login-hero">
        <div className="login-hero-content">
          <div className="login-hero-logo">
            <svg viewBox="0 0 48 48" width="72" height="72" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ccfbf1" />
                  <stop offset="100%" stopColor="#5eead4" />
                </linearGradient>
              </defs>
              <path d="M24 4 L42 14 V26 C42 34 34 40 24 44 C14 40 6 34 6 26 V14 Z" fill="url(#heroGrad)" />
              <path d="M24 16 v16 M16 24 h16" stroke="#042f2e" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </div>
          <h1>Clínica PiedraAzul</h1>
          <p className="login-hero-tagline">Sistema Integral de Gestión de Citas Médicas</p>

          <div className="login-features">
            <div className="login-feature">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ccfbf1" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Agendamiento rápido y seguro</span>
            </div>
            <div className="login-feature">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ccfbf1" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Especialistas certificados</span>
            </div>
            <div className="login-feature">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ccfbf1" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Gestión de horarios flexible</span>
            </div>
            <div className="login-feature">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ccfbf1" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Notificaciones automáticas</span>
            </div>
          </div>

          <div className="login-hero-footer">
            <p>Universidad del Cauca</p>
            <small>Ingeniería de Software III · 2026</small>
          </div>
        </div>
      </div>

      <div className="login-form-panel">
        <div className="login-form-inner">
          <div className="login-form-header">
            <h2>Bienvenido de nuevo</h2>
            <p>Ingresa tus credenciales para continuar</p>
          </div>

          <div className="login-form-body">
            <div className="login-input-group">
              <label>Usuario</label>
              <input
                type="text"
                placeholder="Ingrese su usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && login()}
              />
            </div>

            <div className="login-input-group">
              <label>Contraseña</label>
              <input
                type="password"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && login()}
              />
            </div>

            {error && (
              <div className="login-error">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <button className="login-submit" onClick={login} disabled={cargando}>
              {cargando ? (
                <>
                  <span className="spinner"></span>
                  Ingresando...
                </>
              ) : (
                <>
                  Ingresar al Sistema
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>

            <div className="login-hint">
              <span>Credenciales de prueba: </span>
              <code>admin / admin</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;