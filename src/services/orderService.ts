import axios from "axios";
import { Order, OrderStatus } from "../types/order";
const API_URL = `${import.meta.env.VITE_JSON_SERVER_URL}/orders`;

const generateNumericId = () =>
    Math.floor(Math.random() * 1_000_000_000).toString();

export async function fetchOrders(): Promise<Order[]> {
  const res = await axios.get(API_URL);
  return res.data;
}

export async function fetchOrder(id: string): Promise<Order> {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
}

export async function fetchOrderById(id: string): Promise<Order> {
  const res = await axios.get<Order>(`${API_URL}/${id}`);
  return res.data;
}

export async function cancelOrder(id: string): Promise<void> {
  const order = await fetchOrderById(id);
  if (!['Aberta', 'Parcial'].includes(order.status)) return;

  const now = new Date().toISOString();
  const newStatusHistory = [
    ...(order.statusHistory || []),
    {
      id: generateNumericId(),
      status: 'Cancelada' as OrderStatus,
      dateHour: now,
    },
  ];

  const updatedOrder: Order = {
    ...order,
    status: 'Cancelada',
    statusHistory: newStatusHistory,
  };

  await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedOrder),
  });
}

export async function createOrder(order: Omit<Order, 'id' | 'status' | 'remainingQuantity' | 'dateHour' | 'statusHistory'>): Promise<void> {
  const allOrders = await fetchOrders();
  const now = new Date().toISOString();
  const id = generateNumericId();

  const newOrder: Order = {
    ...order,
    id,
    status: 'Aberta',
    remainingQuantity: order.quantity,
    dateHour: now,
    statusHistory: [
      {
        id: generateNumericId(),
        status: 'Aberta',
        dateHour: now,
      },
    ],
  };

  const counterparts = allOrders
    .filter(o =>
      o.instrument === order.instrument &&
      o.side !== order.side &&
      o.status !== 'Executada' &&
      o.status !== 'Cancelada' &&
      o.remainingQuantity > 0 &&
      (
        (order.side === 'Compra' && order.price >= o.price) ||
        (order.side === 'Venda' && order.price <= o.price)
      )
    )
    .sort((a, b) =>
      order.side === 'Compra' ? a.price - b.price : b.price - a.price
    );

  for (const counterpart of counterparts) {
    if (newOrder.remainingQuantity === 0) break;

    const processedQtd = Math.min(newOrder.remainingQuantity, counterpart.remainingQuantity);
    const newCounterpartQtd = counterpart.remainingQuantity - processedQtd;
    const newCounterpartStatus = newCounterpartQtd === 0 ? 'Executada' : 'Parcial';

    const newCounterpartHistory = [
      ...(counterpart.statusHistory ?? []),
      {
        id: generateNumericId(),
        status: newCounterpartStatus,
        dateHour: now,
      }
    ];

    await fetch(`${API_URL}/${counterpart.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...counterpart,
        remainingQuantity: newCounterpartQtd,
        status: newCounterpartStatus,
        statusHistory: newCounterpartHistory,
      }),
    });

    newOrder.remainingQuantity -= processedQtd;
  }

  const finalStatus: OrderStatus = newOrder.remainingQuantity === 0
    ? 'Executada'
    : (newOrder.remainingQuantity < newOrder.quantity ? 'Parcial' : 'Aberta');
  
  newOrder.status = finalStatus;

  if (finalStatus !== 'Aberta') {
    newOrder.statusHistory?.push({
      id: generateNumericId(),
      status: finalStatus,
      dateHour: now,
    });
  }

  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newOrder),
  });
}

