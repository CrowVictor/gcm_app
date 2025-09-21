import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Stethoscope } from "lucide-react";
import { loginSchema, type LoginData } from "@shared/schema";
import { authService } from "@/services/auth";
import { useToast } from "@/hooks/use-toast";

interface LoginProps {
  onLoginSuccess: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrCpf: "teste@teste.com",
      password: "123456",
    },
  });

  const onSubmit = async (data: LoginData) => {
    setIsLoading(true);
    try {
      await authService.login(data);
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo ao HealthApp!",
      });
      onLoginSuccess();
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Credenciais inválidas. Use: teste@teste.com / 123456",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen flex flex-col justify-center">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-primary-medium rounded-full flex items-center justify-center mx-auto mb-4">
          <Stethoscope className="text-2xl text-white" size={32} />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">HealthApp</h1>
        <p className="text-muted-foreground">Agendamento médico simplificado</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="emailOrCpf"
            render={({ field }) => (
              <FormItem>
                <div className="floating-label">
                  <FormControl>
                    <Input
                      placeholder=" "
                      {...field}
                      className="px-3 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                      data-testid="input-email-cpf"
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-medium">Email ou CPF</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="floating-label">
                  <FormControl>
                    <Input
                      type="password"
                      placeholder=" "
                      {...field}
                      className="px-3 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                      data-testid="input-password"
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-medium">Senha</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-primary-dark text-primary-foreground py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity"
            disabled={isLoading}
            data-testid="button-login"
          >
            <Stethoscope className="w-4 h-4 mr-2" />
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </Form>

      <div className="mt-6 text-center">
        <a href="#" className="text-primary-medium text-sm hover:underline">
          Esqueci minha senha
        </a>
      </div>

      <div className="mt-8 text-center text-xs text-muted-foreground">
        <p>Dados de teste:</p>
        <p>Email: teste@teste.com | Senha: 123456</p>
      </div>
    </div>
  );
}
