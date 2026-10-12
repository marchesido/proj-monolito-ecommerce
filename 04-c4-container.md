# C4 - Diagrama de Containers

O diagrama de containers detalha as unidades de execução implantáveis do sistema, protocolos de comunicação e tecnologias adotadas.

```mermaid
C4Container
    title Diagrama de Containers - Sistema E-commerce

    Person(cliente, "Cliente", "Navegador Web / App Mobile")

    System_Boundary(c1, "Sistema E-commerce") {
        Container(backend, "API / Backend Monolítico", "Node.js, Express, TypeScript", "Expõe rotas REST para módulos de domínio. Possui observabilidade embutida com Pino e endpoint /metrics.")
        ContainerDb(postgres, "Banco de Dados Relacional", "PostgreSQL (Docker)", "Armazena dados de usuários, produtos, carrinhos, pedidos e pagamentos com integridade relacional.")
    }

    System_Ext(gatewayPagamento, "Provedor de Pagamento", "Simulador HTTP / REST")

    Rel(cliente, backend, "Consome endpoints da API", "HTTPS / JSON")
    Rel(backend, postgres, "Leituras e escritas transacionais via Prisma ORM", "TCP / Porta 5432")
    Rel(backend, gatewayPagamento, "Envia payload de cobrança", "HTTPS / REST")
```

## Detalhamento dos Containers
1. **API / Backend Monolítico:**
   - **Tecnologia:** Node.js 22, Express, TypeScript.
   - **Responsabilidades:** Roteamento HTTP, execução das regras de negócio organizadas por módulos, controle de acesso e exposição de telemetria.
   - **Observabilidade embutida:** 
     - Geração e propagação de `x-request-id` por requisição.
     - Logs estruturados via `pino` enviados para `stdout`.
     - Endpoints de instrumentação: `GET /health` e `GET /metrics`.
2. **PostgreSQL (Docker):**
   - **Tecnologia:** Imagem oficial `postgres:16-alpine`.
   - **Responsabilidades:** Persistência transacional com suporte a constraints, chaves estrangeiras e índices para catálogo e pedidos.
