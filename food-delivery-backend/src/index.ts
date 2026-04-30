import app from "./app";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("\x1b[36m%s\x1b[0m", "─────────────────────────────────────────");
  console.log("\x1b[32m%s\x1b[0m", `  🍔  Food Delivery API`);
  console.log("\x1b[32m%s\x1b[0m", `  🚀  Running on http://localhost:${PORT}`);
  console.log("\x1b[36m%s\x1b[0m", "─────────────────────────────────────────");
  console.log(`  GET  /health`);
  console.log(`  GET  /api/menu`);
  console.log(`  GET  /api/orders`);
  console.log(`  POST /api/orders`);
  console.log(`  GET  /api/orders/:id`);
  console.log(`  GET  /api/orders/:id/stream`);
  console.log("\x1b[36m%s\x1b[0m", "─────────────────────────────────────────");
});
