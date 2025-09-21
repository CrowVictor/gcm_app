import {
  type User,
  type InsertUser,
  type Specialty,
  type InsertSpecialty,
  type Unit,
  type InsertUnit,
  type Schedule,
  type InsertSchedule,
  type Appointment,
  type InsertAppointment,
  type AppointmentWithDetails,
  type UnitWithSpecialty,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmailOrCpf(emailOrCpf: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Specialties
  getAllSpecialties(): Promise<Specialty[]>;
  getSpecialty(id: number): Promise<Specialty | undefined>;
  createSpecialty(specialty: InsertSpecialty): Promise<Specialty>;

  // Units
  getUnitsBySpecialty(specialtyId: number): Promise<UnitWithSpecialty[]>;
  getUnit(id: number): Promise<Unit | undefined>;
  createUnit(unit: InsertUnit): Promise<Unit>;

  // Schedules
  getSchedulesByUnitAndSpecialty(unitId: number, specialtyId: number, data: string): Promise<Schedule[]>;
  getSchedule(id: number): Promise<Schedule | undefined>;
  createSchedule(schedule: InsertSchedule): Promise<Schedule>;
  updateScheduleAvailability(id: number, disponivel: number): Promise<void>;

  // Appointments
  getAppointmentsByUser(userId: string): Promise<AppointmentWithDetails[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  getAppointment(id: number): Promise<Appointment | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private specialties: Map<number, Specialty> = new Map();
  private units: Map<number, Unit> = new Map();
  private schedules: Map<number, Schedule> = new Map();
  private appointments: Map<number, Appointment> = new Map();
  private nextSpecialtyId = 1;
  private nextUnitId = 1;
  private nextScheduleId = 1;
  private nextAppointmentId = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Create test user
    const testUser: User = {
      id: randomUUID(),
      cpf: "12345678901",
      email: "teste@teste.com",
      senha_hash: "hashed_123456",
      nome: "João Silva",
      createdAt: new Date(),
    };
    this.users.set(testUser.id, testUser);

    // Create specialties
    const specialties = [
      { nome: "Cardiologia" },
      { nome: "Dermatologia" },
      { nome: "Ortopedia" },
      { nome: "Pediatria" },
    ];

    specialties.forEach((specialty) => {
      const newSpecialty: Specialty = {
        id: this.nextSpecialtyId++,
        ...specialty,
      };
      this.specialties.set(newSpecialty.id, newSpecialty);
    });

    // Create units
    const units = [
      { nome: "Hospital Central - Unidade Sul", specialty_id: 1, endereco: "Rua das Flores, 123 - Centro" },
      { nome: "Clínica Especializada - Centro", specialty_id: 1, endereco: "Av. Principal, 456 - Jardins" },
      { nome: "Hospital São José - Unidade Norte", specialty_id: 1, endereco: "Rua Norte, 789 - Vila Nova" },
      { nome: "Clínica Derma Care", specialty_id: 2, endereco: "Rua da Pele, 321 - Centro" },
      { nome: "Hospital Ortopédico", specialty_id: 3, endereco: "Av. dos Ossos, 654 - Jardins" },
      { nome: "Pediatria Infantil", specialty_id: 4, endereco: "Rua das Crianças, 987 - Vila Nova" },
    ];

    units.forEach((unit) => {
      const newUnit: Unit = {
        id: this.nextUnitId++,
        ...unit,
      };
      this.units.set(newUnit.id, newUnit);
    });

    // Create schedules for the next 30 days
    const today = new Date();
    for (let day = 0; day < 30; day++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + day);
      const dateString = currentDate.toISOString().split('T')[0];

      // Skip weekends
      if (currentDate.getDay() === 0 || currentDate.getDay() === 6) continue;

      const timeSlots = ["08:00", "09:30", "11:00", "14:00", "15:30", "17:00"];
      
      // Create schedules for each unit and specialty combination
      this.units.forEach((unit) => {
        timeSlots.forEach((hora) => {
          const schedule: Schedule = {
            id: this.nextScheduleId++,
            unit_id: unit.id,
            specialty_id: unit.specialty_id!,
            hora,
            data: dateString,
            disponivel: Math.random() > 0.3 ? 1 : 0, // 70% chance of being available
          };
          this.schedules.set(schedule.id, schedule);
        });
      });
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmailOrCpf(emailOrCpf: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === emailOrCpf || user.cpf === emailOrCpf
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  async getAllSpecialties(): Promise<Specialty[]> {
    return Array.from(this.specialties.values());
  }

  async getSpecialty(id: number): Promise<Specialty | undefined> {
    return this.specialties.get(id);
  }

  async createSpecialty(insertSpecialty: InsertSpecialty): Promise<Specialty> {
    const specialty: Specialty = { id: this.nextSpecialtyId++, ...insertSpecialty };
    this.specialties.set(specialty.id, specialty);
    return specialty;
  }

  async getUnitsBySpecialty(specialtyId: number): Promise<UnitWithSpecialty[]> {
    const specialty = this.specialties.get(specialtyId);
    if (!specialty) return [];

    return Array.from(this.units.values())
      .filter((unit) => unit.specialty_id === specialtyId)
      .map((unit) => ({ ...unit, specialty }));
  }

  async getUnit(id: number): Promise<Unit | undefined> {
    return this.units.get(id);
  }

  async createUnit(insertUnit: InsertUnit): Promise<Unit> {
    const unit: Unit = { 
      id: this.nextUnitId++, 
      nome: insertUnit.nome,
      specialty_id: insertUnit.specialty_id ?? null,
      endereco: insertUnit.endereco ?? null
    };
    this.units.set(unit.id, unit);
    return unit;
  }

  async getSchedulesByUnitAndSpecialty(unitId: number, specialtyId: number, data: string): Promise<Schedule[]> {
    return Array.from(this.schedules.values()).filter(
      (schedule) =>
        schedule.unit_id === unitId &&
        schedule.specialty_id === specialtyId &&
        schedule.data === data &&
        schedule.disponivel === 1
    );
  }

  async getSchedule(id: number): Promise<Schedule | undefined> {
    return this.schedules.get(id);
  }

  async createSchedule(insertSchedule: InsertSchedule): Promise<Schedule> {
    const schedule: Schedule = { 
      id: this.nextScheduleId++,
      unit_id: insertSchedule.unit_id ?? null,
      specialty_id: insertSchedule.specialty_id ?? null,
      hora: insertSchedule.hora,
      data: insertSchedule.data,
      disponivel: insertSchedule.disponivel ?? null
    };
    this.schedules.set(schedule.id, schedule);
    return schedule;
  }

  async updateScheduleAvailability(id: number, disponivel: number): Promise<void> {
    const schedule = this.schedules.get(id);
    if (schedule) {
      schedule.disponivel = disponivel;
      this.schedules.set(id, schedule);
    }
  }

  async getAppointmentsByUser(userId: string): Promise<AppointmentWithDetails[]> {
    const userAppointments = Array.from(this.appointments.values()).filter(
      (appointment) => appointment.user_id === userId
    );

    return userAppointments.map((appointment) => {
      const specialty = this.specialties.get(appointment.specialty_id!)!;
      const unit = this.units.get(appointment.unit_id!)!;
      const schedule = this.schedules.get(appointment.schedule_id!)!;
      
      return {
        ...appointment,
        specialty,
        unit,
        schedule,
      };
    });
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const appointment: Appointment = {
      id: this.nextAppointmentId++,
      user_id: insertAppointment.user_id ?? null,
      unit_id: insertAppointment.unit_id ?? null,
      specialty_id: insertAppointment.specialty_id ?? null,
      schedule_id: insertAppointment.schedule_id ?? null,
      status: insertAppointment.status ?? null,
      observacoes: insertAppointment.observacoes ?? null,
      createdAt: new Date(),
    };
    this.appointments.set(appointment.id, appointment);

    // Mark schedule as unavailable
    if (appointment.schedule_id) {
      await this.updateScheduleAvailability(appointment.schedule_id, 0);
    }

    return appointment;
  }

  async getAppointment(id: number): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }
}

export const storage = new MemStorage();
