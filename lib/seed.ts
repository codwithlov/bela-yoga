import bankTemplate from "@/data-template/bank.json";
import { connectToDatabase } from "@/lib/db";
import { ensureTemplateCmsSeed } from "@/lib/template-cms-repository";
import { Bank } from "@/models/Bank";
import { User } from "@/models/User";
import { hashSync } from "bcryptjs";

type BankTemplateRecord = {
  id: string;
  name: string;
  bin: number;
  code: string;
  short_name: string;
  logo_url: string | null;
  icon_url: string | null;
  lookup_supported: 0 | 1;
  swift_code: string | null;
};

function normalizeBankRecord(bank: BankTemplateRecord) {
  return {
    bankId: bank.id,
    name: bank.name,
    bin: bank.bin,
    code: bank.code,
    shortName: bank.short_name,
    logoUrl: bank.logo_url || undefined,
    iconUrl: bank.icon_url || undefined,
    lookupSupported: bank.lookup_supported === 1,
    swiftCode: bank.swift_code || undefined,
  };
}

async function syncBankTemplate() {
  const templateBanks = (bankTemplate.data || []) as BankTemplateRecord[];

  if (templateBanks.length === 0) {
    return;
  }

  const collection = Bank.collection;
  const indexes = await collection.indexes();
  if (indexes.some((index) => index.name === "bin_1" && index.unique)) {
    await collection.dropIndex("bin_1");
  }

  await Bank.bulkWrite(
    templateBanks.map((bank) => ({
      updateOne: {
        filter: {
          $or: [{ bankId: bank.id }, { code: bank.code }],
        },
        update: {
          $set: normalizeBankRecord(bank),
        },
        upsert: true,
      },
    })),
    { ordered: false },
  );
}

export async function ensureSeedData() {
  await connectToDatabase();

  const adminCount = await User.countDocuments({ role: "ADMIN" });
  if (adminCount === 0) {
    await User.create({
      username: process.env.ADMIN_USERNAME || "admin",
      fullName: "System Administrator",
      phone: process.env.ADMIN_PHONE || "0123456789",
      role: "ADMIN",
      passwordHash: hashSync(process.env.ADMIN_PASSWORD || "admin123456", 10),
    });
  }

  await syncBankTemplate();
  await ensureTemplateCmsSeed();
}