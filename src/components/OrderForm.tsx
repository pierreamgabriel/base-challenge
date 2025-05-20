import { useState } from "react";
import { createOrder } from "../services/orderService";
import { getSessionId } from "../utils/session";
import { Order } from "../types/order";

export function OrderForm() {
  const [form, setForm] = useState({
    instrument: "",
    side: "Compra",
    price: undefined as number | undefined,
    quantity: undefined as number | undefined,
  });

  const [error, setError] = useState({
    instrument: false,
    price: false,
    quantity: false,
  });

  const fieldsStyle = "border border-[#ccc] rounded p-[2px]";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (
      !form.price ||
      form.price < 0.01 ||
      !form.quantity ||
      form.quantity < 1 ||
      form.instrument.length === 0
    ) {
      setError((prev) => ({
        ...prev,
        instrument: form.instrument.length === 0,
        price: !form.price || form.price < 0.01,
        quantity: !form.quantity || form.quantity < 1,
      }));
      return;
    } else {
      setError({ instrument: false, price: false, quantity: false });
    }
    const novaOrdem: Order = {
      id: crypto.randomUUID(),
      userSession: getSessionId(),
      instrument: form.instrument,
      side: form.side as "Compra" | "Venda",
      price: form.price,
      quantity: form.quantity,
      remainingQuantity: form.quantity,
      status: "Aberta",
      dateHour: new Date().toISOString(),
    };
    await createOrder(novaOrdem);
  }

  const formatPriceInput = (value?: number) => {
    if (typeof value !== "number" || isNaN(value)) return "";
    return value.toFixed(2).replace(".", ",");
  };

  return (
    <form className="flex gap-x-[5px] mb-[15px]" onSubmit={handleSubmit}>
      <input
        className={`${fieldsStyle} ${error.instrument ? "border-red-500" : ""}`}
        placeholder="Instrumento"
        required
        onChange={(e) =>
          setForm({ ...form, instrument: e.target.value.toUpperCase() })
        }
        value={form.instrument}
      />
      <select
        className={fieldsStyle}
        onChange={(e) => setForm({ ...form, side: e.target.value })}
      >
        <option value="Compra">Compra</option>
        <option value="Venda">Venda</option>
      </select>
      <input
        className={`${fieldsStyle} ${error.price ? "border-red-500" : ""}`}
        type="text"
        placeholder="Preço"
        required
        inputMode="numeric"
        value={formatPriceInput(form.price)}
        onChange={(e) => {
          const raw = e.target.value.replace(/\D/g, "");
          const cents = parseInt(raw || "0", 10);
          setForm({ ...form, price: cents / 100 });
        }}
      />
      <input
        className={`${fieldsStyle} ${error.price ? "border-red-500" : ""}`}
        type="number"
        placeholder="Quantidade"
        required
        min={1}
        step={1}
        value={form.quantity ?? ""}
        onChange={(e) => {
          const value = e.target.value;
          const num = parseInt(value, 10);
          if (!isNaN(num) && num > 0) {
            setForm({ ...form, quantity: num });
          } else {
            setForm({ ...form, quantity: undefined });
          }
        }}
      />
      <button
        className="bg-gray-100 border border-[#333] rounded p-[2px] cursor-pointer hover:bg-sky-700 hover:text-white"
        type="submit"
      >
        Criar Ordem
      </button>
    </form>
  );
}
