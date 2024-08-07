import { ISelectionLocation } from "@/models/selection.model";
import { getSelectionLocations} from "@/services/selection-services";
import { NextRequest, NextResponse } from "next/server";


export const GET = async (request: NextRequest) => {
  const locations : ISelectionLocation[] = await getSelectionLocations();

  return new NextResponse(JSON.stringify(locations), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
};