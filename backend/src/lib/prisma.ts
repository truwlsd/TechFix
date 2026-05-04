import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const dbUrl = process.env.DATABASE_URL || "file:./dev.db";

/** libSQL вместо better-sqlite3 — без нативного ABI-конфликта при смене версии Node. */
const adapter = new PrismaLibSql({ url: dbUrl });

export const prisma = new PrismaClient({ adapter });
