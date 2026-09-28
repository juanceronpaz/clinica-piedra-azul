import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { MedicosService } from './medicos.service';
import { PrismaService } from '../prisma/prisma.service';

describe('MedicosService', () => {
  let service: MedicosService;

  const mockPrisma = {
    medico: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    configuracionMedico: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicosService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<MedicosService>(MedicosService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('findAll debe convertir diasAtencion de string a array', async () => {
    const medicos = [
      {
        id: 1,
        nombre: 'Juan',
        configuracion: {
          diasAtencion: 'LUNES,MIERCOLES',
          horaInicio: '08:00',
        },
      },
    ];
    mockPrisma.medico.findMany.mockResolvedValue(medicos);

    const result = await service.findAll();

    expect(result[0].configuracion.diasAtencion).toEqual(['LUNES', 'MIERCOLES']);
  });

  it('findOne debe lanzar NotFoundException si no existe', async () => {
    mockPrisma.medico.findUnique.mockResolvedValue(null);

    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('create debe crear un médico', async () => {
    const nuevo = { nombre: 'Ana', especialidad: 'Cardiología' };
    mockPrisma.medico.create.mockResolvedValue({ id: 1, ...nuevo });

    const result = await service.create(nuevo);

    expect(result).toEqual({ id: 1, ...nuevo });
  });

  it('getConfiguracion debe retornar valores por defecto si no existe', async () => {
    mockPrisma.medico.findUnique.mockResolvedValue({
      id: 1,
      nombre: 'Juan',
      configuracion: null,
    });
    mockPrisma.configuracionMedico.findUnique.mockResolvedValue(null);

    const result = await service.getConfiguracion(1);

    expect(result.diasAtencion).toEqual(['LUNES', 'MIÉRCOLES', 'VIERNES']);
    expect(result.horaInicio).toBe('08:00');
    expect(result.intervaloMinutos).toBe(30);
  });

  it('saveConfiguracion debe convertir array a string antes de guardar', async () => {
    mockPrisma.medico.findUnique.mockResolvedValue({ id: 1, configuracion: null });
    mockPrisma.configuracionMedico.upsert.mockResolvedValue({ id: 1 });

    await service.saveConfiguracion(1, {
      diasAtencion: ['LUNES', 'MARTES'],
      horaInicio: '08:00',
      horaFin: '17:00',
      intervaloMinutos: 30,
    });

    expect(mockPrisma.configuracionMedico.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { medicoId: 1 },
        create: expect.objectContaining({
          diasAtencion: 'LUNES,MARTES',
        }),
      }),
    );
  });
});
