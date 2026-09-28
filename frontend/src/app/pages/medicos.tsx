import { useEffect, useState } from "react";
import {
  getMedicos,
  crearMedico,
  actualizarMedico,
  eliminarMedico,
  getConfiguracionMedico,
  guardarConfiguracionMedico,
  getConfiguracionGlobal,
  guardarConfiguracionGlobal
} from "../services/medicos.service";

const ESPECIALIDADES = [
  "Medicina General",
  "Pediatría",
  "Cardiología",
  "Dermatología",
  "Psicología",
  "Fisioterapia",
  "Ginecología",
  "Oftalmología",
  "Otorrinolaringología",
  "Traumatología",
  "Neurología",
  "Nutrición"
];

function Medicos() {
  const [medicos, setMedicos] = useState<any[]>([]);
  const [nombre, setNombre] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const [vistaActiva, setVistaActiva] = useState<"lista" | "nuevo">("lista");

  const [ventanaSemanas, setVentanaSemanas] = useState(4);
  const [cargandoGlobal, setCargandoGlobal] = useState(false);

  const [medicoSeleccionado, setMedicoSeleccionado] = useState<any>(null);
  const [diasAtencion, setDiasAtencion] = useState<string[]>([]);
  const [horaInicio, setHoraInicio] = useState("08:00");
  const [horaFin, setHoraFin] = useState("17:00");
  const [intervalo, setIntervalo] = useState(30);
  const [mostrarConfig, setMostrarConfig] = useState(false);
  const [cargandoConfig, setCargandoConfig] = useState(false);

  const diasSemana = ["LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO", "DOMINGO"];

  const cargarMedicos = async () => {
    const data = await getMedicos();
    setMedicos(data);
  };

  const cargarConfigGlobal = async () => {
    const config = await getConfiguracionGlobal();
    setVentanaSemanas(config.ventanaSemanas);
  };

  useEffect(() => {
    cargarMedicos();
    cargarConfigGlobal();
  }, []);

  const guardarConfigGlobal = async () => {
    setCargandoGlobal(true);
    try {
      await guardarConfiguracionGlobal(ventanaSemanas);
      alert("Configuración global guardada exitosamente");
    } catch (error) {
      console.error("Error guardando configuración global:", error);
      alert("Error al guardar la configuración global");
    } finally {
      setCargandoGlobal(false);
    }
  };

  const guardarMedico = async () => {
    if (!nombre || !especialidad) {
      alert("Por favor complete todos los campos");
      return;
    }

    if (editandoId) {
      await actualizarMedico(editandoId, { nombre, especialidad });
      setEditandoId(null);
    } else {
      await crearMedico({ nombre, especialidad });
    }

    setNombre("");
    setEspecialidad("");
    setVistaActiva("lista");
    cargarMedicos();
  };

  const eliminarMedicoHandler = async (id: number) => {
    if (!confirm("¿Eliminar este especialista? Se eliminarán también sus citas y configuración asociadas.")) return;
    try {
      await eliminarMedico(id);
      cargarMedicos();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const editarMedico = (m: any) => {
    setNombre(m.nombre);
    setEspecialidad(m.especialidad);
    setEditandoId(m.id);
    setVistaActiva("nuevo");
  };

  const cancelarEdicion = () => {
    setNombre("");
    setEspecialidad("");
    setEditandoId(null);
    setVistaActiva("lista");
  };

  const abrirConfiguracion = async (medico: any) => {
    setMedicoSeleccionado(medico);
    setCargandoConfig(true);
    setMostrarConfig(true);

    const config = await getConfiguracionMedico(medico.id);

    if (config) {
      setDiasAtencion(config.diasAtencion || ["LUNES", "MIÉRCOLES", "VIERNES"]);
      setHoraInicio(config.horaInicio || "08:00");
      setHoraFin(config.horaFin || "17:00");
      setIntervalo(config.intervaloMinutos || 30);
    } else {
      setDiasAtencion(["LUNES", "MIÉRCOLES", "VIERNES"]);
      setHoraInicio("08:00");
      setHoraFin("17:00");
      setIntervalo(30);
    }

    setCargandoConfig(false);
  };

  const guardarConfiguracion = async () => {
    if (diasAtencion.length === 0) {
      alert("Debe seleccionar al menos un día de atención");
      return;
    }

    setCargandoConfig(true);
    try {
      await guardarConfiguracionMedico(medicoSeleccionado.id, {
        diasAtencion,
        horaInicio,
        horaFin,
        intervaloMinutos: intervalo
      });

      alert(`Configuración guardada para ${medicoSeleccionado.nombre}`);
      setMostrarConfig(false);
      cargarMedicos();

    } catch (error) {
      console.error("Error guardando configuración:", error);
      alert("Error al guardar la configuración");
    } finally {
      setCargandoConfig(false);
    }
  };

  const toggleDia = (dia: string) => {
    if (diasAtencion.includes(dia)) {
      setDiasAtencion(diasAtencion.filter(d => d !== dia));
    } else {
      setDiasAtencion([...diasAtencion, dia]);
    }
  };

  const totalMedicos = medicos.length;
  const conConfiguracion = medicos.filter(m => m.configuracion).length;
  const sinConfiguracion = totalMedicos - conConfiguracion;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Especialistas</h2>
          <p>Gestión de médicos y horarios de atención</p>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon kpi-icon-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div className="kpi-content">
            <p className="kpi-label">Total</p>
            <p className="kpi-value">{totalMedicos}</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon kpi-icon-teal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div className="kpi-content">
            <p className="kpi-label">Con configuración</p>
            <p className="kpi-value">{conConfiguracion}</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon kpi-icon-cyan">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div className="kpi-content">
            <p className="kpi-label">Sin configuración</p>
            <p className="kpi-value">{sinConfiguracion}</p>
          </div>
        </div>
      </div>

      <div className="card-custom card-global-config">
        <div className="global-config-content">
          <div className="global-config-info">
            <h4>Configuración Global</h4>
            <p>Ventana de tiempo para agendar citas</p>
          </div>
          <div className="global-config-input">
            <input
              type="number"
              min="1"
              max="12"
              value={ventanaSemanas}
              onChange={(e) => setVentanaSemanas(parseInt(e.target.value))}
            />
            <span className="global-config-suffix">semanas</span>
            <button
              className="btn btn-primary"
              onClick={guardarConfigGlobal}
              disabled={cargandoGlobal}
            >
              {cargandoGlobal ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </div>
      </div>

      <div className="tab-container">
        <div className="tab-buttons">
          <button
            className={`tab-btn ${vistaActiva === "lista" ? "active" : ""}`}
            onClick={() => setVistaActiva("lista")}
          >
            Lista de Especialistas
          </button>
          <button
            className={`tab-btn ${vistaActiva === "nuevo" ? "active" : ""}`}
            onClick={() => setVistaActiva("nuevo")}
          >
            {editandoId ? "Editar Especialista" : "Nuevo Especialista"}
          </button>
        </div>
      </div>

      {vistaActiva === "lista" ? (
        <div>
          {medicos.length === 0 ? (
            <div className="card-custom">
              <div className="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <p>No hay especialistas registrados</p>
                <small>Agrega un nuevo especialista para comenzar</small>
              </div>
            </div>
          ) : (
            medicos.map((m: any) => (
              <div className="card-custom especialista-card" key={m.id}>
                <div className="especialista-content">
                  <div className="especialista-avatar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div className="especialista-info">
                    <strong className="especialista-nombre">{m.nombre}</strong>
                    <span className="especialista-badge">{m.especialidad}</span>
                    {m.configuracion && (
                      <div className="especialista-config">
                        <span>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                          {m.configuracion.diasAtencion?.join(", ")}
                        </span>
                        <span>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          {m.configuracion.horaInicio} - {m.configuracion.horaFin}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="especialista-actions">
                  <button className="btn-edit" onClick={() => editarMedico(m)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Editar
                  </button>
                  <button className="btn-schedule" onClick={() => abrirConfiguracion(m)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                    Configurar
                  </button>
                  <button className="btn-delete" onClick={() => eliminarMedicoHandler(m.id)}>
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
          <h4>{editandoId ? "Editar Especialista" : "Nuevo Especialista"}</h4>

          <div className="form-group">
            <label>Nombre completo</label>
            <input
              placeholder="Ej: Dra. Ana María García"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Especialidad</label>
            <select
              value={especialidad}
              onChange={(e) => setEspecialidad(e.target.value)}
            >
              <option value="">Seleccionar especialidad</option>
              {ESPECIALIDADES.map(esp => (
                <option key={esp} value={esp}>{esp}</option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button className="btn btn-primary" onClick={guardarMedico}>
              {editandoId ? "Actualizar Especialista" : "Guardar Especialista"}
            </button>
            {editandoId && (
              <button className="btn btn-secondary" onClick={cancelarEdicion}>
                Cancelar
              </button>
            )}
          </div>
        </div>
      )}

      {mostrarConfig && medicoSeleccionado && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Configuración de Horarios</h3>
              <p>{medicoSeleccionado.nombre} - {medicoSeleccionado.especialidad}</p>
            </div>

            {cargandoConfig ? (
              <p className="text-center">Cargando configuración...</p>
            ) : (
              <>
                <div className="form-group">
                  <label>Días de atención</label>
                  <div className="dias-grid">
                    {diasSemana.map(dia => (
                      <label key={dia} className="dia-checkbox">
                        <input
                          type="checkbox"
                          checked={diasAtencion.includes(dia)}
                          onChange={() => toggleDia(dia)}
                        />
                        <span>{dia}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Hora de inicio</label>
                    <input
                      type="time"
                      value={horaInicio}
                      onChange={(e) => setHoraInicio(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Hora de fin</label>
                    <input
                      type="time"
                      value={horaFin}
                      onChange={(e) => setHoraFin(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Intervalo entre citas</label>
                  <select
                    value={intervalo}
                    onChange={(e) => setIntervalo(parseInt(e.target.value))}
                  >
                    <option value="15">15 minutos</option>
                    <option value="30">30 minutos</option>
                    <option value="45">45 minutos</option>
                    <option value="60">60 minutos</option>
                  </select>
                  <small>Determina el tiempo entre cada cita</small>
                </div>

                <div className="modal-actions">
                  <button
                    className="btn btn-primary"
                    onClick={guardarConfiguracion}
                    disabled={cargandoConfig}
                  >
                    {cargandoConfig ? "Guardando..." : "Guardar Configuración"}
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setMostrarConfig(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Medicos;