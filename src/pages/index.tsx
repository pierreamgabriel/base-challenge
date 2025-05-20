import { OrderForm } from '../components/OrderForm';
import { OrderList } from '../components/OrderList/OrderList';

export default function HomePage() {

  return (
    <div className="p-[30px]">
      <h1 className="text-[30px] font-bold mb-[30px]">Sistema de Ordens</h1>
      <OrderForm />
      <OrderList/>
    </div>
  );
}