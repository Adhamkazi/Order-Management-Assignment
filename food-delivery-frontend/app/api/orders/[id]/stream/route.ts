import { NextRequest } from "next/server";
import { getOrder, subscribeToOrder } from "@/lib/orders-store";
import { OrderStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const order = getOrder(params.id);

  if (!order) {
    return new Response(JSON.stringify({ error: "Order not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send current status immediately on connect
      const send = (status: OrderStatus) => {
        const data = `data: ${JSON.stringify({ status })}\n\n`;
        controller.enqueue(encoder.encode(data));
        if (status === "Delivered") {
          controller.close();
        }
      };

      // Push current status right away
      send(order.status);

      // Subscribe to future updates
      const unsubscribe = subscribeToOrder(params.id, send);

      // Cleanup when client disconnects
      return () => unsubscribe();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
