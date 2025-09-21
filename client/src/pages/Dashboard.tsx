import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Calendar, CalendarPlus, Check } from "lucide-react";
import { authService } from "@/services/auth";
import { appointmentApi } from "@/services/api";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getSpecialtyIcon } from "@/mocks/data";

interface DashboardProps {
  onNewAppointment: () => void;
}

export default function Dashboard({ onNewAppointment }: DashboardProps) {
  const user = authService.getCurrentUser();

  const { data: appointments, isLoading } = useQuery({
    queryKey: ["/api/appointments"],
    queryFn: () => appointmentApi.getUserAppointments(),
  });

  const upcomingAppointments = appointments?.filter(
    (appointment) => new Date(appointment.schedule.data) >= new Date()
  ) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-accent text-accent-foreground";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-accent text-accent-foreground";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmado";
      case "pending":
        return "Pendente";
      case "cancelled":
        return "Cancelado";
      default:
        return "Confirmado";
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-primary-dark text-primary-foreground p-6 pb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold" data-testid="text-user-name">
              {user?.nome || "Usuário"}
            </h2>
            <p className="text-primary-light opacity-90 text-sm" data-testid="text-user-email">
              {user?.email || "user@example.com"}
            </p>
          </div>
          <button className="p-2 rounded-full bg-primary-medium hover:bg-primary-light transition-colors">
            <Bell className="text-lg" size={20} />
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 -mt-4 mb-6">
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <Button
              className="w-full bg-primary-medium text-primary-foreground py-4 px-6 rounded-lg font-medium hover:bg-primary-light transition-colors"
              onClick={onNewAppointment}
              data-testid="button-new-appointment"
            >
              <CalendarPlus className="w-4 h-4 mr-2" />
              Nova Consulta
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Appointments */}
      <div className="px-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Próximas Consultas</h3>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        ) : upcomingAppointments.length > 0 ? (
          <div className="space-y-3">
            {upcomingAppointments.map((appointment) => (
              <Card
                key={appointment.id}
                className="shadow-sm appointment-card"
                data-testid={`card-appointment-${appointment.id}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">
                        {appointment.specialty.nome}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {appointment.unit.nome}
                      </p>
                      <div className="flex items-center text-sm">
                        <Calendar className="w-4 h-4 mr-2 text-primary-medium" />
                        <span>
                          {format(new Date(appointment.schedule.data), "dd 'de' MMMM, yyyy", { locale: ptBR })},{" "}
                          {appointment.schedule.hora}
                        </span>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full ${getStatusColor(appointment.status || "confirmed")}`}>
                      <span className="text-xs font-medium">
                        {getStatusText(appointment.status || "confirmed")}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="shadow-sm">
            <CardContent className="p-6 text-center">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Nenhuma consulta agendada</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={onNewAppointment}
                data-testid="button-schedule-first"
              >
                Agendar primeira consulta
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Activity */}
      <div className="px-6">
        <h3 className="text-lg font-semibold mb-4">Atividade Recente</h3>
        <div className="space-y-3">
          {appointments && appointments.length > 0 ? (
            appointments.slice(0, 2).map((appointment, index) => (
              <div key={appointment.id} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                  <Check className="text-xs text-success-foreground" size={12} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Consulta confirmada</p>
                  <p className="text-xs text-muted-foreground">
                    {appointment.specialty.nome} -{" "}
                    {format(new Date(appointment.schedule.data), "dd MMM", { locale: ptBR })}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-medium rounded-full flex items-center justify-center">
                <Bell className="text-xs text-primary-foreground" size={12} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Bem-vindo ao HealthApp</p>
                <p className="text-xs text-muted-foreground">Agende sua primeira consulta</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
