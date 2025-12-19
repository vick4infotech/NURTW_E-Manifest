import { NextRequest, NextResponse } from "next/server";
import { createPassengerSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, nextOfKin, nextOfKinPhone, manifestId, seatNumber } =
      createPassengerSchema.parse(body);

    // Fetch manifest + current passenger count
    const manifest = await prisma.manifest.findUnique({
      where: { id: manifestId },
      include: { passengers: { select: { seatNumber: true } } },
    });

    if (!manifest) {
      return NextResponse.json({ error: "Manifest not found" }, { status: 404 });
    }

    if (manifest.isLocked) {
      return NextResponse.json(
        { error: "Manifest is locked and cannot accept new passengers" },
        { status: 400 }
      );
    }

    if (manifest.passengers.length >= manifest.capacity) {
      return NextResponse.json({ error: "Manifest is full" }, { status: 400 });
    }

    const taken = new Set<number>(
      manifest.passengers
        .map((p) => p.seatNumber)
        .filter((n): n is number => typeof n === "number")
    );

    // Pick requested seat (if provided) or next available seat
    let assignedSeat: number | undefined = seatNumber;
    if (assignedSeat != null) {
      if (assignedSeat < 1 || assignedSeat > manifest.capacity) {
        return NextResponse.json(
          { error: `Seat number must be between 1 and ${manifest.capacity}` },
          { status: 400 }
        );
      }
      if (taken.has(assignedSeat)) {
        return NextResponse.json({ error: "Seat already taken" }, { status: 409 });
      }
    } else {
      for (let s = 1; s <= manifest.capacity; s++) {
        if (!taken.has(s)) {
          assignedSeat = s;
          break;
        }
      }
      if (assignedSeat == null) {
        return NextResponse.json({ error: "No available seat" }, { status: 400 });
      }
    }

    // Create passenger. Unique constraint on (manifestId, seatNumber) protects races.
    const passenger = await prisma.passenger.create({
      data: {
        name,
        nextOfKin,
        nextOfKinPhone,
        manifestId,
        seatNumber: assignedSeat,
      },
    });

    return NextResponse.json({ passenger }, { status: 201 });
  } catch (error: any) {
    // Handle uniqueness violations cleanly
    if (error?.code === "P2002") {
      return NextResponse.json({ error: "Seat already taken" }, { status: 409 });
    }

    console.error("Passenger creation error:", error);
    return NextResponse.json(
      { error: "Failed to create passenger" },
      { status: 500 }
    );
  }
}
