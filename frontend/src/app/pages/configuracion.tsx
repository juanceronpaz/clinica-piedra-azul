import { useEffect, useState } from "react";
import { getMedicos, getConfiguracionGlobal, guardarConfiguracionGlobal } from "../services/medicos.service";

function Configuracion() {
  const [medicos, setMedicos] = useState<any[]>([]);
  const [ventanaSemanas, setVentanaSemanas] = useState(4);
  const [ventanaOriginal, setVentanaOriginal] = useState(4);
  const [cargando, setCargando] = useState(false);
  const [guardado, setGuardado] = useState(false);

  const cargar = async () => {
    const [medicosData, configGlobal] = await Promise.all([
      getMedicos(),
      getConfiguracionGlobal()
    ]);
    setMedicos(medicosData);
    setVentanaSemanas(configGlobal.ventanaSemanas);
    setVentanaOriginal(configGlobal.ventanaSemanas);
  };

  useEffect(() => {
    cargar();
  }, []);

  const guardarGlobal = async () => {
    setCargando(true);
    setGuardado(false);
    try {
      await guardarConfiguracionGlobal(ventanaSemanas);
      setVentanaOriginal(ventanaSemanas);
      setGuardado(true);
      setTimeout(() => setGuardado(false), 3000);
    } catch (error) {
      alert("Error al guardar la configuración");
    } finally {
      setCargando(false);
    }
  };

  const cancelarCambios = () => {
    setVentanaSemanas(ventanaOriginal);
  };

  const totalMedicos = medicos.length;
  const medicosConfigurados = medicos.filter(m => m.configuracion).length;
  const medicosSinConfigurar = totalMedicos - medicosConfigurados;
  const hayCambios = ventanaSemanas !== ventanaOriginal;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Configuración del Sistema</h2>
          <p>Parámetros generales para el agendamiento autónomo de citas</p>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon kpi-icon-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div className="kpi-content">
            <p className="kpi-label">Ventana actual</p>
            <p className="kpi-value">
  {ventanaOriginal}
  <span style={{ fontSize: "0.75rem", color: "#64748b", marginLeft: 6, fontWeight: 500 }}>sem</span>
</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon kpi-icon-teal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div className="kpi-content">
            <p className="kpi-label">Configurados</p>
            <p className="kpi-value">{medicosConfigurados}</p>
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
            <p className="kpi-label">Sin configurar</p>
            <p className="kpi-value">{medicosSinConfigurar}</p>
          </div>
        </div>
      </div>

      <div className="card-custom">
        <h4>Configuración Global de Agendamiento</h4>
        <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: 20 }}>
          Define la ventana de tiempo en la que los pacientes pueden agendar citas de forma autónoma.
        </p>

        <div className="config-global-row">
          <div className="config-global-field">
            <label>Ventana de agendamiento</label>
            <div className="config-input-group">
              <input
                type="number"
                min="1"
                max="12"
                value={ventanaSemanas}
                onChange={(e) => setVentanaSemanas(parseInt(e.target.value) || 1)}
              />
              <span>semanas</span>
            </div>
            <small>Las citas se pueden agendar con hasta {ventanaSemanas} semanas de anticipación</small>
          </div>
        </div>

        {hayCambios && (
          <div className="config-warning">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Tienes cambios sin guardar
          </div>
        )}

        {guardado && (
          <div className="config-success">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Configuración guardada correctamente
          </div>
        )}

        <div className="form-actions">
          <button
            className="btn btn-primary"
            onClick={guardarGlobal}
            disabled={cargando || !hayCambios}
          >
            {cargando ? "Guardando..." : "Guardar Configuración"}
          </button>
          {hayCambios && (
            <button className="btn btn-secondary" onClick={cancelarCambios}>
              Cancelar
            </button>
          )}
        </div>
      </div>

      <div className="card-custom">
        <h4>Estado de Configuración por Especialista</h4>
        <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: 20 }}>
          Resumen de los parámetros de disponibilidad configurados para cada médico. Para modificar, ve a la sección <strong>Especialistas</strong>.
        </p>

        {medicos.length === 0 ? (
          <div className="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <p>No hay especialistas registrados</p>
          </div>
        ) : (
          <div className="tabla-config">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Especialista</th>
                  <th>Días de atención</th>
                  <th>Horario</th>
                  <th>Intervalo</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {medicos.map((m: any) => (
                  <tr key={m.id}>
                    <td>
                      <strong>{m.nombre}</strong>
                      <br />
                      <small style={{ color: "#64748b" }}>{m.especialidad}</small>
                    </td>
                    <td>
                      {m.configuracion?.diasAtencion?.join(", ") || "---"}
                    </td>
                    <td>
                      {m.configuracion
                        ? `${m.configuracion.horaInicio} - ${m.configuracion.horaFin}`
                        : "---"}
                    </td>
                    <td>
                      {m.configuracion
                        ? `${m.configuracion.intervaloMinutos} min`
                        : "---"}
                    </td>
                    <td>
                      {m.configuracion ? (
                        <span className="badge badge-success">Configurado</span>
                      ) : (
                        <span className="badge badge-warning">Pendiente</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card-custom">
        <h4>Acerca del Sistema</h4>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Nombre</span>
            <span className="info-value">Clínica PiedraAzul</span>
          </div>
          <div className="info-item">
            <span className="info-label">Versión</span>
            <span className="info-value">1.0.0</span>
          </div>
          <div className="info-item">
            <span className="info-label">Frontend</span>
            <span className="info-value">React + Vite + TypeScript</span>
          </div>
          <div className="info-item">
            <span className="info-label">Backend</span>
            <span className="info-value">NestJS + Prisma + SQLite</span>
          </div>
          <div className="info-item">
            <span className="info-label">Materia</span>
            <span className="info-value">Ingeniería de Software III</span>
          </div>
          <div className="info-item">
            <span className="info-label">Universidad</span>
            <span className="info-value">Universidad del Cauca</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Configuracion;