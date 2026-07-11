import { randomUUID } from "crypto";
import { z } from "zod";

const roleSchema = z.enum(["ADMIN", "USER"]);

const bankSchemaCore = z.object({
  id: z.string().trim().min(1).default(() => randomUUID()),
  name: z.string().trim().min(3, "Tên ngân hàng phải có ít nhất 3 ký tự."),
  bin: z.coerce.number().int().positive("BIN phải là số dương."),
  code: z.string().trim().min(2, "Code phải có ít nhất 2 ký tự.").transform((value) => value.toUpperCase()),
  short_name: z.string().trim().min(2, "Short name phải có ít nhất 2 ký tự.").transform((value) => value.toUpperCase()),
  logo_url: z.string().trim().url("Logo URL không hợp lệ.").optional().or(z.literal("")),
  icon_url: z.string().trim().url("Icon URL không hợp lệ.").optional().or(z.literal("")),
  lookup_supported: z.coerce.number().int().min(0).max(1),
  swift_code: z.string().trim().optional().or(z.literal("")).transform((value) => value?.toUpperCase() || ""),
});

export const loginSchema = z.object({
  username: z.string().trim().min(3, "Username phải có ít nhất 3 ký tự."),
  password: z.string().min(6, "Password phải có ít nhất 6 ký tự."),
});

export const createUserSchema = z.object({
  username: z.string().trim().min(3, "Username phải có ít nhất 3 ký tự."),
  fullName: z.string().trim().optional().or(z.literal("")),
  phone: z.string().trim().optional().or(z.literal("")),
  role: roleSchema,
  password: z.string().min(6, "Password phải có ít nhất 6 ký tự."),
});

export const updateUserSchema = z.object({
  username: z.string().trim().min(3, "Username phải có ít nhất 3 ký tự.").optional(),
  fullName: z.string().trim().optional().or(z.literal("")),
  phone: z.string().trim().optional().or(z.literal("")),
  role: roleSchema.optional(),
  password: z.string().min(6, "Password phải có ít nhất 6 ký tự.").optional(),
});

export const createBankSchema = bankSchemaCore;

export const updateBankSchema = bankSchemaCore.partial();