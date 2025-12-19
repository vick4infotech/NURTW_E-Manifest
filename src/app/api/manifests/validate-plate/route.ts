import { NextRequest, NextResponse } from 'next/server'
import { validatePlateNumberSchema } from '@/lib/validations'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { plateNumber } = validatePlateNumberSchema.parse(body)

    // Find active manifest with this plate number
    const manifest = await prisma.manifest.findFirst({
      where: {
        plateNumber: {
          equals: plateNumber,
          mode: 'insensitive'
        },
        isLocked: false
      },
      include: {
        park: true,
        agent: true,
        passengers: true
      }
    })

    if (!manifest) {
      return NextResponse.json(
        { error: 'No active manifest found for this vehicle' },
        { status: 404 }
      )
    }

    // Check if manifest is full
    if (manifest.passengers.length >= manifest.capacity) {
      return NextResponse.json(
        { error: 'This vehicle is at full capacity' },
        { status: 400 }
      )
    }

    // Return manifest with available seat number
    const nextSeatNumber = manifest.passengers.length + 1

    return NextResponse.json({
      manifest: {
        id: manifest.id,
        origin: manifest.origin,
        destination: manifest.destination,
        driverName: manifest.driverName,
        capacity: manifest.capacity,
        currentPassengers: manifest.passengers.length,
        nextSeatNumber
      }
    })

  } catch (error) {
    console.error('Plate validation error:', error)
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    )
  }
}
