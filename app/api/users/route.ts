import { NextResponse } from "next/server";
//import prisma from "@/lib/prisma";

// 🔹 GET: Fetch all users
export async function GET() {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}

// 🔹 POST: Create a new user
export async function POST(req: Request) {
  const { email, name, avatar } = await req.json();
  const user = await prisma.user.create({ data: { email, name, avatar } });
  return NextResponse.json(user);
}

// 🔹 PUT: Update a user by ID
export async function PUT(req: Request) {
  const { id, name, avatar } = await req.json();
  const user = await prisma.user.update({ where: { id }, data: { name, avatar } });
  return NextResponse.json(user);
}

// 🔹 DELETE: Remove a user by ID
export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ message: "User deleted" });
}
