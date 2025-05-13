import { render, screen } from "@testing-library/react";
import { OrderList } from "../components/OrderList/OrderList";

jest.mock("../services/orderService", () => ({
  fetchOrders: jest.fn().mockResolvedValue([])
}));

jest.mock("../utils/session", () => ({
  getSessionId: jest.fn().mockReturnValue("test-session")
}));

describe("OrderList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renderiza os títulos principais", () => {
    render(<OrderList />);
    
    expect(screen.getByText("Minhas Ordens")).toBeInTheDocument();
    expect(screen.getByText("Outras Ordens")).toBeInTheDocument();
  });

  test("renderiza os campos de filtro", () => {
    render(<OrderList />);
    
    expect(screen.getByPlaceholderText("Filtrar por ID")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Instrumento")).toBeInTheDocument();
    expect(screen.getByText("Todos os Lados")).toBeInTheDocument();
    expect(screen.getByText("Todos os Status")).toBeInTheDocument();
  });

  test("renderiza os cabeçalhos da tabela", () => {
    render(<OrderList />);
    
    const headers = [
      "ID", "Instrumento", "Lado", "Preço", 
      "Quantidade", "Qtd. Restante", "Status", "Data/Hora"
    ];
    
    headers.forEach(header => {
      expect(screen.getAllByText(header)[0]).toBeInTheDocument();
    });
  });

  test("exibe mensagem quando não há ordens", () => {
    render(<OrderList />);
    
    const mensagens = screen.getAllByText("Nenhuma ordem encontrada.");
    expect(mensagens.length).toBe(2);
  });
});