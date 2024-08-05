import { ISelectionCreateFormData } from "@/models/selection.model";
import { validateData as validateSelectionCreateFromData } from "@/services/selection-services";
import { NextRequest } from "next/server";


export const POST = async (request: NextRequest) => {
  const formData : FormData = await request.formData();
  let data : ISelectionCreateFormData = {
    temp: Boolean(formData.get("temp")),
    category: Number(formData.get("category")),
    name: String(formData.get("name")),
    description: formData.get("description") ? String(formData.get("description")) : undefined,
    spots: JSON.parse(String(formData.get("spots"))),
    hashtags: JSON.parse(String(formData.get("hashtags")))
  };

  if (formData.get("location")) {
    const location : { location: number, subLocation: number } = JSON.parse(String(formData.get("location")));
    data = {
      ...data,
      location
    };
  }

  const errorMsg : string | null = validateSelectionCreateFromData(data);
  console.log(errorMsg);
  if (errorMsg) {
    return new Response(errorMsg, {
      status: 400,
      headers: {
        "Content-Type": "text/plain"
      }
    });
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
};