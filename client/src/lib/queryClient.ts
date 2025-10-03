import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 2,
    },
  },
});

// Lê a URL da variável de ambiente
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Função REAL de requisição API
export const apiRequest = async (
  method: string,
  url: string,
  data?: any
): Promise<{ json: () => Promise<any>; ok: boolean; status: number }> => {
  
  console.log(`🔄 API: ${method} ${API_BASE_URL}${url}`, data);
  
  const fullUrl = `${API_BASE_URL}${url}`;
  
  try {
    const response = await fetch(fullUrl, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    
    return {
      ok: response.ok,
      status: response.status,
      json: async () => response.json(),
    };
    
  } catch (error) {
    console.error('❌ Erro na chamada API:', error);
    throw error;
  }
};