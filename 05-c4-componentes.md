# C4 - Diagrama de Componentes

O diagrama de componentes ilustra a organização interna do backend monolítico modular. Cada módulo de negócio possui limites claros e segue a divisão em quatro camadas padronizadas.

## Padrão de Camadas por Módulo
Cada módulo (`usuarios`, `catalogo`, `carrinho`, `pedidos`, `pagamento`) é estruturado em:
- **api:** Rotas Express, controllers e validação de schema de entrada.
- **app (use cases):** Orquestração dos fluxos de negócio específicos daquele domínio.
- **domain:** Entidades de domínio, tipos, contratos de repositório e regras puras.
- **infra:** Acesso a dados (Prisma/Postgres) e integração com serviços externos.

```mermaid
C4Component
    title Diagrama de Componentes - Monólito Modular

    Container_Boundary(api_boundary, "Módulos do Monólito (src/modules)") {
        
        Component(modUsuarios, "Módulo Usuários", "API → App → Domain → Infra", "Autenticação, registro e geração de tokens JWT.")
        Component(modCatalogo, "Módulo Catálogo", "API → App → Domain → Infra", "Consulta de produtos, listagem e controle de estoque.")
        Component(modCarrinho, "Módulo Carrinho", "API → App → Domain → Infra", "Gerenciamento de itens ativos e cálculo de subtotal.")
        Component(modPedidos, "Módulo Pedidos & Checkout", "API → App → Domain → Infra", "Criação de pedidos a partir do carrinho e histórico.")
        Component(modPagamento, "Módulo Pagamento", "API → App → Domain → Infra", "Processamento e conciliação simulada de transações.")

    }

    ContainerDb(db, "PostgreSQL", "Tabelas do Banco", "Persistência única particionada logicamente por módulo.")

    Rel(modCarrinho, modCatalogo, "Consulta preço e disponibilidade de itens", "Chamada de Use Case / In-process")
    Rel(modPedidos, modCarrinho, "Consome dados do carrinho para fechamento", "Chamada de Use Case / In-process")
    Rel(modPedidos, modPagamento, "Dispara requisição de pagamento do pedido", "Chamada de Use Case / In-process")
    
    Rel(modUsuarios, db, "Lê e grava users", "Prisma Client")
    Rel(modCatalogo, db, "Lê e grava products", "Prisma Client")
    Rel(modCarrinho, db, "Lê e grava carts e cart_items", "Prisma Client")
    Rel(modPedidos, db, "Lê e grava orders e order_items", "Prisma Client")
    Rel(modPagamento, db, "Lê e grava payments", "Prisma Client")
```

## Fluxo Interno em Cada Módulo

```mermaid
graph TD
    subgraph "Estrutura do Módulo"
        A["Camada API (Routes / Controllers)"] --> B["Camada App (Use Cases)"]
        B --> C["Camada Domain (Entities / Contracts)"]
        D["Camada Infra (Prisma Repositories)"] -.->|Implementa| C
        B --> D
    end
```

### Regras de Acoplamento Modular
1. Um módulo não acessa tabelas de outro módulo diretamente via SQL ou Prisma de forma desordenada.
2. Comunicação entre módulos em tempo de execução ocorre por chamadas diretas a use cases ou interfaces de serviço expostas pelo módulo de destino.
3. Não há dependências circulares entre os módulos.
