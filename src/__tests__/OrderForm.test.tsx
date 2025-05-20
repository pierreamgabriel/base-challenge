import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { OrderForm } from "../components/OrderForm";
import * as orderService from "../services/orderService";

jest.mock("../services/orderService", () => ({
  createOrder: jest.fn().mockResolvedValue(undefined)
}));

jest.mock("../utils/session", () => ({
  getSessionId: jest.fn().mockReturnValue("test-session")
}));

const mockUUID = "test-uuid-123";
const originalCrypto = window.crypto;
Object.defineProperty(window, 'crypto', {
  value: {
    ...window.crypto,
    randomUUID: () => mockUUID
  }
});

describe("OrderForm", () => {
  
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  afterAll(() => {
    Object.defineProperty(window, 'crypto', {
      value: originalCrypto
    });
  });
  
  test("renderiza o formulário corretamente", () => {
    render(<OrderForm />);
    
    expect(screen.getByPlaceholderText("Instrumento")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Preço")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Quantidade")).toBeInTheDocument();
    expect(screen.getByText("Compra")).toBeInTheDocument();
    expect(screen.getByText("Venda")).toBeInTheDocument();
    expect(screen.getByText("Criar Ordem")).toBeInTheDocument();
  });
  
  test("preenche e submete o formulário com sucesso", async () => {
    render(<OrderForm />);
    
    const instrumentInput = screen.getByPlaceholderText("Instrumento");
    fireEvent.change(instrumentInput, { target: { value: "petr4" } });
    
    const priceInput = screen.getByPlaceholderText("Preço");
    fireEvent.change(priceInput, { target: { value: "2550" } });
    
    const quantityInput = screen.getByPlaceholderText("Quantidade");
    fireEvent.change(quantityInput, { target: { value: "100" } });
    
    const sideSelect = screen.getByRole("combobox");
    fireEvent.change(sideSelect, { target: { value: "Venda" } });
    
    const submitButton = screen.getByText("Criar Ordem");
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(orderService.createOrder).toHaveBeenCalledWith(expect.objectContaining({
        instrument: "PETR4",
        side: "Venda",
        price: 25.5,
        quantity: 100,
        userSession: "test-session"
      }));
    });
  });
  
  test("converte o instrumento para maiúsculas", () => {
    render(<OrderForm />);
    
    const instrumentInput = screen.getByPlaceholderText("Instrumento");
    fireEvent.change(instrumentInput, { target: { value: "petr4" } });
    
    expect(instrumentInput).toHaveValue("PETR4");
  });
  
  test("formata o preço corretamente", () => {
    render(<OrderForm />);
    
    const priceInput = screen.getByPlaceholderText("Preço");
    fireEvent.change(priceInput, { target: { value: "2550" } });
    
    expect(priceInput).toHaveValue("25,50");
  });
});