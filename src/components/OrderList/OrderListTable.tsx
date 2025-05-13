import { Order } from "../../types/order";

interface OrderListTableProps {
    type: string
    myOrdersPagination: Order[]
    otherOrdersPagination: Order[]
    setSelectedOrderId: (value: React.SetStateAction<string | null>) => void
}

export const OrderListTable = ({type, myOrdersPagination, otherOrdersPagination, setSelectedOrderId}: OrderListTableProps) => {
  const rows = type === "myOrders" ? myOrdersPagination : otherOrdersPagination;

  const renderRow = (ord: Order, index: number) => (
    <tr
      key={ord.id}
      onClick={() => setSelectedOrderId(ord.id)}
      className={`cursor-pointer ${index + 1 < rows.length && 'border-b-[1px] border-[#E0E0E0]'}`}
    >
      <td className="px-2 py-1">{ord.id}</td>
      <td className="px-2 py-1">{ord.instrument}</td>
      <td className="px-2 py-1">{ord.side}</td>
      <td className="px-2 py-1">{ord.price}</td>
      <td className="px-2 py-1">{ord.quantity}</td>
      <td className="px-2 py-1">{ord.remainingQuantity}</td>
      <td className="px-2 py-1">{ord.status}</td>
      <td className="px-2 py-1">{new Date(ord.dateHour).toLocaleString()}</td>
    </tr>
  );

  return (
    <table className="w-full table-fixed border border-gray-300">
      <thead>
        <tr className="bg-gray-100">
          <th className="w-24 px-2 py-1 border">ID</th>
          <th className="w-40 px-2 py-1 border">Instrumento</th>
          <th className="w-28 px-2 py-1 border">Lado</th>
          <th className="w-24 px-2 py-1 border">Preço</th>
          <th className="w-28 px-2 py-1 border">Quantidade</th>
          <th className="w-36 px-2 py-1 border">Qtd. Restante</th>
          <th className="w-28 px-2 py-1 border">Status</th>
          <th className="w-40 px-2 py-1 border">Data/Hora</th>
        </tr>
      </thead>
      <tbody>
        {rows.length > 0 ? (
          rows.map((item, index) => renderRow(item, index))
        ) : (
          <tr>
            <td colSpan={8} className="text-center py-4 text-gray-500">
              Nenhuma ordem encontrada.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};
