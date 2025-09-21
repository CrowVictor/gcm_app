import { useState, useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Success from "@/pages/Success";
import AppointmentFlow from "@/components/AppointmentFlow";
import { authService } from "@/services/auth";

type AppScreen = "login" | "dashboard" | "appointment" | "success";

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("login");
  const [appointmentData, setAppointmentData] = useState<any>(null);

  useEffect(() => {
    // Check for existing authentication
    if (authService.isAuthenticated()) {
      setCurrentScreen("dashboard");
    }
  }, []);

  const handleLoginSuccess = () => {
    setCurrentScreen("dashboard");
  };

  const handleNewAppointment = () => {
    setCurrentScreen("appointment");
  };

  const handleAppointmentSuccess = (data: any) => {
    setAppointmentData(data);
    setCurrentScreen("success");
  };

  const handleBackToDashboard = () => {
    setCurrentScreen("dashboard");
    setAppointmentData(null);
  };

  const handleCloseAppointment = () => {
    setCurrentScreen("dashboard");
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case "login":
        return <Login onLoginSuccess={handleLoginSuccess} />;
      case "dashboard":
        return <Dashboard onNewAppointment={handleNewAppointment} />;
      case "appointment":
        return (
          <AppointmentFlow
            onClose={handleCloseAppointment}
            onSuccess={handleAppointmentSuccess}
          />
        );
      case "success":
        return (
          <Success
            appointmentData={appointmentData}
            onBackToDashboard={handleBackToDashboard}
            onNewAppointment={handleNewAppointment}
          />
        );
      default:
        return <Dashboard onNewAppointment={handleNewAppointment} />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Layout>{renderCurrentScreen()}</Layout>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
