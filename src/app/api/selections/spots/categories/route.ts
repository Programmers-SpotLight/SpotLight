import { dbConnectionPool } from '@/libs/db';
import { NextRequest, NextResponse } from 'next/server';


export const GET = async(request: NextRequest) => {
  const categories = await dbConnectionPool('spot_category').select('*');
  const responseData = categories.map((category) => {
    return {
      id: category.spot_category_id,
      name: category.spot_category_name,
    };
  });

  return new NextResponse(JSON.stringify(responseData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};