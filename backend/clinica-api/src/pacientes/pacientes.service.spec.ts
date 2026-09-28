import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PacientesService } from './pacientes.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PacientesService', () => {
  let service: PacientesService;

const mockPrisma = {
  paciente: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  cita: {
    deleteMany: jest.fn(),
  },
};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PacientesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<PacientesService>(PacientesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('findAll debe retornar la lista de pacientes', async () => {
    const pacientes = [{ id: 1, nombres: 'Juan' }];
    mockPrisma.paciente.findMany.mockResolvedValue(pacientes);

    const result = await service.findAll();

    expect(result).toEqual(pacientes);
    expect(mockPrisma.paciente.findMany).toHaveBeenCalledTimes(1);
  });

  it('findOne debe lanzar NotFoundException si no existe', async () => {
    mockPrisma.paciente.findUnique.mockResolvedValue(null);

    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('findOne debe retornar el paciente si existe', async () => {
    const paciente = { id: 1, nombres: 'Juan' };
    mockPrisma.paciente.findUnique.mockResolvedValue(paciente);

    const result = await service.findOne(1);

    expect(result).toEqual(paciente);
  });

  it('create debe crear un nuevo paciente', async () => {
    const nuevo = { documento: '123', nombres: 'Juan', apellidos: 'Pérez' };
    const creado = { id: 1, ...nuevo };
    mockPrisma.paciente.create.mockResolvedValue(creado);

    const result = await service.create(nuevo as any);

    expect(result).toEqual(creado);
    expect(mockPrisma.paciente.create).toHaveBeenCalledWith({ data: nuevo });
  });

  it('remove debe eliminar un paciente existente', async () => {
  mockPrisma.paciente.findUnique.mockResolvedValue({ id: 1 });
  mockPrisma.cita.deleteMany.mockResolvedValue({ count: 0 });
  mockPrisma.paciente.delete.mockResolvedValue({ id: 1 });

  const result = await service.remove(1);

  expect(result).toEqual({ id: 1 });
  expect(mockPrisma.cita.deleteMany).toHaveBeenCalledWith({ where: { pacienteId: 1 } });
});
});