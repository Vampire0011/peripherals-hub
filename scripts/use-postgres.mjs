// Switches prisma/schema.prisma from SQLite to PostgreSQL (and back with --sqlite).
import { readFileSync, writeFileSync } from "node:fs";
const file = new URL("../prisma/schema.prisma", import.meta.url);
const toSqlite = process.argv.includes("--sqlite");
const from = toSqlite ? "postgresql" : "sqlite";
const to = toSqlite ? "sqlite" : "postgresql";
const src = readFileSync(file, "utf8");
const out = src.replace(new RegExp(`provider\\s*=\\s*"${from}"`), `provider = "${to}"`);
if (src === out) console.log(`Schema already uses ${to}.`);
else { writeFileSync(file, out); console.log(`Schema provider switched: ${from} -> ${to}`); }
