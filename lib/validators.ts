import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const forgotPasswordSchema = z.object({
  email: z.string().email()
});

export const resetPasswordSchema = z.object({
  token: z.string().min(10),
  password: z.string().min(6)
});

export const analysisSchema = z.object({
  teamA: z.string().min(2),
  teamB: z.string().min(2),
  competition: z.string().min(2),
  matchDate: z.string().optional().nullable()
});

export const pixCreateSchema = z.object({
  packageId: z.string()
});

export const pixConfirmSchema = z.object({
  purchaseId: z.string()
});
