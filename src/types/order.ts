export interface StatusHistoryEntry {
  id: string;
  status: OrderStatus;
  dateHour: string;
}

export type OrderStatus = 'Aberta' | 'Parcial' | 'Executada' | 'Cancelada';

export type OrderSide = 'Compra' | 'Venda';

export interface Order {
  id: string;
  instrument: string;
  side: OrderSide;
  price: number;
  quantity: number;
  remainingQuantity: number;
  status: OrderStatus;
  dateHour: string;
  statusHistory?: StatusHistoryEntry[];
  userSession: string;
}