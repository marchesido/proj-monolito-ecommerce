# Requisitos do Sistema

## Requisitos Funcionais (RF)
- **RF01 - Autenticação e Registro:** O sistema deve permitir cadastro (`signup`) e login de usuários com emissão de token JWT para controle de sessão e papéis (`role`).
- **RF02 - Consulta de Catálogo:** O sistema deve listar produtos ativos com informações de SKU, nome, preço unitário e quantidade em estoque.
- **RF03 - Gestão de Carrinho:** O sistema deve permitir adicionar, atualizar quantidade e remover itens do carrinho de compras de um usuário autenticado.
- **RF04 - Processamento de Checkout:** O sistema deve consolidar os itens do carrinho em um pedido (`Order`), congelando os preços unitários no momento da compra e alterando o status para pendente de pagamento.
- **RF05 - Processamento de Pagamento:** O sistema deve receber a solicitação de pagamento, registrar a transação simulada e atualizar o status do pedido correspondente.
- **RF06 - Consulta de Pedidos:** O sistema deve permitir a consulta do histórico e dos detalhes de pedidos realizados pelo usuário.

## Requisitos Não-Funcionais (RNF)
- **RNF01 - Desempenho e Latência:** As respostas das rotas de leitura do catálogo e carrinho devem ter tempo de resposta (p95) inferior a 200ms em condições normais de tráfego.
- **RNF02 - Consistência e Atomicidade:** As operações de fechamento de pedido e dedução de estoque devem garantir propriedades ACID via transações no PostgreSQL.
- **RNF03 - Arquitetura e Modularidade:** O código deve ser organizado em módulos autocontidos (`catalogo`, `carrinho`, `pagamento`, `usuarios`, `pedidos`), proibindo acesso direto a repositórios de outros módulos sem passar por use cases ou contratos bem definidos.
- **RNF04 - Portabilidade:** O ambiente de infraestrutura de dados (PostgreSQL) deve ser executável localmente via Docker Compose sem configurações manuais complexas.

## Segurança
- **SEG01 - Proteção de Credenciais:** As senhas dos usuários devem ser armazenadas utilizando hash com sal (`bcrypt` ou `argon2`), nunca em texto puro.
- **SEG02 - Autenticação e Autorização:** Rotas sensíveis (carrinho, checkout, pagamento, consulta de pedidos) exigem envio de cabeçalho `Authorization: Bearer <token>`.
- **SEG03 - Validação de Entrada:** Todas as entradas de dados devem ser tipadas e validadas na camada de API para prevenir injeção de parâmetros indesejados.

## Observabilidade
- **OBS01 - Rastreabilidade (Request ID):** Todas as requisições HTTP devem receber ou gerar um identificador único de rastreio (`x-request-id`), propagado nos logs estruturados da transação e devolvido no cabeçalho de resposta.
- **OBS02 - Healthcheck:** Disponibilização da rota `GET /health` indicando o status operacional da aplicação e a conectividade com o banco de dados.
- **OBS03 - Métricas:** Exposição do endpoint `GET /metrics` contendo métricas do processo (uso de memória, tempo de CPU, contador de requisições por rota e latência).
- **OBS04 - Logs Estruturados:** Utilização da biblioteca `pino` para emissão de logs em formato JSON padronizado com nível de severidade (`info`, `warn`, `error`).
