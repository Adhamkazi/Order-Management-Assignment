import { NextRequest, NextResponse } from "next/server";
import { getOrder } from "@/lib/orders-store";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const order = getOrder(params.id);

  if (!order) {
    return NextResponse.json(
      { success: false, errors: ["Order not found"] },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: order }, { status: 200 });
}
