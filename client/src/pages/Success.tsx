import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Calendar, Clock, Home, CalendarPlus, Bell, Info } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface SuccessProps {
  appointmentData: any;
  onBackToDashboard: () => void;
  onNewAppointment: () => void;
}

export default function Success({ appointmentData, onBackToDashboard, onNewAppointment }: SuccessProps) {
  return (
    <div className="min-h-screen flex flex-col justify-center p-6">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="text-2xl text-success-foreground" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Agendamento Confirmado!</h2>
        <p className="text-muted-foreground">Sua consulta foi agendada com sucesso</p>
      </div>

      {/* Appointment Details Card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="text-center border-b border-border pb-4">
              <h3 className="font-semibold text-lg" data-testid="text-success-specialty">
                {appointmentData.specialty?.nome}
              </h3>
              <p className="text-muted-foreground" data-testid="text-success-unit">
                {appointmentData.unit?.nome}
              </p>
            </div>

            <div className="flex items-center justify-center space-x-2 text-primary-dark">
              <Calendar className="w-5 h-5" />
              <span className="font-medium" data-testid="text-success-date">
                {appointmentData.date &&
                  format(new Date(appointmentData.date), "dd 'de' MMMM, yyyy", { locale: ptBR })}
              </span>
            </div>

            <div className="flex items-center justify-center space-x-2 text-primary-dark">
              <Clock className="w-5 h-5" />
              <span className="font-medium" data-testid="text-success-time">
                {appointmentData.schedule?.hora}
              </span>
            </div>

            <div className="bg-accent rounded-lg p-3 text-center">
              <p className="text-sm text-accent-foreground">
                <Info className="inline w-4 h-4 mr-1" />
                Chegue 15 minutos antes do horário
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          className="w-full bg-primary-dark text-primary-foreground py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity"
          onClick={onBackToDashboard}
          data-testid="button-back-home"
        >
          <Home className="w-4 h-4 mr-2" />
          Voltar ao Início
        </Button>

        <Button
          variant="outline"
          className="w-full py-3 px-4 rounded-lg font-medium"
          onClick={onNewAppointment}
          data-testid="button-new-appointment-success"
        >
          <CalendarPlus className="w-4 h-4 mr-2" />
          Agendar Nova Consulta
        </Button>
      </div>

      {/* Notification Setup */}
      <Card className="mt-6">
        <CardContent className="p-4">
          <h4 className="font-medium mb-2">
            <Bell className="inline w-4 h-4 mr-2 text-primary-medium" />
            Notificações
          </h4>
          <p className="text-sm text-muted-foreground mb-3">
            Deseja receber lembretes sobre sua consulta?
          </p>
          <button
            className="text-sm text-primary-medium font-medium hover:underline"
            data-testid="button-enable-notifications"
          >
            Ativar Notificações
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
