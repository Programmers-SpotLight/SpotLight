import { ISelectionLocation } from "@/models/selection.model";
import { getSelectionLocations} from "@/services/selection.services";
import { NextRequest, NextResponse } from "next/server";


export const GET = async (request: NextRequest) => {
  try {
    const locations : ISelectionLocation[] = await getSelectionLocations();

    return new NextResponse(JSON.stringify(locations), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error: any) {
    return new NextResponse(error.message, {
      status: error.statusCode || 500,
      headers: {
        "Content-Type": "text/plain"
      }
    });
  }
};