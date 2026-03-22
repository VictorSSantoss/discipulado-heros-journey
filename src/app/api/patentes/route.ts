import { NextResponse } from "next/server";
/* Import the singleton instance instead of the class */
import prisma from "@/lib/prisma"; 

export async function GET() {
  try {
    const patentes = await prisma.patente.findMany({
      orderBy: { level: "asc" },
    });
    return NextResponse.json(patentes);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed to load ranks" }, { status: 500 });
  }
}

/* Creates a new rank entry in the hierarchy */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newPatente = await prisma.patente.create({
      data: {
        level: body.level,
        title: body.title,
        xpRequired: body.xpRequired,
        tierColor: body.tierColor,
        iconUrl: body.iconUrl,
      },
    });
    return NextResponse.json(newPatente);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create the new rank" },
      { status: 500 }
    );
  }
}