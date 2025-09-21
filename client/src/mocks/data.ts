import type { Specialty, Unit, Schedule, AppointmentWithDetails } from "@shared/schema";

export const mockSpecialties: Specialty[] = [
  { id: 1, nome: "Cardiologia" },
  { id: 2, nome: "Dermatologia" },
  { id: 3, nome: "Ortopedia" },
  { id: 4, nome: "Pediatria" },
];

export const mockUnits: Unit[] = [
  { id: 1, nome: "Hospital Central - Unidade Sul", specialty_id: 1, endereco: "Rua das Flores, 123 - Centro" },
  { id: 2, nome: "Clínica Especializada - Centro", specialty_id: 1, endereco: "Av. Principal, 456 - Jardins" },
  { id: 3, nome: "Hospital São José - Unidade Norte", specialty_id: 1, endereco: "Rua Norte, 789 - Vila Nova" },
];

export const mockSchedules: Schedule[] = [
  { id: 1, unit_id: 1, specialty_id: 1, hora: "08:00", data: "2024-11-25", disponivel: 1 },
  { id: 2, unit_id: 1, specialty_id: 1, hora: "09:30", data: "2024-11-25", disponivel: 1 },
  { id: 3, unit_id: 1, specialty_id: 1, hora: "11:00", data: "2024-11-25", disponivel: 1 },
  { id: 4, unit_id: 1, specialty_id: 1, hora: "14:00", data: "2024-11-25", disponivel: 0 },
  { id: 5, unit_id: 1, specialty_id: 1, hora: "15:30", data: "2024-11-25", disponivel: 1 },
  { id: 6, unit_id: 1, specialty_id: 1, hora: "17:00", data: "2024-11-25", disponivel: 1 },
];

export const mockAppointments: AppointmentWithDetails[] = [
  {
    id: 1,
    user_id: "user1",
    unit_id: 1,
    specialty_id: 1,
    schedule_id: 1,
    status: "confirmed",
    observacoes: "",
    createdAt: new Date(),
    specialty: { id: 1, nome: "Cardiologia" },
    unit: { id: 1, nome: "Hospital Central - Unidade Sul", specialty_id: 1, endereco: "Rua das Flores, 123 - Centro" },
    schedule: { id: 1, unit_id: 1, specialty_id: 1, hora: "14:30", data: "2024-11-25", disponivel: 0 },
  },
  {
    id: 2,
    user_id: "user1",
    unit_id: 2,
    specialty_id: 2,
    schedule_id: 2,
    status: "pending",
    observacoes: "",
    createdAt: new Date(),
    specialty: { id: 2, nome: "Dermatologia" },
    unit: { id: 2, nome: "Clínica Especializada - Centro", specialty_id: 2, endereco: "Av. Principal, 456 - Jardins" },
    schedule: { id: 2, unit_id: 2, specialty_id: 2, hora: "09:15", data: "2024-11-28", disponivel: 0 },
  },
];

export const getSpecialtyIcon = (specialtyName: string): string => {
  const icons: Record<string, string> = {
    "Cardiologia": "heart-pulse",
    "Dermatologia": "user-doctor",
    "Ortopedia": "bone",
    "Pediatria": "baby",
  };
  return icons[specialtyName] || "stethoscope";
};
