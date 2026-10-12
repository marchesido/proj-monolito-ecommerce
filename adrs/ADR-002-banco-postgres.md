# ADR 002: Escolha do Banco de Dados Relacional PostgreSQL

## Status
Aceito

## Contexto
Um sistema de comércio eletrônico lida fundamentalmente com transações financeiras, controle de estoque finito e garantia de integridade de dados (ex: um pedido não pode existir sem itens válidos ou com valores divergentes). A escolha do banco de dados deve priorizar segurança transacional, suporte a constraints e maturidade da ferramenta.

Foram avaliadas opções como bancos NoSQL orientados a documentos (MongoDB) e bancos relacionais (PostgreSQL, MySQL).

## Decisão
Adotar o **PostgreSQL** como o único banco de dados relacional para todos os módulos do monólito nesta fase do projeto:
1. Executado localmente em container via Docker Compose (`postgres:16-alpine`).
2. Mapeamento e migrações estruturadas via Prisma ORM.
3. Uso intensivo de transações e chaves estrangeiras para garantir integridade referencial entre entidades de negócio.

## Consequências

### Positivas
- **Garantias ACID nativas:** Essencial para evitar venda duplicada de itens com estoque unitário ou criação de pedidos com inconsistência de preços.
- **Maturidade e ecossistema:** Ferramenta estável, com excelente suporte na comunidade Node.js/TypeScript e amplo ferramental de monitoramento.
- **Suporte a tipos ricos:** Capacidade de armazenar colunas JSONB (como o payload bruto de resposta do gateway de pagamento) mantendo a estrutura relacional padrão para o restante das entidades.

### Negativas / Riscos
- **Acoplamento no banco:** Como todos os módulos compartilham o mesmo banco de dados lógico inicialmente, há o risco de junções (joins) indesejadas entre tabelas de módulos distintos.
- **Mitigação:** Cada módulo deve gerenciar suas consultas apenas por meio de seus respectivos modelos e repositórios, evitando consultas cruzadas desordenadas.
