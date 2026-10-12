# Visão do Produto

## Problema
Pequenas e médias operações de varejo enfrentam dificuldades para consolidar suas vendas online devido à complexidade excessiva de soluções baseadas em microsserviços logo no início do projeto. A sobrecarga operacional de gerenciar múltiplos deploys, latência de rede entre serviços e consistência eventual costuma inviabilizar o time-to-market e aumentar custos de infraestrutura sem necessidade.

## Público
- **Consumidores finais (B2C):** Usuários que buscam uma experiência de compra ágil, com catálogo atualizado, carrinho persistente e processo de checkout seguro.
- **Lojistas / Operadores:** Administradores que precisam de controle direto sobre o catálogo de produtos, acompanhamento de pedidos e confirmação de pagamentos em uma única base de dados.
- **Equipe de Desenvolvimento:** Engenheiros que precisam de facilidade para desenvolver, testar localmente e realizar deploys sem a complexidade de orquestração distribuída prematura.

## Objetivos
- Disponibilizar um ambiente transacional confiável com os fluxos essenciais de e-commerce (catálogo, carrinho, checkout, pagamento e gestão de pedidos).
- Adotar uma arquitetura de monólito modular com fronteiras bem delimitadas entre domínios, garantindo alta coesão e baixo acoplamento para permitir futura extração de serviços caso haja necessidade de escala.
- Manter uma esteira simples de desenvolvimento e deploy contínuo, utilizando um único banco relacional (PostgreSQL).

## Critérios de Sucesso
- Realização do ciclo completo de compra (da seleção de produtos à confirmação simulada de pagamento) em menos de 3 segundos por transação.
- Tempo de inicialização e onboarding do ambiente local em menos de 5 minutos utilizando Docker Compose e scripts npm padronizados.
- Isolamento efetivo entre módulos a nível de código, sem acoplamento direto de persistência entre domínios distintos.
