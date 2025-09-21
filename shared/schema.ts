import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cpf: varchar("cpf", { length: 11 }).notNull().unique(),
  email: text("email").notNull().unique(),
  senha_hash: text("senha_hash").notNull(),
  nome: text("nome").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const specialties = pgTable("specialties", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  nome: text("nome").notNull(),
});

export const units = pgTable("units", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  nome: text("nome").notNull(),
  specialty_id: integer("specialty_id").references(() => specialties.id),
  endereco: text("endereco"),
});

export const schedules = pgTable("schedules", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  unit_id: integer("unit_id").references(() => units.id),
  specialty_id: integer("specialty_id").references(() => specialties.id),
  hora: text("hora").notNull(), // Format: "HH:MM"
  data: text("data").notNull(), // Format: "YYYY-MM-DD"
  disponivel: integer("disponivel").default(1), // 1 = available, 0 = taken
});

export const appointments = pgTable("appointments", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  user_id: varchar("user_id").references(() => users.id),
  unit_id: integer("unit_id").references(() => units.id),
  specialty_id: integer("specialty_id").references(() => specialties.id),
  schedule_id: integer("schedule_id").references(() => schedules.id),
  status: text("status").default("pending"), // pending, confirmed, cancelled
  observacoes: text("observacoes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertSpecialtySchema = createInsertSchema(specialties).omit({
  id: true,
});

export const insertUnitSchema = createInsertSchema(units).omit({
  id: true,
});

export const insertScheduleSchema = createInsertSchema(schedules).omit({
  id: true,
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  createdAt: true,
});

// Login schema
export const loginSchema = z.object({
  emailOrCpf: z.string().min(1, "Email ou CPF é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Specialty = typeof specialties.$inferSelect;
export type InsertSpecialty = z.infer<typeof insertSpecialtySchema>;
export type Unit = typeof units.$inferSelect;
export type InsertUnit = z.infer<typeof insertUnitSchema>;
export type Schedule = typeof schedules.$inferSelect;
export type InsertSchedule = z.infer<typeof insertScheduleSchema>;
export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type LoginData = z.infer<typeof loginSchema>;

// Extended types for API responses
export type AppointmentWithDetails = Appointment & {
  specialty: Specialty;
  unit: Unit;
  schedule: Schedule;
};

export type UnitWithSpecialty = Unit & {
  specialty: Specialty;
};
