import { useEffect, useState } from "react";
import { Order } from "../types/order";
import { fetchOrderById, cancelOrder } from "../services/orderService";
import { getSessionId } from "../utils/session";

interface Props {
  orderId: string;
  onClose: () => void;
  refreshOrders: () => void;
  allowCancel?: boolean;
}

export function OrderDetailsModal({
  orderId,
  onClose,
  refreshOrders,
  allowCancel,
}: Readonly<Props>) {
  const [order, setOrder] = useState<Order | null>(null);

  const buttonStyle =
    "bg-gray-100 border border-[#333] rounded p-[2px] cursor-pointer hover:bg-sky-700 hover:text-white";

  useEffect(() => {
    fetchOrderById(orderId).then(setOrder);
  }, [orderId]);

  const handleCancel = async () => {
    if (order && (order.status === "Aberta" || order.status === "Parcial")) {
      const confirmCancel = window.confirm(
        "Tem certeza que deseja cancelar esta ordem?"
      );
      if (confirmCancel) {
        await cancelOrder(order.id);
        refreshOrders();
        onClose();
      }
    }
  };

  const canCancel =
    allowCancel &&
    (order?.status === "Aberta" || order?.status === "Parcial") &&
    order?.userSession === getSessionId();

  if (!order) return null;

  return (
    <div>
      <div
        className="absolute bg-black opacity-30 w-full h-full top-0 left-0"
        onClick={onClose}
      />
      <div className="absolute bg-white rounded-[12px] w-[50%] top-1/2 left-1/2 p-[30px] transform -translate-x-1/2 -translate-y-1/2 shadow-xl">
        <p className="text-[20px] font-bold mb-[10px]">Detalhes da Ordem</p>
        <p>
          <strong>ID:</strong> {order.id}
        </p>
        <p>
          <strong>Instrumento:</strong> {order.instrument}
        </p>
        <p>
          <strong>Lado:</strong> {order.side}
        </p>
        <p>
          <strong>Preço:</strong> {order.price}
        </p>
        <p>
          <strong>Quantidade:</strong> {order.quantity}
        </p>
        <p>
          <strong>Quantidade Restante:</strong> {order.remainingQuantity}
        </p>
        <p>
          <strong>Status:</strong> {order.status}
        </p>
        <p>
          <strong>Data/Hora:</strong>{" "}
          {new Date(order.dateHour).toLocaleString()}
        </p>

        <h4 className="mt-6 font-semibold">Histórico de Status</h4>
        <ul className="list-disc list-inside text-sm mt-2">
          {order.statusHistory && order.statusHistory.length > 0 ? (
            order.statusHistory.map((entry) => (
              <li key={entry.id}>
                {entry.status} - {new Date(entry.dateHour).toLocaleString()}
              </li>
            ))
          ) : (
            <li>Status atual: {order.status}</li>
          )}
        </ul>

        <div style={{ marginTop: "1rem" }}>
          {canCancel &&
            (order.status === "Aberta" || order.status === "Parcial") && (
              <button
                className={buttonStyle}
                onClick={handleCancel}
                style={{ marginRight: "1rem" }}
              >
                Cancelar Ordem
              </button>
            )}
          <button className={buttonStyle} onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
