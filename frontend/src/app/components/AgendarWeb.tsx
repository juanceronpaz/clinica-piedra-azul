import { useState, useEffect } from "react";
import { getMedicos } from "../services/medicos.service";
import { crearCita, getHorasDisponibles } from "../services/citas.service";
import { crearPaciente, buscarPacientePorDocumento } from "../services/pacientes.service";

const ESPECIALIDADES = [
  { nombre: "Medicina General", icono: "stethoscope" },
  { nombre: "Pediatría", icono: "baby" },
  { nombre: "Cardiología", icono: "heart" },
  { nombre: "Dermatología", icono: "sparkle" },
  { nombre: "Psicología", icono: "brain" },
  { nombre: "Fisioterapia", icono: "activity" },
  { nombre: "Ginecología", icono: "user" },
  { nombre: "Oftalmología", icono: "eye" },
  { nombre: "Otorrinolaringología", icono: "ear" },
  { nombre: "Traumatología", icono: "bone" },
  { nombre: "Neurología", icono: "brain" },
  { nombre: "Nutrición", icono: "apple" },
];

const renderIcono = (nombre: string) => {
  const iconProps = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2 };
  switch (nombre) {
    case "stethoscope":
      return (
        <svg {...iconProps}>
          <path d="M4 8v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4z" transform="translate(2,2)" />
          <path d="M14 6v10a4 4 0 0 0 4 4 4 4 0 0 0 4-4v-2" transform="translate(-2,0)" />
          <circle cx="18" cy="8" r="2" />
        </svg>
      );
    case "baby":
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="10" r="6" />
          <path d="M9 20h6" />
        </svg>
      );
    case "heart":
      return (
        <svg {...iconProps}>
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      );
    case "sparkle":
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      );
    case "brain":
      return (
        <svg {...iconProps}>
          <path d="M12 2a4 4 0 0 0-4 4v2a3 3 0 0 0-3 3v2a3 3 0 0 0 3 3v2a4 4 0 0 0 8 0v-2a3 3 0 0 0 3-3v-2a3 3 0 0 0-3-3V6a4 4 0 0 0-4-4z" />
        </svg>
      );
    case "activity":
      return (
        <svg {...iconProps}>
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      );
    case "user":
      return (
        <svg {...iconProps}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    case "eye":
      return (
        <svg {...iconProps}>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case "ear":
      return (
        <svg {...iconProps}>
          <path d="M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10a3.5 3.5 0 1 1-7 0" />
        </svg>
      );
    case "bone":
      return (
        <svg {...iconProps}>
          <path d="M17 10c.7-.7 1.69 0 2.5 0a2.5 2.5 0 1 0 0-5 .5.5 0 0 1-.5-.5 2.5 2.5 0 1 0-5 0c0 .81.7 1.8 0 2.5l-7 7c-.7.7-1.69 0-2.5 0a2.5 2.5 0 0 0 0 5c.28 0 .5.22.5.5a2.5 2.5 0 1 0 5 0c0-.81-.7-1.8 0-2.5z" />
        </svg>
      );
    case "apple":
      return (
        <svg {...iconProps}>
          <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06z" />
        </svg>
      );
    default:
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="10" />
        </svg>
      );
  }
};

function AgendarWeb() {
  const [paso, setPaso] = useState(1);
  const [especialidad, setEspecialidad] = useState("");
  const [medicoId, setMedicoId] = useState("");
  const [medicoNombre, setMedicoNombre] = useState("");
  const [medicos, setMedicos] = useState<any[]>([]);
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [horasDisponibles, setHorasDisponibles] = useState<string[]>([]);
  const [cargandoHoras, setCargandoHoras] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [paciente, setPaciente] = useState({
    nombres: "",
    apellidos: "",
    documento: "",
    celular: "",
    email: "",
    genero: "Otro" as "Hombre" | "Mujer" | "Otro",
    fechaNacimiento: ""
  });
  const [pacienteExistente, setPacienteExistente] = useState<any>(null);
  const [buscandoPaciente, setBuscandoPaciente] = useState(false);

  useEffect(() => {
    const cargarMedicos = async () => {
      const data = await getMedicos();
      setMedicos(data);
    };
    cargarMedicos();
  }, []);

  const medicosFiltrados = especialidad
    ? medicos.filter(m => m.especialidad === especialidad)
    : [];

  useEffect(() => {
    if (medicoId && fecha) {
      const cargarHoras = async () => {
        setCargandoHoras(true);
        const horas = await getHorasDisponibles(Number(medicoId), fecha);
        setHorasDisponibles(horas);
        setCargandoHoras(false);
      };
      cargarHoras();
    } else {
      setHorasDisponibles([]);
    }
  }, [medicoId, fecha]);

  const buscarPaciente = async (documento: string) => {
    if (!documento || documento.length < 5) return;

    setBuscandoPaciente(true);
    const pacienteEncontrado = await buscarPacientePorDocumento(documento);

    if (pacienteEncontrado) {
      setPacienteExistente(pacienteEncontrado);
      setPaciente({
        nombres: pacienteEncontrado.nombres || "",
        apellidos: pacienteEncontrado.apellidos || "",
        documento: pacienteEncontrado.documento,
        celular: pacienteEncontrado.celular || "",
        email: pacienteEncontrado.email || "",
        genero: pacienteEncontrado.genero || "Otro",
        fechaNacimiento: pacienteEncontrado.fechaNacimiento || ""
      });
    } else {
      setPacienteExistente(null);
    }
    setBuscandoPaciente(false);
  };

  const handleConfirmar = async () => {
    if (!especialidad || !medicoId || !fecha || !hora) {
      alert("Por favor complete todos los datos de la cita");
      return;
    }

    if (!paciente.documento || !paciente.nombres || !paciente.apellidos || !paciente.celular) {
      alert("Por favor complete los datos personales");
      return;
    }

    setCargando(true);

    try {
      let pacienteId;

      const existente = await buscarPacientePorDocumento(paciente.documento);

      if (existente) {
        pacienteId = existente.id;
      } else {
        const nuevo = await crearPaciente(paciente);
        pacienteId = nuevo.id;
      }

      await crearCita({
        fecha,
        hora,
        pacienteId,
        medicoId: Number(medicoId),
        descripcion: `Cita agendada en línea - ${especialidad}`,
        estado: "AGENDADA"
      });

      alert("Cita agendada exitosamente. Recibirá un mensaje de confirmación.");

      setPaso(1);
      setEspecialidad("");
      setMedicoId("");
      setMedicoNombre("");
      setFecha("");
      setHora("");
      setPaciente({
        nombres: "",
        apellidos: "",
        documento: "",
        celular: "",
        email: "",
        genero: "Otro",
        fechaNacimiento: ""
      });
      setPacienteExistente(null);

    } catch (error) {
      console.error("Error al agendar cita:", error);
      alert("Error al agendar la cita. Por favor intente nuevamente.");
    } finally {
      setCargando(false);
    }
  };

  const avanzarPaso = () => {
    if (paso === 1 && !especialidad) {
      alert("Por favor seleccione una especialidad");
      return;
    }
    if (paso === 2 && !medicoId) {
      alert("Por favor seleccione un especialista");
      return;
    }
    if (paso === 3 && !fecha) {
      alert("Por favor seleccione una fecha");
      return;
    }
    if (paso === 4 && !hora) {
      alert("Por favor seleccione una hora");
      return;
    }
    setPaso(paso + 1);
  };

  const pasos = [
    { num: 1, label: "Especialidad" },
    { num: 2, label: "Especialista" },
    { num: 3, label: "Fecha" },
    { num: 4, label: "Hora" },
    { num: 5, label: "Confirmar" }
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Reserva en Línea</h2>
          <p>Agende su cita de forma rápida y sencilla en 5 pasos</p>
        </div>
      </div>

      <div className="stepper">
        {pasos.map((step) => (
          <div key={step.num} className={`step ${paso >= step.num ? "active" : ""} ${paso > step.num ? "completed" : ""}`}>
            <div className="step-circle">
              {paso > step.num ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                step.num
              )}
            </div>
            <div className="step-label">{step.label}</div>
          </div>
        ))}
      </div>

      {paso === 1 && (
        <div className="card-custom">
          <h4>Seleccione una especialidad</h4>
          <div className="options-grid options-grid-icons">
            {ESPECIALIDADES.map(esp => (
              <button
                key={esp.nombre}
                className={`option-card option-card-icon ${especialidad === esp.nombre ? "selected" : ""}`}
                onClick={() => setEspecialidad(esp.nombre)}
              >
                <span className="option-icon">{renderIcono(esp.icono)}</span>
                <strong>{esp.nombre}</strong>
              </button>
            ))}
          </div>
        </div>
      )}

      {paso === 2 && (
        <div className="card-custom">
          <h4>Seleccione un especialista</h4>
          {medicosFiltrados.length > 0 ? (
            <div className="options-grid">
              {medicosFiltrados.map((doc: any) => (
                <button
                  key={doc.id}
                  className={`option-card option-card-doctor ${medicoId === doc.id ? "selected" : ""}`}
                  onClick={() => {
                    setMedicoId(doc.id);
                    setMedicoNombre(doc.nombre);
                  }}
                >
                  <span className="doctor-avatar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>
                  <div className="doctor-info">
                    <strong>{doc.nombre}</strong>
                    <small>{doc.especialidad}</small>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <p>No hay especialistas disponibles</p>
              <small>No se encontraron médicos para {especialidad}</small>
            </div>
          )}
        </div>
      )}

      {paso === 3 && (
        <div className="card-custom">
          <h4>Seleccione una fecha</h4>
          <div className="date-picker-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="date-input"
            />
          </div>
          <small>Las citas se pueden agendar con hasta 4 semanas de anticipación</small>
        </div>
      )}

      {paso === 4 && (
        <div className="card-custom">
          <h4>Seleccione una hora</h4>
          {cargandoHoras ? (
            <div className="loading-state">
              <div className="loading-dots">
                <span></span><span></span><span></span>
              </div>
              <p>Cargando horarios disponibles...</p>
            </div>
          ) : horasDisponibles.length > 0 ? (
            <>
              <div className="hours-grid">
                {horasDisponibles.map(h => (
                  <button
                    key={h}
                    className={`hour-btn ${hora === h ? "selected" : ""}`}
                    onClick={() => setHora(h)}
                  >
                    {h}
                  </button>
                ))}
              </div>
              <small>{horasDisponibles.length} horarios disponibles</small>
            </>
          ) : (
            <div className="empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <p>No hay horarios disponibles</p>
              <small>Seleccione otra fecha o verifique que el médico atiende este día</small>
            </div>
          )}
        </div>
      )}

      {paso === 5 && (
        <div className="card-custom">
          <h4>Datos personales</h4>

          <div className="form-group">
            <label>Documento de identidad *</label>
            <input
              type="text"
              placeholder="Número de documento"
              value={paciente.documento}
              onChange={(e) => {
                setPaciente({...paciente, documento: e.target.value});
                buscarPaciente(e.target.value);
              }}
            />
          </div>

          {buscandoPaciente && (
            <div className="loading-inline">
              <span className="spinner-small"></span>
              Buscando paciente...
            </div>
          )}

          {pacienteExistente && (
            <div className="patient-found">
              <div className="patient-found-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div className="patient-found-content">
                <strong>Paciente encontrado</strong>
                <p>{pacienteExistente.nombres} {pacienteExistente.apellidos} · {pacienteExistente.celular}</p>
              </div>
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label>Nombres *</label>
              <input
                type="text"
                placeholder="Nombres"
                value={paciente.nombres}
                onChange={(e) => setPaciente({...paciente, nombres: e.target.value})}
                disabled={pacienteExistente !== null}
              />
            </div>
            <div className="form-group">
              <label>Apellidos *</label>
              <input
                type="text"
                placeholder="Apellidos"
                value={paciente.apellidos}
                onChange={(e) => setPaciente({...paciente, apellidos: e.target.value})}
                disabled={pacienteExistente !== null}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Celular *</label>
              <input
                type="tel"
                placeholder="Celular"
                value={paciente.celular}
                onChange={(e) => setPaciente({...paciente, celular: e.target.value})}
                disabled={pacienteExistente !== null}
              />
            </div>
            <div className="form-group">
              <label>Género</label>
              <select
                value={paciente.genero}
                onChange={(e) => setPaciente({...paciente, genero: e.target.value as "Hombre" | "Mujer" | "Otro"})}
                disabled={pacienteExistente !== null}
              >
                <option value="Hombre">Hombre</option>
                <option value="Mujer">Mujer</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Fecha de nacimiento</label>
              <input
                type="date"
                value={paciente.fechaNacimiento}
                onChange={(e) => setPaciente({...paciente, fechaNacimiento: e.target.value})}
                disabled={pacienteExistente !== null}
              />
            </div>
            <div className="form-group">
              <label>Correo electrónico</label>
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                value={paciente.email}
                onChange={(e) => setPaciente({...paciente, email: e.target.value})}
                disabled={pacienteExistente !== null}
              />
            </div>
          </div>

          <div className="resumen-cita">
            <div className="resumen-header">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <h4>Resumen de la cita</h4>
            </div>
            <div className="resumen-items">
              <div className="resumen-item">
                <span className="resumen-label">Especialidad</span>
                <span className="resumen-value">{especialidad}</span>
              </div>
              <div className="resumen-item">
                <span className="resumen-label">Especialista</span>
                <span className="resumen-value">{medicoNombre}</span>
              </div>
              <div className="resumen-item">
                <span className="resumen-label">Fecha</span>
                <span className="resumen-value">{fecha}</span>
              </div>
              <div className="resumen-item">
                <span className="resumen-label">Hora</span>
                <span className="resumen-value">{hora}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="step-buttons">
        {paso > 1 && (
          <button className="btn btn-secondary" onClick={() => setPaso(paso - 1)} disabled={cargando}>
            Anterior
          </button>
        )}
        {paso < 5 && (
          <button
            className="btn btn-primary btn-next"
            onClick={avanzarPaso}
            disabled={
              (paso === 1 && !especialidad) ||
              (paso === 2 && !medicoId) ||
              (paso === 3 && !fecha) ||
              (paso === 4 && !hora) ||
              cargando
            }
          >
            Siguiente
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        )}
        {paso === 5 && (
          <button
            className="btn btn-success btn-confirm"
            onClick={handleConfirmar}
            disabled={
              !paciente.documento ||
              !paciente.nombres ||
              !paciente.apellidos ||
              !paciente.celular ||
              cargando
            }
          >
            {cargando ? (
              <>
                <span className="spinner-small-white"></span>
                Procesando...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Confirmar Cita
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default AgendarWeb;