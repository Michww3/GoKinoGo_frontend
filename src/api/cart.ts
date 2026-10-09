import { apiClient } from "./client";

export interface CartItemPayload {
  movieId: number;
  quantity: number;
  price: number;
}

export interface ReceiptPayload {
  email: string;
  userName?: string;
  items: CartItemPayload[];
}

export interface ValidatedCartItem {
  movieId: number;
  name: string;
  posterUrl: string;
  quantity: number;
  price: number;
}

export interface CartConflictResponse {
  message: string;
  items: ValidatedCartItem[];
}

export const CartApi = {
  sendReceipt: (payload: ReceiptPayload) =>
    apiClient.post<void>("/cart/receipt", payload).then((res) => res.data),
};