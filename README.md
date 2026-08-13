# FIDELI+ (ambiente de testes)

Sistema de fidelização de clientes com módulos de Fidelização, Favoritos e Saúde. Esta é a primeira versão do projeto: um esqueleto completo, com back-end e front-end funcionando de ponta a ponta, banco de dados real (Neon Postgres) e login simplificado para testes (sem senha).

## Estrutura

- `server/` — API em Node.js + Express, conectada ao Postgres (Neon) via `pg`.
- `client/` — Front-end em React (Vite) + CSS puro, com visual inspirado em app bancário (vermelho/branco).

## Configuração

### 1. Banco de dados (Neon)

Copie `server/.env.example` para `server/.env` e preencha `DATABASE_URL` com a connection string do seu projeto Neon, e defina um `JWT_SECRET` próprio.

### 2. Instalar dependências e rodar as migrations

```bash
cd server
npm install
npm run migrar
```

Isso cria as 7 tabelas do sistema e semeia um usuário cliente demo, um usuário dono demo, um estabelecimento demo e duas regras de fidelização (3 visitas → 10%, 5 visitas → 20%).

### 3. Subir o servidor

```bash
npm run dev
```

A API sobe em `http://localhost:4000`.

### 4. Subir o front-end

Em outro terminal:

```bash
cd client
npm install
npm run dev
```

O front sobe em `http://localhost:5173` (com proxy para a API).

## Login de testes

Como este é um ambiente de demonstração, não há senha: a tela inicial oferece dois botões — **Entrar como Cliente** e **Entrar como Dono** — que autenticam automaticamente nos usuários demo semeados pela migration.

Use o CPF do cliente demo (`000.000.000-00`) na tela de Check-in (visão do Dono) para testar o fluxo de visitas e descontos.

## O que está mockado nesta versão

- **Google Maps / geolocalização**: a busca de hospitais, farmácias e médicos próximos retorna uma lista fixa de demonstração (`server/src/servicos/saudeMock.js`), não uma integração real.
- **Notificações push (Firebase)**: substituídas por toasts locais no front-end.
- **Exportação de relatórios**: disponível em CSV; exportação em Excel fica para uma próxima versão.
- **Envio de mensagens promocionais**: simulado (retorna a lista de clientes que teriam recebido a mensagem, sem envio real).

## Próximos passos sugeridos

- Trocar o login demo por autenticação real (cadastro com CPF/Gmail/senha, já com `password_hash` na tabela `users`).
- Integrar Google Maps API e Firebase Cloud Messaging.
- Adicionar exportação em Excel nos relatórios.
