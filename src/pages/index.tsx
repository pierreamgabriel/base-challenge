import { useState } from 'react';
import { OrderForm } from '../components/OrderForm';
import { OrderList } from '../components/OrderList/OrderList';

export default function HomePage() {
  const [reload, setReload] = useState(false);

  return (
    <div className="p-[30px]">
      <h1 className="text-[30px] font-bold mb-[30px]">Sistema de Ordens</h1>
      <OrderForm onOrderCreated={() => setReload(!reload)} />
      <OrderList key={reload ? 'a' : 'b'} />
    </div>
  );
}