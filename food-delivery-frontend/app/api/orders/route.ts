import { NextRequest, NextResponse } from "next/server";
import { createOrder, getAllOrders } from "@/lib/orders-store";
import { validateOrderPayload } from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { valid, errors } = validateOrderPayload(body);

    if (!valid) {
      return NextResponse.json(
        { success: false, errors },
        { status: 400 }
      );
    }

    const order = createOrder(body);
    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, errors: ["Invalid JSON body"] },
      { status: 400 }
    );
  }
}

export async function GET() {
  const orders = getAllOrders();
  return NextResponse.json({ success: true, data: orders }, { status: 200 });
}
