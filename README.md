🪄 Magic Banner Plugin — Desafio Técnico Futuriza
=================================================

🚀 Descrição do Desafio
-----------------------

Este repositório contém o desafio técnico **"Magic Banner Plugin"**, proposto pela **Futuriza**.O objetivo é desenvolver uma aplicação **Next.js full stack** que permita criar e exibir **banners personalizados** em páginas de e-commerce, com base na **URL atual do site** e, opcionalmente, no **horário de exibição**.

A ideia é que qualquer loja possa exibir banners dinâmicos apenas **importando um script**.

🧱 Requisitos do Projeto
------------------------

### 🔹 Funcionalidades obrigatórias

*   Painel administrativo para **criar, listar e excluir banners**.
    
*   Cada banner deve conter:
    
    *   **URL completa** da página de destino (ex: https://lojaexemplo.com/produto/123)
        
    *   **Imagem do banner** (upload ou link)
        
    *   **Horário de exibição (opcional)** — ex: das 08:00 às 12:00
        
*   **API de banners** que recebe uma URL e retorna o banner correspondente.
    
*   **Script embutível** (/public/magic-banner.js) que:
    
    *   Captura a URL da página.
        
    *   Faz uma requisição para /api/banners?url=.
        
    *   Exibe o banner dinamicamente no topo da página.
        

### 🔹 Requisitos técnicos

*   **Next.js 14+**
    
*   **API Routes** para backend
    
*   **Persistência** (Supabase, SQLite ou JSON local)
    
*   **Deploy na Vercel (conta gratuita)**
    

🧩 Como testar o script embutível
---------------------------------

1.  Faça o deploy do projeto na **Vercel**.
    
2.  Em qualquer página HTML, adicione a tag abaixo:
    
<script src="https://<seu-projeto>.vercel.app/magic-banner.js"></script>


1.  Ao carregar a página, o script fará uma requisição para:
    
[  https://.vercel.app/api/banners?url=   `](https://<seu-projeto>.vercel.app/api/banners?url=<url_atual>)

Se houver um banner cadastrado para aquela URL, ele será exibido automaticamente no topo do site.

🧪 Como testar localmente
--------------------------

1.  Clone o repositório:

    ```bash
    git clone https://github.com/dudunog/dev-futurizado.git
    cd dev-futurizado
    ```

2.  Instale as dependências:

    ```bash
    npm install
    ```

3.  Configure as variáveis de ambiente no arquivo `.env` seguindo o exemplo do arquivo `.env.example`:

    ```env
    DATABASE_URL="sua-string-de-conexao-postgresql"
    NEXT_PUBLIC_SUPABASE_URL="sua-url-do-supabase"
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="sua-chave-publica"
    SUPABASE_SERVICE_ROLE_KEY="sua-chave-de-servico"
    ```

4.  Execute as migrations do Prisma:

    ```bash
    npx prisma migrate dev
    npx prisma generate
    ```

5.  Inicie o servidor de desenvolvimento:

    ```bash
    npm run dev
    ```

6.  Acesse o painel administrativo em `http://localhost:3000/admin` e faça login com seu email.

🧪 Como testar os banners
-------------------------

1.  Acesse o painel administrativo em `http://localhost:3000/admin` e faça login.

2.  Crie um novo banner:

    *   Clique no botão `+` no canto inferior direita para criar um banner
    *   Preencha a **URL de destino** (ex: `http://localhost:3000/test-banner.html`)
    *   Faça upload de uma imagem ou informe uma URL de imagem
    *   Configure opcionalmente: horário de exibição, data de início/fim, animação, etc.
    *   Salve o banner

3.  Teste a exibição do banner:
    *   Abra o arquivo `public/test-banner.html` no navegador ou crie uma página HTML simples
    *   Adicione o script: `<script src="http://localhost:3000/magic-banner.js"></script>`
    *   Certifique-se de que a URL da página corresponde à URL cadastrada no banner
    *   Recarregue a página - o banner deve aparecer no topo automaticamente

4.  Teste funcionalidades avançadas:
    *   **Agendamento:** Configure data/horário e verifique se o banner aparece apenas no período configurado
    *   **Prioridade:** Crie múltiplos banners para a mesma URL e ajuste a prioridade via drag-and-drop
    *   **A/B Testing:** Crie um grupo de teste A/B e associe variantes aos banners
    *   **Analytics:** Visualize impressões e cliques nas estatísticas de teste A/B

🪄 Exemplo de funcionamento
---------------------------

*   Banner cadastrado para:https://lojaexemplo.com/produto/123
    
*   Quando o script é carregado nessa URL, ele exibe o banner dinamicamente.
    
*   Se o horário de exibição estiver definido, o banner só aparece dentro do intervalo configurado.
    

🧠 Decisões técnicas (preencher pelo candidato)
-----------------------------------------------

**Stack:** Next.js, Prisma ORM, PostgreSQL, Supabase, shadcn/ui, Tailwind CSS, Zod, React Hook Form.

**Persistência:** PostgreSQL via Supabase com Prisma ORM. Tabelas separadas para A/B Testing para melhor organização e escalabilidade.

**Arquitetura:** Server Components para páginas admin, API Routes para backend, Client Components apenas quando necessário. Separação entre lógica de negócio (API routes) e apresentação (components).

**Estrutura:** Componentização modular com separação de responsabilidades. Tipos customizados (`lib/types/`) para decoupling do Prisma. Validação centralizada com Zod schemas.

**Script embutível:** Script Vanilla JS sem dependências, auto-inicialização, detecção de origem da API, coleta de analytics.

**Exibição condicional:** Normalização de URLs para matching consistente. Filtros por data/horário/timezone no servidor. Sistema de prioridade. Seleção determinística de variantes A/B baseada em hash de sessionId.

**Autenticação:** Link mágico no Supabase com middleware de proteção de rotas.


🌟 Diferenciais implementados (opcional)
----------------------------------------

Liste aqui os diferenciais adicionados, como:

*   Upload real de imagem (Supabase Storage) - Implementado

*   Autenticação no painel - Implementado

*   Efeitos visuais no banner - Implementado

*   Preview em tempo real - Implementado

*   Agendamento de banners - Implementado

*   Testes A/B - Implementado

*   Analytics e métricas em tempo real - Implementado


🔗 Deploy
---------

*   **Painel administrativo:** https://.vercel.app/admin
    
*   **Script público:** https://.vercel.app/magic-banner.js
    

📅 Prazo de entrega
-------------------

**7 dias corridos** após o envio do desafio.

Entregar:

*   Link do repositório público (GitHub)
    
*   Link do deploy na Vercel
    
*   (Opcional) GIF ou vídeo curto mostrando o funcionamento
    

🧪 Critérios de avaliação
-------------------------

CritérioDescrição**Organização de código**Estrutura clara, componentes bem definidos e boas práticas.**Integração full stack**Comunicação fluida entre painel, API e script embutível.**Domínio de Next.js**Uso correto de rotas, APIs, SSR/ISR e deploy.**Funcionalidade real**Banner aparecendo dinamicamente conforme a URL.**UX/UI**Painel funcional e usabilidade simples.**Documentação e Deploy**Facilidade de entendimento e reprodução.

💡 Sobre a Futuriza
-------------------

A **Futuriza** é uma empresa de tecnologia focada em **acelerar o futuro do varejo**, desenvolvendo soluções inteligentes com **IA, automação e geração de imagens**.Entre seus produtos estão **plugins inteligentes para e-commerce**, como **video commerce**, **provador virtual com IA** e **sugestão de tamanho automatizada**.

🧩 **Boa sorte!**Capriche na clareza do código, na organização e na experiência do painel.Queremos ver como você estrutura uma aplicação real de ponta a ponta 🚀
