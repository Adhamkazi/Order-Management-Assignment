import { NextResponse } from "next/server";
import { menuItems } from "@/lib/menu-data";

export async function GET() {
  return NextResponse.json(
    { success: true, data: menuItems },
    { status: 200 }
  );
}
