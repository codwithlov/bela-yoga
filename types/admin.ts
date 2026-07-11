export type UserRole = "ADMIN" | "USER";

export type SessionUser = {
  id: string;
  username: string;
  role: UserRole;
  sessionId?: string;
};

export type AdminUserRecord = {
  id: string;
  username: string;
  fullName?: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
};

export type BankRecord = {
  id: string;
  name: string;
  bin: number;
  code: string;
  short_name: string;
  logo_url: string;
  icon_url: string;
  lookup_supported: 0 | 1;
  swift_code: string;
  createdAt: string;
  updatedAt: string;
};