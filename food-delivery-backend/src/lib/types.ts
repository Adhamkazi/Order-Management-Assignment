export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  badge?: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export type OrderStatus =
  | "Order Received"
  | "Preparing"
  | "Out for Delivery"
  | "Delivered";

export interface DeliveryDetails {
  name: string;
  address: string;
  phone: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  delivery: DeliveryDetails;
  status: OrderStatus;
  total: number;
  createdAt: string;
}

export interface PlaceOrderPayload {
  items: CartItem[];
  delivery: DeliveryDetails;
  total: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  errors?: string[];
  message?: string;
}
