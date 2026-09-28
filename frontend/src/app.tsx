import { useState, useEffect } from "react";
import Login from "./app/components/Login";
import Sidebar from "./app/components/Sidebar";
import Header from "./app/components/Header";
import Footer from "./app/components/Footer";
import Citas from "./app/pages/citas";
import Medicos from "./app/pages/medicos";
import Pacientes from "./app/pages/pacientes";
import Configuracion from "./app/pages/configuracion";
import AgendarWeb from "./app/components/AgendarWeb";
import "./style.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [vista, setVista] = useState("citas");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  const renderVista = () => {
    switch (vista) {
      case "citas":
        return <Citas />;
      case "medicos":
        return <Medicos />;
      case "pacientes":
        return <Pacientes />;
      case "agendar-web":
        return <AgendarWeb />;
      case "configuracion":
        return <Configuracion />;
      default:
        return <Citas />;
    }
  };

  return (
    <div className="app-container">
      <Header />
      <div className="main-layout">
        <Sidebar setVista={setVista} />
        <main className="main-content">
          {renderVista()}
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default App;
