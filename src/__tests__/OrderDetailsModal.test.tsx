import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { OrderDetailsModal } from "../components/OrderDetailsModal";
import * as orderService from "../services/orderService";
import * as sessionUtils from "../utils/session";
import { Order } from "../types/order";

jest.mock("../services/orderService", () => ({
  fetchOrderById: jest.fn(),
  cancelOrder: jest.fn().mockResolvedValue(undefined)
}));

jest.mock("../utils/session", () => ({
  getSessionId: jest.fn()
}));

const originalConfirm = window.confirm;
window.confirm = jest.fn();

const mockOrder: Order = {
  id: "123",
  userSession: "user-session-1",
  instrument: "PETR4",
  side: "Compra",
  price: 25.5,
  quantity: 100,
  remainingQuantity: 50,
  status: "Aberta",
  dateHour: "2023-05-10T14:30:00Z",
  statusHistory: [
    {
      id: "status-1",
      status: "Aberta",
      dateHour: "2023-05-10T14:30:00Z"
    }
  ]
};

describe("OrderDetailsModal", () => {
  const mockOnClose = jest.fn();
  const mockRefreshOrders = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    (orderService.fetchOrderById as jest.Mock).mockResolvedValue(mockOrder);
    (sessionUtils.getSessionId as jest.Mock).mockReturnValue("user-session-1");
  });
  
  afterAll(() => {
    window.confirm = originalConfirm;
  });
  
  test("renderiza os detalhes da ordem corretamente", async () => {
    render(
      <OrderDetailsModal 
        orderId="123" 
        onClose={mockOnClose} 
        refreshOrders={mockRefreshOrders}
        allowCancel={true}
      />
    );
    
    expect(await screen.findByText("Detalhes da Ordem")).toBeInTheDocument();
    expect(await screen.findByText("123")).toBeInTheDocument();
    expect(await screen.findByText("PETR4")).toBeInTheDocument();
    expect(await screen.findByText("Compra")).toBeInTheDocument();
    expect(await screen.findByText("25.5")).toBeInTheDocument();
    expect(await screen.findByText("100")).toBeInTheDocument();
    expect(await screen.findByText("50")).toBeInTheDocument();
    
    expect(await screen.findByText("Status:")).toBeInTheDocument();
  });
  
  test("fecha o modal ao clicar no botão Fechar", async () => {
    render(
      <OrderDetailsModal 
        orderId="123" 
        onClose={mockOnClose} 
        refreshOrders={mockRefreshOrders}
      />
    );
    
    const fecharButton = await screen.findByText("Fechar");
    fireEvent.click(fecharButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
  
  test("mostra botão de cancelar quando permitido", async () => {
    render(
      <OrderDetailsModal 
        orderId="123" 
        onClose={mockOnClose} 
        refreshOrders={mockRefreshOrders}
        allowCancel={true}
      />
    );
    
    expect(await screen.findByText("Cancelar Ordem")).toBeInTheDocument();
  });
  
  test("não mostra botão de cancelar quando não permitido", async () => {
    const executedOrder = { ...mockOrder, status: "Executada" };
    (orderService.fetchOrderById as jest.Mock).mockResolvedValue(executedOrder);
    
    render(
      <OrderDetailsModal 
        orderId="123" 
        onClose={mockOnClose} 
        refreshOrders={mockRefreshOrders}
        allowCancel={true}
      />
    );
    
    await screen.findByText("Detalhes da Ordem");
    expect(screen.queryByText("Cancelar Ordem")).not.toBeInTheDocument();
  });
  
  test("cancela a ordem quando confirmado", async () => {
    (window.confirm as jest.Mock).mockReturnValue(true);
    
    render(
      <OrderDetailsModal 
        orderId="123" 
        onClose={mockOnClose} 
        refreshOrders={mockRefreshOrders}
        allowCancel={true}
      />
    );
    
    const cancelarButton = await screen.findByText("Cancelar Ordem");
    fireEvent.click(cancelarButton);
    
    await waitFor(() => {
      expect(orderService.cancelOrder).toHaveBeenCalledWith("123");
    });
    
    expect(mockRefreshOrders).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });
  
  test("não cancela a ordem quando não confirmado", async () => {
    (window.confirm as jest.Mock).mockReturnValue(false);
    
    render(
      <OrderDetailsModal 
        orderId="123" 
        onClose={mockOnClose} 
        refreshOrders={mockRefreshOrders}
        allowCancel={true}
      />
    );
    
    const cancelarButton = await screen.findByText("Cancelar Ordem");
    fireEvent.click(cancelarButton);
    
    expect(window.confirm).toHaveBeenCalledTimes(1);
    expect(orderService.cancelOrder).not.toHaveBeenCalled();
    expect(mockRefreshOrders).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});