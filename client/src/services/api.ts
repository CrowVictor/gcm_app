import { apiRequest } from "@/lib/queryClient";
import type { 
  LoginData, 
  User, 
  Specialty, 
  UnitWithSpecialty, 
  Schedule, 
  InsertAppointment, 
  Appointment,
  AppointmentWithDetails 
} from "@shared/schema";

export interface LoginResponse {
  token: string;
  user: Pick<User, 'id' | 'nome' | 'email' | 'cpf'>;
}

export const authApi = {
  login: async (data: LoginData): Promise<LoginResponse> => {
    const response = await apiRequest("POST", "/api/login", data);
    return response.json();
  },
};

export const appointmentApi = {
  getSpecialties: async (): Promise<Specialty[]> => {
    const response = await apiRequest("GET", "/api/specialties");
    return response.json();
  },

  getUnits: async (specialtyId: number): Promise<UnitWithSpecialty[]> => {
    const response = await apiRequest("GET", `/api/units?specialty=${specialtyId}`);
    return response.json();
  },

  getSchedules: async (unitId: number, specialtyId: number, data: string): Promise<Schedule[]> => {
    const response = await apiRequest("GET", `/api/schedules?unit=${unitId}&specialty=${specialtyId}&data=${data}`);
    return response.json();
  },

  createAppointment: async (data: InsertAppointment): Promise<Appointment> => {
    const token = localStorage.getItem("auth_token");
    const response = await fetch("/api/appointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
    
    return response.json();
  },

  getUserAppointments: async (): Promise<AppointmentWithDetails[]> => {
    const token = localStorage.getItem("auth_token");
    const response = await fetch("/api/appointments", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
    
    return response.json();
  },
};
