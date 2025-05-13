# Sistema de Ordens

Para rodar o projeto, clone o repositório, entre na raíz do projeto e rode os seguinte comandos:

    npm i && npm run dev

 Em outra janela do terminal:

    npx json-server db.json

Observe em qual porta o json-server está rodando e vá no arquivo `.env` e faça a alteração da variável:

    VITE_JSON_SERVER_URL=http://localhost:3000

## Como utilizar
O sistema utiliza sessões para simular usuários diferentes. Portanto, abra o sistema em duas abas diferentes do seu navegador para testar o cruzamento de ordens vindas de usuários distintos. Por exemplo, numa aba lançar uma ordem de compra de PETR4 e na outra aba lançar uma ordem de venda de PETR4. O sistema irá verificar a compatibilidade entre as ordens e decidir se podem ser executadas.

Ao clicar sobre uma ordem, um modal é aberto exibindo as informações pertinentes e histórico de status. Neste mesmo modal é possível cancelar uma ordem que ainda não foi executada.

Em Outras Ordens são exibidas as ordens que não pertencem a sessão atual (usuário atual). Ao clicar nessas ordens é possível ver os detalhes no modal, mas não é possível cancelar por se tratar de ordem enviada em outra sessão.

O campo instrumento é o ativo sendo negociado e deve estar igual tanto na ordem de compra quanto na de venda que se deseja testar. Exemplo de preenchimento do formulário:

**Ordem de Compra**
Instrumento: PETR4
Lado: Compra
Preço: 10,00
Quantidade: 5

**Ordem de Venda**
Instrumento: PETR4
Lado: Venda
Preço: 10,00
Quantidade: 5
