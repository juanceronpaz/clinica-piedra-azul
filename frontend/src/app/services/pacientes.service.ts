const URL = "http://localhost:3000/pacientes";

export const getPacientes = async () => {
  const res = await fetch(URL);
  return res.json();
};

export const crearPaciente = async (data: {
  documento: string;
  nombres: string;
  apellidos: string;
  celular: string;
  genero: 'Hombre' | 'Mujer' | 'Otro';
  fechaNacimiento?: string;
  email?: string;
}) => {
  const res = await fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const buscarPacientePorDocumento = async (documento: string) => {
  try {
    const res = await fetch(`${URL}/documento/${documento}`);
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Error al buscar paciente');
    }
    return res.json();
  } catch (error) {
    console.error('Error buscando paciente:', error);
    return null;
  }
};

export const actualizarPaciente = async (id: number, data: any) => {
  const res = await fetch(`${URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const eliminarPaciente = async (id: number) => {
  const res = await fetch(`${URL}/${id}`, { method: "DELETE" });
  if (!res.ok) {
    throw new Error("No se pudo eliminar el paciente. Verifique que no tenga citas asociadas.");
  }
};
