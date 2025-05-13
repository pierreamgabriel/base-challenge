import { useEffect, useState } from "react";
import { fetchOrders } from "../../services/orderService";
import { getSessionId } from "../../utils/session";
import { Order } from "../../types/order";
import { OrderDetailsModal } from "../OrderDetailsModal";
import { OrderListTable } from "./OrderListTable";
import { OrderListPagination } from "./OrderListPagination";

export function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    id: "",
    instrument: "",
    status: "",
    side: "",
    date: "",
  });
  const [myOrdersPage, setMyOrdersPage] = useState(1);
  const [otherOrdersPage, setOtherOrdersPage] = useState(1);
  const itemsPerPage = 10;
  const session = getSessionId();

  useEffect(() => {
  fetchOrders().then(setOrders);
  
  const interval = setInterval(() => {
    fetchOrders().then(newOrders => {
      setOrders(currentOrders => {
        if (currentOrders.length === 0) return newOrders;
        
        const updatedOrders = [...currentOrders];
        
        newOrders.forEach(newOrder => {
          const existingIndex = updatedOrders.findIndex(o => o.id === newOrder.id);
          if (existingIndex >= 0) {
            updatedOrders[existingIndex] = newOrder;
          } else {
            updatedOrders.push(newOrder);
          }
        });
  
        const newOrderIds = new Set(newOrders.map(o => o.id));
        return updatedOrders.filter(o => newOrderIds.has(o.id));
      });
    });
  }, 1000);
  
  return () => clearInterval(interval);
}, []);

  function matchesFilters(order: Order): boolean {
    return (
      (!filters.id || order.id.includes(filters.id)) &&
      (!filters.instrument ||
        order.instrument
          .toLowerCase()
          .includes(filters.instrument.toLowerCase())) &&
      (!filters.status || order.status === filters.status) &&
      (!filters.side || order.side === filters.side) &&
      (!filters.date || order.dateHour.startsWith(filters.date))
    );
  }

  const myOrders = orders.filter(
    (o) => o.userSession === session && matchesFilters(o)
  );
  const otherOrders = orders.filter(
    (o) =>
      o.userSession !== session &&
      (o.status === "Aberta" || o.status === "Parcial")
  );

  const myOrdersPagination = myOrders.slice(
    (myOrdersPage - 1) * itemsPerPage,
    myOrdersPage * itemsPerPage
  );
  const otherOrdersPagination = otherOrders.slice(
    (otherOrdersPage - 1) * itemsPerPage,
    otherOrdersPage * itemsPerPage
  );
  const myPagesTotal = Math.ceil(myOrders.length / itemsPerPage);
  const otherPagesTotal = Math.ceil(otherOrders.length / itemsPerPage);

  const fieldsStyle = "border border-[#ccc] rounded p-[2px]";

  return (
    <div>
      <h2 className="text-[20px] font-bold mb-[15px]">Minhas Ordens</h2>
      <div className="flex gap-x-[5px] mb-[1rem]">
        <input
          className={fieldsStyle}
          placeholder="Filtrar por ID"
          value={filters.id}
          onChange={(e) => setFilters({ ...filters, id: e.target.value })}
        />
        <input
          className={fieldsStyle}
          placeholder="Instrumento"
          value={filters.instrument}
          onChange={(e) =>
            setFilters({ ...filters, instrument: e.target.value })
          }
        />
        <select
          className={fieldsStyle}
          value={filters.side}
          onChange={(e) => setFilters({ ...filters, side: e.target.value })}
        >
          <option value="">Todos os Lados</option>
          <option value="Compra">Compra</option>
          <option value="Venda">Venda</option>
        </select>
        <select
          className={fieldsStyle}
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">Todos os Status</option>
          <option value="Aberta">Aberta</option>
          <option value="Parcial">Parcial</option>
          <option value="Executada">Executada</option>
          <option value="Cancelada">Cancelada</option>
        </select>
        <input
          className={fieldsStyle}
          type="date"
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
        />
      </div>

        <OrderListTable
          type="myOrders"
          myOrdersPagination={myOrdersPagination}
          otherOrdersPagination={otherOrdersPagination}
          setSelectedOrderId={setSelectedOrderId}
        />

      {myPagesTotal > 0 && (
        <OrderListPagination page={myOrdersPage} pagesTotal={myPagesTotal} setPages={setMyOrdersPage}  />
      )}

      <h2 className="text-[20px] font-bold mb-[15px]">Outras Ordens</h2>
      <OrderListTable
          type="others"
          myOrdersPagination={myOrdersPagination}
          otherOrdersPagination={otherOrdersPagination}
          setSelectedOrderId={setSelectedOrderId}
        />

      {otherPagesTotal > 0 && (
        <OrderListPagination page={otherOrdersPage} pagesTotal={otherPagesTotal} setPages={setOtherOrdersPage}  />
      )}

      {selectedOrderId && (
        <OrderDetailsModal
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
          refreshOrders={() => fetchOrders().then(setOrders)}
          allowCancel
        />
      )}
    </div>
  );
}
