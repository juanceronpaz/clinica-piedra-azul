import { Test, TestingModule } from '@nestjs/testing';
import { CitasService } from './citas.service';
import { PrismaService } from '../prisma/prisma.service';

describe('CitasService', () => {
  let service: CitasService;

  const mockPrisma = {
    cita: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    configuracionMedico: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CitasService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CitasService>(CitasService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('findAll debe retornar la lista de citas con paciente y médico', async () => {
    const citas = [{ id: 1, fecha: '2026-10-01', paciente: {}, medico: {} }];
    mockPrisma.cita.findMany.mockResolvedValue(citas);

    const result = await service.findAll();

    expect(result).toEqual(citas);
  });

  it('create debe registrar una nueva cita', async () => {
    const nuevaCita = {
      fecha: '2026-10-01',
      hora: '09:00',
      pacienteId: 1,
      medicoId: 2,
    };
    const creada = { id: 1, ...nuevaCita };
    mockPrisma.cita.create.mockResolvedValue(creada);

    const result = await service.create(nuevaCita);

    expect(result).toEqual(creada);
  });

  it('getByMedicoAndFecha debe filtrar citas por médico y fecha', async () => {
    const citas = [{ id: 1, medicoId: 2, fecha: '2026-10-01' }];
    mockPrisma.cita.findMany.mockResolvedValue(citas);

    const result = await service.getByMedicoAndFecha(2, '2026-10-01');

    expect(result).toEqual(citas);
    expect(mockPrisma.cita.findMany).toHaveBeenCalledWith({
      where: { medicoId: 2, fecha: '2026-10-01' },
      include: { paciente: true, medico: true },
    });
  });

  describe('getHorasDisponibles', () => {
    it('debe generar todas las horas cuando no hay citas ocupadas', async () => {
      mockPrisma.configuracionMedico.findUnique.mockResolvedValue({
        horaInicio: '08:00',
        horaFin: '10:00',
        intervaloMinutos: 30,
      });
      mockPrisma.cita.findMany.mockResolvedValue([]);

      const result = await service.getHorasDisponibles(1, '2026-10-01');

      expect(result).toEqual(['08:00', '08:30', '09:00', '09:30']);
    });

    it('debe excluir las horas ya ocupadas', async () => {
      mockPrisma.configuracionMedico.findUnique.mockResolvedValue({
        horaInicio: '08:00',
        horaFin: '10:00',
        intervaloMinutos: 30,
      });
      mockPrisma.cita.findMany.mockResolvedValue([
        { hora: '08:30' },
        { hora: '09:30' },
      ]);

      const result = await service.getHorasDisponibles(1, '2026-10-01');

      expect(result).toEqual(['08:00', '09:00']);
    });

    it('debe usar valores por defecto si no hay configuración', async () => {
      mockPrisma.configuracionMedico.findUnique.mockResolvedValue(null);
      mockPrisma.cita.findMany.mockResolvedValue([]);

      const result = await service.getHorasDisponibles(1, '2026-10-01');

      // Con defaults 08:00 - 17:00 cada 30 min = 18 slots
      expect(result.length).toBe(18);
      expect(result[0]).toBe('08:00');
      expect(result[result.length - 1]).toBe('16:30');
    });
  });
});