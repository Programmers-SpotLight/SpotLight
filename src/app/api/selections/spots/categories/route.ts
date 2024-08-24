import { getSpotCategories } from '@/services/spot.services';
import { NextRequest, NextResponse } from 'next/server';


export const dynamic = 'force-dynamic';

export const GET = async(request: NextRequest) => {
  const spotCategories = await getSpotCategories();

  return new NextResponse(JSON.stringify(spotCategories), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};