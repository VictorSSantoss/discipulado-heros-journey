import { NextResponse } from "next/server";
/* 1. Import the singleton instance to prevent connection crashes */
import prisma from "@/lib/prisma";

/* Updates a specific rank's properties such as title, XP requirement, or color */
export async function PUT(
  request: Request,
  /* 2. Type params as a Promise for modern Next.js compatibility */
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    /* 3. Await the params before using the ID */
    const { id } = await params;
    const body = await request.json();
    
    const updatedPatente = await prisma.patente.update({
      where: { id },
      data: {
        title: body.title,
        xpRequired: body.xpRequired,
        tierColor: body.tierColor,
        iconUrl: body.iconUrl,
      },
    });
    
    return NextResponse.json(updatedPatente);
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      { error: "Failed to update the rank configuration" },
      { status: 500 }
    );
  }
}

/* Removes a rank from the hierarchy */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await prisma.patente.delete({
      where: { id },
    });
    
    return NextResponse.json({ message: "Rank deleted successfully" });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { error: "Failed to remove the rank" },
      { status: 500 }
    );
  }
}