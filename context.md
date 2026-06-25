# Contexto do Projeto: Pingado

Este documento serve como referência de contexto para o agente de IA durante o desenvolvimento do projeto **Pingado**. Ele deve ser consultado para entender a arquitetura, as tecnologias e as regras gerais do projeto.

## Tecnologias Principais (Tech Stack)
- **Framework:** Next.js (v13.5.1) - Utilizando o App Router (`/app`).
- **Linguagem:** TypeScript (v5.2.2).
- **Estilização:** Tailwind CSS (v3.3.3) com `tailwindcss-animate` e `tailwind-merge`.
- **Componentes de UI:** Radix UI (Primitivos acessíveis) e shadcn/ui (implícito pelo uso de Radix + Tailwind e `components.json`).
- **Banco de Dados / Backend (BaaS):** Supabase (`@supabase/supabase-js`).
- **Gerenciamento de Formulários e Validação:** React Hook Form + Zod.
- **Ícones:** Lucide React.
- **Outras Bibliotecas Relevantes:** `date-fns` (datas), `recharts` (gráficos), `sonner` (toasts/notificações), `embla-carousel-react` (carrosséis).

## Estrutura de Diretórios
- `/app`: Rotas e páginas da aplicação (Next.js App Router).
- `/components`: Componentes reutilizáveis de interface (provavelmente componentes shadcn/ui e componentes de domínio).
- `/lib`: Funções utilitárias (ex: `utils.ts` para cn/tailwind-merge).
- `/hooks`: Hooks customizados do React.
- `/context`: Provedores de contexto do React.
- `/supabase`: Configurações e utilitários relacionados à integração com o Supabase.

## Regras Gerais e Padrões de Código
1. **Priorizar Componentes Server-side (RSC):** No App Router do Next.js, por padrão, os componentes são Server Components. Use `'use client'` apenas quando houver necessidade de interatividade do lado do cliente (hooks de estado, eventos de clique, etc).
2. **Estilização com Tailwind:** Utilizar classes utilitárias do Tailwind CSS para a maioria dos estilos.
3. **Componentes Acessíveis:** Manter o uso dos primitivos do Radix UI para garantir acessibilidade (a11y).
4. **Integração Supabase:** Utilizar a biblioteca oficial `@supabase/supabase-js` para interações com o banco de dados e autenticação, seguindo as melhores práticas recomendadas pela documentação.

## Contexto de Negócio e Produto (MBA Product Management)
A **Pingado** é um serviço de assinatura de cafés que busca conectar pequenos produtores a consumidores urbanos por meio de tecnologia, personalização (IA "sommelier") e experiência (focada em memória e pertencimento).

**Pilares Estratégicos:**
- **Desintermediação**: Aproximar produtor e consumidor.
- **Personalização**: Diferenciação por tecnologia (aprendizado contínuo do paladar).
- **Pertencimento**: Jornada cultural e educacional.

## Objetivos da Fase 2 (Tech Challenge)
O foco atual do projeto (Fase 2) é avançar no desenvolvimento do produto digital para a criação do MVP:
1. **Mapeamento da Jornada do Usuário:**
   - Identificação e descrição de Personas.
   - Criação de Mapas de Empatia (necessidades, dores e expectativas).
   - Desenvolvimento de Customer Journey Maps.
2. **Desenvolvimento de Pesquisas com Usuários:**
   - Formulação de hipóteses baseadas nas personas/jornadas.
   - Planejamento e execução de pesquisas (quantitativas e qualitativas).
   - Análise de dados e identificação de insights.
3. **Definição do escopo do MVP:**
   - Definição das funcionalidades essenciais e escopo baseados nos insights.

*Este documento pode ser atualizado conforme o projeto evolui.*
