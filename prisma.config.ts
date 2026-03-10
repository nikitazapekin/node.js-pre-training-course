import { defineConfig } from "prisma/config";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

 
const envPath = path.resolve(__dirname, ".env");
const envContent = fs.readFileSync(envPath, "utf-8");
const envVars: Record<string, string> = {};
envContent.split("\n").forEach(line => {
  const [key, ...valueParts] = line.split("=");
  if (key && valueParts.length > 0) {
    const value = valueParts.join("=").replace(/^["']|["']$/g, "").trim();
    envVars[key.trim()] = value;
  }
});

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "ts-node prisma/seed.ts",
  },
  datasource: {
    url: envVars.DATABASE_URL || process.env.DATABASE_URL!,
  },
});
