# E-Commerce Monólito Modular

Projeto de arquitetura de software implementando a documentação arquitetural e o esqueleto funcional de um monólito modular para comércio eletrônico.

## Módulos do Sistema
- **usuarios:** Autenticação, registro e gestão de credenciais.
- **catalogo:** Consulta e listagem de produtos com controle de estoque.
- **carrinho:** Adição e remoção de itens em sessão ativa.
- **pedidos:** Fechamento de compras (checkout) a partir do carrinho e histórico.
- **pagamento:** Processamento simulado de cobrança e conciliação do status do pedido.

## Arquitetura e Padrões
- **Padrão Monolítico Modular:** Alta coesão interna por domínio e baixo acoplamento intermodular.
- **Camadas por Módulo:** `api` (rotas e controllers) → `app` (casos de uso) → `domain` (entidades e contratos) → `infra` (persistência e clientes).
- **Observabilidade Integrada:**
  - `x-request-id` automático propagado no cabeçalho e nos logs.
  - Logs estruturados em formato JSON com `pino`.
  - Endpoint de verificação de integridade operacional: `GET /health`.
  - Endpoint de telemetria e métricas Prometheus: `GET /metrics`.
- **Persistência:** PostgreSQL 16 via Docker com Prisma ORM e suporte a migrações e seeds automáticos.

---

## Estrutura de Pastas e Documentação
```text
.
├── 01-visao-produto.md          # Visão, público, objetivos e critérios
├── 02-requisitos.md             # Requisitos funcionais, não funcionais e observabilidade
├── 03-c4-contexto.md            # Diagrama C4 Contexto (Mermaid)
├── 04-c4-container.md           # Diagrama C4 Container (Mermaid)
├── 05-c4-componentes.md         # Diagrama C4 Componentes por módulo (Mermaid)
├── 06-modelo-dados.md           # Modelo ER e dicionário de tabelas
├── 07-contratos-api.yaml        # Especificação OpenAPI 3.0 dos endpoints
├── adrs/
│   ├── ADR-001-monolito-modular.md
│   └── ADR-002-banco-postgres.md
├── docker-compose.yml           # PostgreSQL 16 Alpine
├── prisma/
│   ├── schema.prisma            # Schema do banco de dados relacional
│   └── seed.ts                  # Carga inicial de catálogo e usuário de teste
├── src/
│   ├── app.ts                   # Montagem do Express, middlewares e rotas
│   ├── server.ts                # Inicialização do servidor HTTP
│   ├── shared/
│   │   ├── infra/database/      # Instância única do PrismaClient
│   │   └── observability/       # Logger (Pino), request-id e métricas (prom-client)
│   └── modules/
│       ├── catalogo/            # api, app, domain, infra e testes
│       ├── carrinho/            # api, app, domain, infra e testes
│       ├── pagamento/           # api, app, domain, infra e testes
│       ├── pedidos/             # api, app, domain, infra e testes
│       └── usuarios/            # api, app, domain, infra e testes
└── tsconfig.json
```

---

## Pré-requisitos
- **Node.js:** versão 20 ou superior
- **Docker e Docker Compose**

---

## Instruções de Execução

### 1. Instalação das dependências
```bash
npm install
```

### 2. Subir o banco de dados PostgreSQL
```bash
npm run docker:up
```

### 3. Gerar o client do Prisma e rodar migrações
```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```
*(Ou execute o script unificado `npm run setup`)*

### 4. Iniciar a aplicação em modo de desenvolvimento
```bash
npm run dev
```
A API estará disponível em `http://localhost:3000`.

---

## Rotas Principais

### Observabilidade
- `GET /health`: Estado operacional da aplicação e conexão com o Postgres.
- `GET /metrics`: Métricas do runtime Node.js e contadores HTTP para Prometheus.

### Negócio (/v1)
- `POST /v1/usuarios/signup`: Cadastro de usuário.
- `POST /v1/usuarios/login`: Login de usuário.
- `GET /v1/catalogo/produtos`: Listagem do catálogo.
- `POST /v1/carrinho/items`: Adiciona item ao carrinho (requer body `{ productId, qty }`).
- `DELETE /v1/carrinho/items/:itemId`: Remove item do carrinho.
- `POST /v1/checkout`: Converte carrinho ativo em pedido pendente.
- `POST /v1/pagamentos`: Processa pagamento simulado de um pedido.

---

## Execução dos Testes
Para rodar a suíte de testes unitários dos módulos:
```bash
npm test
```
