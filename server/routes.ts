import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { loginSchema, insertAppointmentSchema } from "@shared/schema";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.SESSION_SECRET || "fallback_secret_key";

export async function registerRoutes(app: Express): Promise<Server> {
  // Login endpoint
  app.post("/api/login", async (req, res) => {
    try {
      const { emailOrCpf, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmailOrCpf(emailOrCpf);
      
      if (!user || password !== "123456") { // Simple password check for demo
        return res.status(401).json({ message: "Credenciais inválidas" });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

      res.json({
        token,
        user: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          cpf: user.cpf,
        },
      });
    } catch (error) {
      res.status(400).json({ message: "Dados inválidos" });
    }
  });

  // Middleware for authenticated routes
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token não fornecido" });
    }

    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
      if (err) {
        return res.status(403).json({ message: "Token inválido" });
      }
      req.userId = decoded.userId;
      next();
    });
  };

  // Get all specialties
  app.get("/api/specialties", async (req, res) => {
    try {
      const specialties = await storage.getAllSpecialties();
      res.json(specialties);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar especialidades" });
    }
  });

  // Get units by specialty
  app.get("/api/units", async (req, res) => {
    try {
      const specialtyId = parseInt(req.query.specialty as string);
      
      if (!specialtyId) {
        return res.status(400).json({ message: "ID da especialidade é obrigatório" });
      }

      const units = await storage.getUnitsBySpecialty(specialtyId);
      res.json(units);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar unidades" });
    }
  });

  // Get schedules by unit and specialty
  app.get("/api/schedules", async (req, res) => {
    try {
      const unitId = parseInt(req.query.unit as string);
      const specialtyId = parseInt(req.query.specialty as string);
      const data = req.query.data as string;

      if (!unitId || !specialtyId || !data) {
        return res.status(400).json({ message: "Parâmetros obrigatórios: unit, specialty, data" });
      }

      const schedules = await storage.getSchedulesByUnitAndSpecialty(unitId, specialtyId, data);
      res.json(schedules);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar horários" });
    }
  });

  // Create appointment
  app.post("/api/appointments", authenticateToken, async (req: any, res) => {
    try {
      const appointmentData = insertAppointmentSchema.parse({
        ...req.body,
        user_id: req.userId,
      });

      const appointment = await storage.createAppointment(appointmentData);
      res.status(201).json(appointment);
    } catch (error) {
      res.status(400).json({ message: "Erro ao criar agendamento" });
    }
  });

  // Get user appointments
  app.get("/api/appointments", authenticateToken, async (req: any, res) => {
    try {
      const appointments = await storage.getAppointmentsByUser(req.userId);
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar agendamentos" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
