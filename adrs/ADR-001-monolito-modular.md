# ADR 001: Adoção do Padrão Monólito Modular

## Status
Aceito

## Contexto
O sistema de e-commerce está em fase inicial de concepção e desenvolvimento. Uma decisão arquitetural precipitada por microsserviços traria complexidade operacional elevada, latência de rede entre serviços, necessidade de infraestrutura distribuída (mensageria, service discovery, distributed tracing) e dificuldades de manter consistência transacional entre catálogo, carrinho e fechamento de pedidos.

Por outro lado, um monólito tradicional não estruturado (big ball of mud) tende a gerar forte acoplamento com o passar do tempo, dificultando testes e futura separação de componentes.

## Decisão
Decidiu-se pela construção de um **Monólito Modular** em Node.js com TypeScript:
1. Uma única base de código implantada como uma única unidade de runtime (deploy atômico).
2. Divisão estrita em módulos independentes (`catalogo`, `carrinho`, `pagamento`, `usuarios`, `pedidos`).
3. Cada módulo organiza seu código internamente em camadas: `api`, `app` (use cases), `domain` e `infra`.
4. Comunicação entre módulos realizada exclusivamente via chamadas a use cases públicos ou interfaces explícitas, sem acesso cruzado direto a tabelas e repositórios alheios.

## Consequências

### Positivas
- **Simplicidade de desenvolvimento:** Fácil de rodar, debugar e testar localmente em um único processo.
- **Deploy atômico:** Sem preocupações com versionamento de contratos de rede distribuídos ou quebra de compatibilidade em deploy parcial.
- **Consistência transacional:** Facilidade para orquestrar operações críticas (checkout e pedido) em transações ACID no banco relacional quando necessário.
- **Caminho para microsserviços:** Como os módulos possuem fronteiras e contratos claros, a extração de qualquer módulo para um serviço independente futuro torna-se viável com baixo atrito.

### Negativas / Riscos
- **Risco de erosão arquitetural:** Se os desenvolvedores quebrarem as regras de isolamento e acessarem diretamente repositórios de outros módulos, o monólito pode se tornar acoplado.
- **Mitigação:** Regras de linting/arquitetura, testes de integração entre módulos e revisões de código rigorosas para preservar as fronteiras modulares.
