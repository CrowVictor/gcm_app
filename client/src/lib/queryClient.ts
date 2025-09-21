import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
    },
  },
});

// Mock API request function - simulates HTTP requests without actual network calls
export const apiRequest = async (
  method: string,
  url: string,
  data?: any
): Promise<{ json: () => Promise<any>; ok: boolean; status: number }> => {
  
  console.log(`🔄 Mock API: ${method} ${url}`, data); // Debug log
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock responses based on URL
  if (method === "POST" && url === "/api/login") {
    const { emailOrCpf, password } = data;
    
    console.log(`🔐 Tentativa de login: ${emailOrCpf} / ${password}`);
    
    // Check credentials
    if ((emailOrCpf === "teste@teste.com" || emailOrCpf === "12345678901") && password === "123456") {
      console.log("✅ Login bem-sucedido!");
      return {
        ok: true,
        status: 200,
        json: async () => ({
          token: "mock.jwt.token.123456789",
          user: {
            id: "1",
            nome: "Usuário de Teste",
            email: "teste@teste.com",
            cpf: "12345678901"
          }
        })
      };
    } else {
      console.log("❌ Credenciais inválidas!");
      throw new Error("Credenciais inválidas. Use: teste@teste.com / 123456");
    }
  }
  
  if (method === "GET" && url === "/api/specialties") {
    console.log("📋 Buscando especialidades...");
    return {
      ok: true,
      status: 200,
      json: async () => [
        { id: 1, nome: "Cardiologia" },
        { id: 2, nome: "Dermatologia" },
        { id: 3, nome: "Ortopedia" },
        { id: 4, nome: "Pediatria" },
        { id: 5, nome: "Neurologia" }
      ]
    };
  }
  
  if (method === "GET" && url.startsWith("/api/units")) {
    const urlObj = new URL(url, 'http://localhost');
    const specialtyId = urlObj.searchParams.get('specialty');
    
    console.log(`🏥 Buscando unidades para especialidade: ${specialtyId}`);
    
    const mockUnits = [
      { id: 1, nome: "Hospital Central", specialty_id: 1, endereco: "Rua das Flores, 123 - Centro" },
      { id: 2, nome: "Clínica São José", specialty_id: 1, endereco: "Av. Brasil, 456 - Zona Sul" },
      { id: 3, nome: "Centro Médico Sul", specialty_id: 2, endereco: "Rua do Comércio, 789 - Bairro Sul" },
      { id: 4, nome: "Hospital Norte", specialty_id: 3, endereco: "Av. Norte, 321 - Zona Norte" },
      { id: 5, nome: "Clínica Central", specialty_id: 4, endereco: "Rua Principal, 654 - Centro" },
      { id: 6, nome: "Hospital Especializado", specialty_id: 5, endereco: "Av. Especialistas, 987 - Zona Oeste" }
    ];
    
    const filteredUnits = mockUnits.filter(unit => 
      unit.specialty_id === parseInt(specialtyId || '0')
    );
    
    return {
      ok: true,
      status: 200,
      json: async () => filteredUnits
    };
  }
  
  if (method === "GET" && url.startsWith("/api/schedules")) {
    const urlObj = new URL(url, 'http://localhost');
    const unitId = urlObj.searchParams.get('unit');
    const specialtyId = urlObj.searchParams.get('specialty');
    
    console.log(`⏰ Buscando horários para unidade: ${unitId}, especialidade: ${specialtyId}`);
    
    // Generate dates for next 7 days
    const today = new Date();
    const schedules = [];
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      
      // Morning slots
      schedules.push(
        { id: i * 10 + 1, unit_id: parseInt(unitId || '0'), specialty_id: parseInt(specialtyId || '0'), hora: "08:00", data: dateString, disponivel: 1 },
        { id: i * 10 + 2, unit_id: parseInt(unitId || '0'), specialty_id: parseInt(specialtyId || '0'), hora: "09:00", data: dateString, disponivel: 1 },
        { id: i * 10 + 3, unit_id: parseInt(unitId || '0'), specialty_id: parseInt(specialtyId || '0'), hora: "10:00", data: dateString, disponivel: 1 },
        { id: i * 10 + 4, unit_id: parseInt(unitId || '0'), specialty_id: parseInt(specialtyId || '0'), hora: "11:00", data: dateString, disponivel: 1 }
      );
      
      // Afternoon slots
      schedules.push(
        { id: i * 10 + 5, unit_id: parseInt(unitId || '0'), specialty_id: parseInt(specialtyId || '0'), hora: "14:00", data: dateString, disponivel: 1 },
        { id: i * 10 + 6, unit_id: parseInt(unitId || '0'), specialty_id: parseInt(specialtyId || '0'), hora: "15:00", data: dateString, disponivel: 1 },
        { id: i * 10 + 7, unit_id: parseInt(unitId || '0'), specialty_id: parseInt(specialtyId || '0'), hora: "16:00", data: dateString, disponivel: 1 },
        { id: i * 10 + 8, unit_id: parseInt(unitId || '0'), specialty_id: parseInt(specialtyId || '0'), hora: "17:00", data: dateString, disponivel: 1 }
      );
    }
    
    return {
      ok: true,
      status: 200,
      json: async () => schedules
    };
  }
  
  if (method === "POST" && url === "/api/appointments") {
    console.log("📅 Criando agendamento...", data);
    
    // Simulate appointment creation
    return {
      ok: true,
      status: 201,
      json: async () => ({
        id: Math.floor(Math.random() * 1000),
        ...data,
        status: "confirmed",
        createdAt: new Date().toISOString()
      })
    };
  }
  
  // Default response for unknown endpoints
  console.error(`❌ Mock endpoint não implementado: ${method} ${url}`);
  throw new Error(`Mock endpoint not implemented: ${method} ${url}`);
};