import { useEffect, useState } from "react";
import { getPacientes, crearPaciente, actualizarPaciente, eliminarPaciente } from "../services/pacientes.service";

function Pacientes() {
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [documento, setDocumento] = useState("");
  const [celular, setCelular] = useState("");
  const [genero, setGenero] = useState<"Hombre" | "Mujer" | "Otro">("Otro");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [email, setEmail] = useState("");
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const [vistaActiva, setVistaActiva] = useState<"lista" | "nuevo">("lista");

  const cargar = async () => {
    const data = await getPacientes();
    setPacientes(data);
  };

  useEffect(() => { cargar(); }, []);

  const guardar = async () => {
    const pacienteData = {
      nombres,
      apellidos,
      documento,
      celular,
      genero,
      fechaNacimiento: fechaNacimiento || null,
      email: email || null
    };

    if (editandoId) {
      await actualizarPaciente(editandoId, pacienteData);
      setEditandoId(null);
    } else {
      await crearPaciente(pacienteData);
    }

    limpiarFormulario();
    setVistaActiva("lista");
    cargar();
  };

  const limpiarFormulario = () => {
    setNombres("");
    setApellidos("");
    setDocumento("");
    setCelular("");
    setGenero("Otro");
    setFechaNacimiento("");
    setEmail("");
  };

  const eliminar = async (id: number) => {
    if (!confirm("¿Eliminar este paciente? Se eliminarán también sus citas asociadas.")) return;
    try {
      await eliminarPaciente(id);
      cargar();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const editar = (p: any) => {
    setNombres(p.nombres || "");
    setApellidos(p.apellidos || "");
    setDocumento(p.documento || "");
    setCelular(p.celular || "");
    setGenero(p.genero || "Otro");
    setFechaNacimiento(p.fechaNacimiento || "");
    setEmail(p.email || "");
    setEditandoId(p.id);
    setVistaActiva("nuevo");
  };

  const cancelarEdicion = () => {
    limpiarFormulario();
    setEditandoId(null);
    setVistaActiva("lista");
  };

  const totalPacientes = pacientes.length;
  const totalHombres = pacientes.filter(p => p.genero === "Hombre").length;
  const totalMujeres = pacientes.filter(p => p.genero === "Mujer").length;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Pacientes</h2>
          <p>Gestión de pacientes registrados en el sistema</p>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon kpi-icon-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className="kpi-content">
            <p className="kpi-label">Total</p>
            <p className="kpi-value">{totalPacientes}</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon kpi-icon-cyan">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="5" />
              <path d="M20 21a8 8 0 0 0-16 0" />
            </svg>
          </div>
          <div className="kpi-content">
            <p className="kpi-label">Hombres</p>
            <p className="kpi-value">{totalHombres}</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon kpi-icon-teal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="5" />
              <path d="M20 21a8 8 0 0 0-16 0" />
            </svg>
          </div>
          <div className="kpi-content">
            <p className="kpi-label">Mujeres</p>
            <p className="kpi-value">{totalMujeres}</p>
          </div>
        </div>
      </div>

      <div className="tab-container">
        <div className="tab-buttons">
          <button
            className={`tab-btn ${vistaActiva === "lista" ? "active" : ""}`}
            onClick={() => setVistaActiva("lista")}
          >
            Lista de Pacientes
          </button>
          <button
            className={`tab-btn ${vistaActiva === "nuevo" ? "active" : ""}`}
            onClick={() => setVistaActiva("nuevo")}
          >
            {editandoId ? "Editar Paciente" : "Nuevo Paciente"}
          </button>
        </div>
      </div>

      {vistaActiva === "lista" ? (
        <div>
          {pacientes.length === 0 ? (
            <div className="card-custom">
              <div className="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <p>No hay pacientes registrados</p>
                <small>Agrega un nuevo paciente para comenzar</small>
              </div>
            </div>
          ) : (
            pacientes.map((p: any) => (
              <div className="card-custom paciente-card" key={p.id}>
                <div className="paciente-content">
                  <div className="paciente-avatar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div className="paciente-info">
                    <strong className="paciente-nombre">{p.nombres} {p.apellidos}</strong>
                    <div className="paciente-detalles">
                      <span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        {p.documento}
                      </span>
                      <span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                        {p.celular}
                      </span>
                      <span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        {p.genero}
                      </span>
                    </div>
                    <div className="paciente-detalles">
                      {p.email && (
                        <span>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                          </svg>
                          {p.email}
                        </span>
                      )}
                      {p.fechaNacimiento && (
                        <span>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                          {p.fechaNacimiento}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="paciente-actions">
                  <button className="btn-edit" onClick={() => editar(p)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Editar
                  </button>
                  <button className="btn-delete" onClick={() => eliminar(p.id)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="card-custom">
          <h4>{editandoId ? "Editar Paciente" : "Nuevo Paciente"}</h4>

          <div className="form-row">
            <div className="form-group">
              <label>Nombres *</label>
              <input
                placeholder="Nombres"
                value={nombres}
                onChange={(e) => setNombres(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Apellidos *</label>
              <input
                placeholder="Apellidos"
                value={apellidos}
                onChange={(e) => setApellidos(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Documento de identidad *</label>
              <input
                placeholder="Documento"
                value={documento}
                onChange={(e) => setDocumento(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Celular *</label>
              <input
                placeholder="Celular"
                value={celular}
                onChange={(e) => setCelular(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Género *</label>
              <select
                value={genero}
                onChange={(e) => setGenero(e.target.value as "Hombre" | "Mujer" | "Otro")}
              >
                <option value="Hombre">Hombre</option>
                <option value="Mujer">Mujer</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div className="form-group">
              <label>Fecha de nacimiento</label>
              <input
                type="date"
                value={fechaNacimiento}
                onChange={(e) => setFechaNacimiento(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Correo electrónico</label>
            <input
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button className="btn btn-primary" onClick={guardar}>
              {editandoId ? "Actualizar Paciente" : "Guardar Paciente"}
            </button>
            {editandoId && (
              <button className="btn btn-secondary" onClick={cancelarEdicion}>
                Cancelar
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Pacientes;