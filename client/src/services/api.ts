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
    // Converte emailOrCpf para credential
    const payload = {
      credential: data.emailOrCpf,
      password: data.password
    };

    const response = await apiRequest("POST", "/api/login", payload);
    const jsonData = await response.json();

    // ✅ Verifica se o backend retornou erro
    if (!response.ok || jsonData.status !== 200) {
      throw new Error(jsonData.message || 'Erro ao fazer login');
    }

    // ✅ Retorna apenas se for sucesso
    return {
      token: jsonData.token,
      user: jsonData.user
    };
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
