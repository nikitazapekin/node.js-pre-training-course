import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
 
const envPath = path.resolve(__dirname, "..", ".env");
const envContent = fs.readFileSync(envPath, "utf-8");
let connectionString = "";
envContent.split("\n").forEach(line => {
  if (line.startsWith("DATABASE_URL=")) {
    connectionString = line.split("=").slice(1).join("=").replace(/^["']|["']$/g, "").trim();
  }
});

const adapter = new PrismaPg({ connectionString });

const prisma = new PrismaClient({ adapter });

async function main() {
  
  const user1 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'john@example.com',
    },
  });
  

  const user2 = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      name: 'Jane Smith',
      email: 'jane@example.com',
    },
  });
 
  const todo1 = await prisma.todo.create({
    data: {
      title: 'Complete project setup',
      description: 'Set up the initial project structure and dependencies',
      status: 'active',
      userId: user1.id,
    },
  });
 

  const todo2 = await prisma.todo.create({
    data: {
      title: 'Learn Prisma ORM',
      description: 'Study Prisma models, migrations, and queries',
      status: 'active',
      userId: user1.id,
    },
  });
  

  const todo3 = await prisma.todo.create({
    data: {
      title: 'Build REST API',
      description: 'Create endpoints for todo management',
      status: 'completed',
      userId: user1.id,
    },
  });
 
  const todo4 = await prisma.todo.create({
    data: {
      title: 'Write documentation',
      description: 'Document all API endpoints and usage examples',
      status: 'active',
      userId: user2.id,
    },
  });
  

  const todo5 = await prisma.todo.create({
    data: {
      title: 'Code review',
      description: 'Review pull requests from team members',
      status: 'active',
      userId: user2.id,
    },
  });
 

  const todo6 = await prisma.todo.create({
    data: {
      title: 'Set up CI/CD',
      description: 'Configure continuous integration and deployment',
      status: 'completed',
      userId: user2.id,
    },
  });
 
 
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
