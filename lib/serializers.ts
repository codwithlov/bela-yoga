import type { AdminUserRecord, BankRecord } from "@/types/admin";

type PlainObject = Record<string, unknown> & {
  _id?: unknown;
};

export function serializeUser(user: PlainObject): AdminUserRecord {
  return {
    id: String(user._id || ""),
    username: String(user.username || ""),
    fullName: typeof user.fullName === "string" ? user.fullName : undefined,
    phone: typeof user.phone === "string" ? user.phone : undefined,
    role: user.role === "ADMIN" ? "ADMIN" : "USER",
    createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : String(user.createdAt || ""),
    updatedAt: user.updatedAt instanceof Date ? user.updatedAt.toISOString() : String(user.updatedAt || ""),
  };
}

export function serializeBank(bank: PlainObject): BankRecord {
  return {
    id: String(bank.bankId || ""),
    name: String(bank.name || ""),
    bin: Number(bank.bin || 0),
    code: String(bank.code || ""),
    short_name: String(bank.shortName || ""),
    logo_url: typeof bank.logoUrl === "string" ? bank.logoUrl : "",
    icon_url: typeof bank.iconUrl === "string" ? bank.iconUrl : "",
    lookup_supported: bank.lookupSupported ? 1 : 0,
    swift_code: typeof bank.swiftCode === "string" ? bank.swiftCode : "",
    createdAt: bank.createdAt instanceof Date ? bank.createdAt.toISOString() : String(bank.createdAt || ""),
    updatedAt: bank.updatedAt instanceof Date ? bank.updatedAt.toISOString() : String(bank.updatedAt || ""),
  };
}