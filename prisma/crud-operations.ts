import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const envPath = path.resolve(__dirname, "..", ".env");
const envContent = fs.readFileSync(envPath, "utf-8");
let connectionString = "";
envContent.split("\n").forEach((line) => {
  if (line.startsWith("DATABASE_URL=")) {
    connectionString = line.split("=").slice(1).join("=").replace(/^["']|["']$/g, "").trim();
  }
});

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });
 
async function createTodo(title: string, description: string, userId: number, status: string = "active") {
  const todo = await prisma.todo.create({
    data: {
      title,
      description,
      status,
      userId,
    },
  });
  
  return todo;
}

 
async function getAllTodos() {
  const todos = await prisma.todo.findMany();
  console.log("All todos:", todos);
  return todos;
}
 
async function getTodosByStatus(status: string) {
  const todos = await prisma.todo.findMany({
    where: { status },
  });
  console.log(`Todos with status "${status}":`, todos);
  return todos;
}
 
async function getTodosByUserId(userId: number) {
  const todos = await prisma.todo.findMany({
    where: { userId },
    include: { user: true },
  });
  console.log(`Todos for user ${userId}:`, todos);
  return todos;
}
 
async function getTodoById(id: number) {
  const todo = await prisma.todo.findUnique({
    where: { id },
    include: { user: true },
  });
  console.log(`Todo with ID ${id}:`, todo);
  return todo;
}
 
async function updateTodoStatus(id: number, newStatus: string) {
  const todo = await prisma.todo.update({
    where: { id },
    data: { status: newStatus },
  });
  console.log("Updated todo:", todo);
  return todo;
}
 
async function updateTodo(id: number, data: { title?: string; description?: string }) {
  const todo = await prisma.todo.update({
    where: { id },
    data,
  });
  console.log("Updated todo:", todo);
  return todo;
}
 
async function deleteTodo(id: number) {
  await prisma.todo.delete({
    where: { id },
  });
  console.log(`Deleted todo with ID ${id}`);
}
 
async function main() {
 
 
  console.log("CREATE");
  const newTodo = await createTodo(
    "Test CRUD operation",
    "This todo was created to demonstrate Prisma CRUD",
    1,
    "active"
  );

  console.log("READ");
  await getAllTodos();

  console.log("READ (By Status)");
  await getTodosByStatus("active");

  
  console.log("READ (By User)");
  await getTodosByUserId(1);
 
  console.log("READ (By ID)");
  await getTodoById(newTodo.id);

  console.log("UPDATE");
  await updateTodoStatus(newTodo.id, "completed");
  await updateTodo(newTodo.id, { title: "Updated: Test CRUD operation" });

  console.log("DELETE");
  await deleteTodo(newTodo.id);

  console.log("Verify Deletion");
  await getAllTodos();
}

main()
  .catch((e) => {
    console.error("CRUD operations failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
