import { useEffect, useState } from "react";

function Header() {
  const [usuario, setUsuario] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUsuario(payload.username || payload.sub || "Admin");
      } catch {
        setUsuario("Admin");
      }
    }
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <header className="header">
      <div className="header-logo">
        <div className="logo-circle">
          <svg viewBox="0 0 48 48" width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 4 L42 14 V26 C42 34 34 40 24 44 C14 40 6 34 6 26 V14 Z" fill="white" fillOpacity="0.15" stroke="white" strokeWidth="2" />
            <path d="M24 16 v16 M16 24 h16" stroke="white" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>
        <div className="logo-text">
          <h1>Clínica PiedraAzul</h1>
          <span className="header-subtitle">Centro de Especialidades Médicas</span>
        </div>
      </div>
      <div className="header-user">
        <div className="user-avatar">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="12" cy="7" r="4" stroke="white" strokeWidth="2"/>
          </svg>
        </div>
        <div className="user-info">
          <span className="user-greeting">Bienvenido</span>
          <span className="user-name">{usuario}</span>
        </div>
        <button className="logout-btn" onClick={cerrarSesion}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Salir
        </button>
      </div>
    </header>
  );
}

export default Header;