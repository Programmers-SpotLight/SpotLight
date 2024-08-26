import { getSpotCategories } from '@/services/spot.services';
import { NextRequest, NextResponse } from 'next/server';


export const dynamic = 'force-dynamic';

export const GET = async (request: NextRequest) => {
  try {
    const spotCategories = await getSpotCategories();
    return NextResponse.json(spotCategories, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: error.statusCode || 500 }
    );
  }
};