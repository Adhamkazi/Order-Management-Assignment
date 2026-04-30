// Central API client — points to Express backend
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const API = {
  menu: `${BASE_URL}/api/menu`,
  orders: `${BASE_URL}/api/orders`,
  order: (id: string) => `${BASE_URL}/api/orders/${id}`,
  orderStream: (id: string) => `${BASE_URL}/api/orders/${id}/stream`,
};
