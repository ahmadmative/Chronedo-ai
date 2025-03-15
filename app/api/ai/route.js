import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request) {
  try {
    const { imageUrl } = await request.json();

    //  payload
    const payload = {
      imageUrl: imageUrl,
      textPrompt: "Leather background",
    };

    
    if (process.env.NEXT_PUBLIC_LIGHTX_STYLE_IMAGE_URL) {
      payload.styleImageUrl = process.env.NEXT_PUBLIC_LIGHTX_STYLE_IMAGE_URL;
    }

    console.log("Request payload:", payload);

    // API request to LightX
    const response = await axios.post(
      "https://api.lightxeditor.com/external/api/v1/product-photoshoot",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_LIGHTX_API_KEY,
        },
      }
    );

    const data = response.data;
    console.log("Response from AI background generation:", data);

    if (data.statusCode === 2000) {
      const { orderId } = data.body;
      return NextResponse.json({ orderId }, { status: 200 });
    } else {
      throw new Error("Failed to generate background.");
    }
  } catch (error) {
    console.error("Error generating background:", error);
    return NextResponse.json(
      { message: error.message || "An error occurred" },
      { status: 500 }
    );
  }
}