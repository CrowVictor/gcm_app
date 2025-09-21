import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { appointmentApi } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, X, Heart, BriefcaseMedical, Bone, Baby, Stethoscope, MapPin, Clock, Check, Calendar, Hospital } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import type { Specialty, UnitWithSpecialty, Schedule, InsertAppointment } from "@shared/schema";

interface AppointmentFlowProps {
  onClose: () => void;
  onSuccess: (appointmentData: any) => void;
}

interface AppointmentData {
  specialty?: Specialty;
  unit?: UnitWithSpecialty;
  schedule?: Schedule;
  date?: string;
  observacoes?: string;
}

export default function AppointmentFlow({ onClose, onSuccess }: AppointmentFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [appointmentData, setAppointmentData] = useState<AppointmentData>({});
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const { toast } = useToast();

  const { data: specialties, isLoading: loadingSpecialties } = useQuery({
    queryKey: ["/api/specialties"],
    queryFn: () => appointmentApi.getSpecialties(),
  });

  const { data: units, isLoading: loadingUnits } = useQuery({
    queryKey: ["/api/units", appointmentData.specialty?.id],
    queryFn: () => appointmentApi.getUnits(appointmentData.specialty!.id),
    enabled: !!appointmentData.specialty,
  });

  const { data: schedules, isLoading: loadingSchedules } = useQuery({
    queryKey: ["/api/schedules", appointmentData.unit?.id, appointmentData.specialty?.id, selectedDate],
    queryFn: () => appointmentApi.getSchedules(appointmentData.unit!.id, appointmentData.specialty!.id, selectedDate),
    enabled: !!appointmentData.unit && !!appointmentData.specialty,
  });

  const createAppointmentMutation = useMutation({
    mutationFn: (data: InsertAppointment) => appointmentApi.createAppointment(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      onSuccess({
        ...appointmentData,
        id: data.id,
        date: selectedDate,
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao confirmar agendamento. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const getSpecialtyIcon = (name: string) => {
    switch (name) {
      case "Cardiologia": return Heart;
      case "Dermatologia": return BriefcaseMedical;
      case "Ortopedia": return Bone;
      case "Pediatria": return Baby;
      default: return Stethoscope;
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onClose();
    }
  };

  const selectSpecialty = (specialty: Specialty) => {
    setAppointmentData({ ...appointmentData, specialty });
    setCurrentStep(2);
  };

  const selectUnit = (unit: UnitWithSpecialty) => {
    setAppointmentData({ ...appointmentData, unit });
    setCurrentStep(3);
  };

  const selectSchedule = (schedule: Schedule) => {
    setAppointmentData({ ...appointmentData, schedule, date: selectedDate });
    setCurrentStep(4);
  };

  const confirmAppointment = () => {
    if (!appointmentData.specialty || !appointmentData.unit || !appointmentData.schedule) {
      return;
    }

    const appointmentToCreate: InsertAppointment = {
      unit_id: appointmentData.unit.id,
      specialty_id: appointmentData.specialty.id,
      schedule_id: appointmentData.schedule.id,
      status: "confirmed",
      observacoes: appointmentData.observacoes || "",
    };

    createAppointmentMutation.mutate(appointmentToCreate);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center space-x-2">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`step-indicator ${currentStep === step ? 'active' : currentStep > step ? 'completed' : ''}`}>
            {currentStep > step ? <Check className="w-4 h-4" /> : step}
          </div>
          {step < 4 && <div className="w-8 h-0.5 bg-primary-light"></div>}
        </div>
      ))}
    </div>
  );

  const renderSpecialtiesStep = () => (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Escolha a Especialidade</h3>
        <p className="text-muted-foreground">Selecione a especialidade médica desejada</p>
      </div>

      {loadingSpecialties ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {specialties?.map((specialty) => {
            const IconComponent = getSpecialtyIcon(specialty.nome);
            return (
              <button
                key={specialty.id}
                className="w-full bg-card border border-border rounded-xl p-4 text-left hover:border-primary-medium hover:bg-accent transition-colors"
                onClick={() => selectSpecialty(specialty)}
                data-testid={`button-specialty-${specialty.id}`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-light bg-opacity-20 rounded-xl flex items-center justify-center">
                    <IconComponent className="text-primary-medium" size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{specialty.nome}</h4>
                    <p className="text-sm text-muted-foreground">
                      {specialty.nome === "Cardiologia" && "Especialista em coração e sistema circulatório"}
                      {specialty.nome === "Dermatologia" && "Cuidados com a pele, cabelos e unhas"}
                      {specialty.nome === "Ortopedia" && "Tratamento de ossos, músculos e articulações"}
                      {specialty.nome === "Pediatria" && "Cuidados médicos para crianças e adolescentes"}
                    </p>
                  </div>
                  <ArrowLeft className="w-5 h-5 text-muted-foreground rotate-180" />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderUnitsStep = () => (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Escolha a Unidade</h3>
        <p className="text-muted-foreground">
          Unidades disponíveis para <span className="font-medium text-primary-medium">{appointmentData.specialty?.nome}</span>
        </p>
      </div>

      {loadingUnits ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {units?.map((unit) => (
            <button
              key={unit.id}
              className="w-full bg-card border border-border rounded-xl p-4 text-left hover:border-primary-medium hover:bg-accent transition-colors"
              onClick={() => selectUnit(unit)}
              data-testid={`button-unit-${unit.id}`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary-light bg-opacity-20 rounded-xl flex items-center justify-center">
                  <Hospital className="text-primary-medium" size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{unit.nome}</h4>
                  <p className="text-sm text-muted-foreground">
                    <MapPin className="inline w-4 h-4 mr-1" />
                    {unit.endereco}
                  </p>
                  <p className="text-sm text-success mt-1">
                    <Clock className="inline w-4 h-4 mr-1" />
                    Horários disponíveis
                  </p>
                </div>
                <ArrowLeft className="w-5 h-5 text-muted-foreground rotate-180" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const renderSchedulesStep = () => (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Escolha o Horário</h3>
        <p className="text-muted-foreground">
          Horários disponíveis em <span className="font-medium text-primary-medium">{appointmentData.unit?.nome}</span>
        </p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-2">Data da consulta</label>
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          min={format(new Date(), "yyyy-MM-dd")}
          data-testid="input-appointment-date"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-foreground mb-3">Horários disponíveis</label>
        {loadingSchedules ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {schedules?.map((schedule) => (
              <button
                key={schedule.id}
                className="schedule-slot"
                onClick={() => selectSchedule(schedule)}
                data-testid={`button-schedule-${schedule.id}`}
              >
                <div className="text-sm font-medium text-foreground">{schedule.hora}</div>
                <div className="text-xs text-success">Disponível</div>
              </button>
            ))}
            {(!schedules || schedules.length === 0) && (
              <div className="col-span-2 text-center py-8 text-muted-foreground">
                Nenhum horário disponível para esta data
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderConfirmationStep = () => (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Confirmar Agendamento</h3>
        <p className="text-muted-foreground">Revise os dados da sua consulta</p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-primary-light bg-opacity-20 rounded-lg flex items-center justify-center">
                {appointmentData.specialty && (() => {
                  const IconComponent = getSpecialtyIcon(appointmentData.specialty.nome);
                  return <IconComponent className="text-primary-medium" size={20} />;
                })()}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground" data-testid="text-confirm-specialty">
                  {appointmentData.specialty?.nome}
                </h4>
                <p className="text-sm text-muted-foreground">Especialidade selecionada</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-primary-light bg-opacity-20 rounded-lg flex items-center justify-center">
                <Hospital className="text-primary-medium" size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground" data-testid="text-confirm-unit">
                  {appointmentData.unit?.nome}
                </h4>
                <p className="text-sm text-muted-foreground">{appointmentData.unit?.endereco}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-primary-light bg-opacity-20 rounded-lg flex items-center justify-center">
                <Calendar className="text-primary-medium" size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground" data-testid="text-confirm-datetime">
                  {appointmentData.date && appointmentData.schedule && 
                    `${format(new Date(appointmentData.date), "dd 'de' MMMM, yyyy", { locale: ptBR })}, ${appointmentData.schedule.hora}`
                  }
                </h4>
                <p className="text-sm text-muted-foreground">Data e horário</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-2">Observações (opcional)</label>
        <Textarea
          placeholder="Descreva sintomas ou observações relevantes..."
          value={appointmentData.observacoes || ""}
          onChange={(e) => setAppointmentData({ ...appointmentData, observacoes: e.target.value })}
          data-testid="textarea-appointment-notes"
        />
      </div>

      <Button
        className="w-full bg-primary-dark text-primary-foreground hover:opacity-90"
        onClick={confirmAppointment}
        disabled={createAppointmentMutation.isPending}
        data-testid="button-confirm-appointment"
      >
        <Check className="w-4 h-4 mr-2" />
        {createAppointmentMutation.isPending ? "Confirmando..." : "Confirmar Agendamento"}
      </Button>

      <p className="text-xs text-muted-foreground text-center mt-4">
        Você receberá uma confirmação por email e SMS
      </p>
    </div>
  );

  return (
    <div className="min-h-screen">
      <div className="bg-primary-dark text-primary-foreground p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={goBack}
            className="p-2 rounded-full hover:bg-primary-medium transition-colors"
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold">Nova Consulta</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-primary-medium transition-colors"
            data-testid="button-close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {renderStepIndicator()}
      </div>

      {currentStep === 1 && renderSpecialtiesStep()}
      {currentStep === 2 && renderUnitsStep()}
      {currentStep === 3 && renderSchedulesStep()}
      {currentStep === 4 && renderConfirmationStep()}
    </div>
  );
}
