import { z } from "zod"

// Admin validation schemas
export const adminLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const createAdminSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
})

// Park validation schemas
export const createParkSchema = z.object({
  name: z.string().min(2, "Park name must be at least 2 characters"),
  code: z.string().min(2, "Park code must be at least 2 characters"),
  defaultOrigin: z.string().min(2, "Default origin must be at least 2 characters"),
})

// Agent validation schemas
export const createAgentSchema = z.object({
  name: z.string().min(2, "Agent name must be at least 2 characters"),
  code: z.string().length(4, "Agent code must be exactly 4 characters"),
  parkId: z.string().cuid("Invalid park ID"),
})

export const agentLoginSchema = z.object({
  code: z.string().length(4, "Agent code must be exactly 4 characters"),
})

// Manifest validation schemas
export const createManifestSchema = z.object({
  origin: z.string().min(2, "Origin must be at least 2 characters"),
  destination: z.string().min(2, "Destination must be at least 2 characters"),
  plateNumber: z.string().min(6, "Plate number must be at least 6 characters"),
  driverName: z.string().min(2, "Driver name must be at least 2 characters"),
  driverPhone: z.string().min(10, "Driver phone must be at least 10 characters"),
  capacity: z.number().min(4, "Capacity must be at least 4").max(20, "Capacity cannot exceed 20"),
  agentId: z.string().cuid("Invalid agent ID"),
  parkId: z.string().cuid("Invalid park ID"),
})

export const validatePlateNumberSchema = z.object({
  plateNumber: z.string().min(6, "Plate number must be at least 6 characters"),
})

// Passenger validation schemas
export const createPassengerSchema = z.object({
  name: z.string().min(2, "Passenger name must be at least 2 characters"),
  nextOfKin: z.string().min(2, "Next of kin name must be at least 2 characters"),
  nextOfKinPhone: z.string().min(10, "Next of kin phone must be at least 10 characters"),
  manifestId: z.string().cuid("Invalid manifest ID"),
  seatNumber: z.number().optional(),
})

export const bulkCreatePassengersSchema = z.object({
  passengers: z.array(createPassengerSchema),
  manifestId: z.string().cuid("Invalid manifest ID"),
})

// Search and filter schemas
export const manifestSearchSchema = z.object({
  search: z.string().optional(),
  parkId: z.string().cuid().optional(),
  agentId: z.string().cuid().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
})

export const complianceSearchSchema = z.object({
  manifestId: z.string().cuid().optional(),
  parkId: z.string().cuid().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
})

// Export types for TypeScript
export type AdminLoginInput = z.infer<typeof adminLoginSchema>
export type CreateAdminInput = z.infer<typeof createAdminSchema>
export type CreateParkInput = z.infer<typeof createParkSchema>
export type CreateAgentInput = z.infer<typeof createAgentSchema>
export type AgentLoginInput = z.infer<typeof agentLoginSchema>
export type CreateManifestInput = z.infer<typeof createManifestSchema>
export type ValidatePlateNumberInput = z.infer<typeof validatePlateNumberSchema>
export type CreatePassengerInput = z.infer<typeof createPassengerSchema>
export type BulkCreatePassengersInput = z.infer<typeof bulkCreatePassengersSchema>
export type ManifestSearchInput = z.infer<typeof manifestSearchSchema>
export type ComplianceSearchInput = z.infer<typeof complianceSearchSchema>
