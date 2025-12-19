import { NextRequest, NextResponse } from 'next/server'
import { createPassengerSchema } from '@/lib/validations'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const passengerData = createPassengerSchema.parse(body)

    // Verify manifest exists and is not locked
    const manifest = await prisma.manifest.findUnique({
      where: { id: passengerData.manifestId },
      include: { passengers: true }
    })

    if (!manifest) {
      return NextResponse.json(
        { error: 'Manifest not found' },
        { status: 404 }
      )
    }

    if (manifest.isLocked) {
      return NextResponse.json(
        { error: 'This manifest has been finalized' },
        { status: 400 }
      )
    }

    // Check capacity
    if (manifest.passengers.length >= manifest.capacity) {
      return NextResponse.json(
        { error: 'Vehicle is at full capacity' },
        { status: 400 }
      )
    }

    // Create passenger
    const passenger = await prisma.passenger.create({
      data: {
        name: passengerData.name,
        nextOfKin: passengerData.nextOfKin,
        nextOfKinPhone: passengerData.nextOfKinPhone,
        manifestId: passengerData.manifestId,
        seatNumber: passengerData.seatNumber || manifest.passengers.length + 1
      },
      include: {
        manifest: {
          select: {
            origin: true,
            destination: true,
            plateNumber: true,
            driverName: true
          }
        }
      }
    })

    return NextResponse.json({ passenger })

  } catch (error) {
    console.error('Passenger creation error:', error)
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const manifestId = searchParams.get('manifestId')

    if (!manifestId) {
      return NextResponse.json(
        { error: 'Manifest ID is required' },
        { status: 400 }
      )
    }

    const passengers = await prisma.passenger.findMany({
      where: { manifestId },
      orderBy: { seatNumber: 'asc' },
      include: {
        manifest: {
          select: {
            origin: true,
            destination: true,
            plateNumber: true
          }
        }
      }
    })

    return NextResponse.json({ passengers })

  } catch (error) {
    console.error('Passengers fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch passengers' },
      { status: 500 }
    )
  }
}
