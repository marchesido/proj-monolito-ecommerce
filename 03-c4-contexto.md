# C4 - Diagrama de Contexto

O diagrama de contexto apresenta as fronteiras do sistema de e-commerce, seus atores diretos e as integrações externas planejadas.

```mermaid
C4Context
    title Diagrama de Contexto - Sistema E-commerce

    Person(cliente, "Cliente", "Usuário que consome a plataforma via navegador web ou aplicativo móvel.")
    
    System(monolito, "Sistema E-commerce (Monólito)", "Responsável pela autenticação, catálogo de produtos, gestão de carrinho, orquestração de checkout e pedidos.")
    
    System_Ext(gatewayPagamento, "Provedor de Pagamento (Simulado)", "Gateway parceiro responsável por autorizar e liquidar transações financeiras.")
    System_Ext(notificacoes, "Serviço de Notificações [Futuro]", "Serviço externo para disparo de confirmações de pedido via e-mail e push notification.")

    Rel(cliente, monolito, "Navega, gerencia carrinho e finaliza compras", "HTTPS / REST")
    Rel(monolito, gatewayPagamento, "Submete transações de pagamento e consulta status", "HTTPS / REST")
    Rel(monolito, notificacoes, "Dispara eventos de alteração de status de pedido", "Assíncrono / Mensageria")
```

## Descrição dos Elementos
- **Cliente:** Usuário final autenticado ou anônimo que interage com a vitrine e realiza pedidos.
- **Sistema E-commerce (Monólito):** Core do negócio construído como uma aplicação unificada com módulos bem isolados, centralizando a lógica de e-commerce.
- **Provedor de Pagamento (Simulado):** Integração externa com gateway para autorização de cobranças (mock no ambiente de desenvolvimento).
- **Serviço de Notificações (Futuro):** Ponto de evolução arquitetural para integração desacoplada via mensageria para disparo de e-mails transacionais e avisos.
