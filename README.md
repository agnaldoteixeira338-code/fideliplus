# FIDELI+

Sistema de fidelização de clientes com módulos de Fidelização, Favoritos e Saúde. Back-end e front-end funcionando de ponta a ponta, banco de dados real (Neon Postgres) e autenticação real (cadastro, login e recuperação de senha).

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

## Autenticação

O sistema tem cadastro, login e recuperação de senha reais:

- **Cadastro** (`/cadastro`): CPF, celular, e-mail, senha e confirmação de senha, escolhendo o tipo de conta (Cliente ou Dono). Ao cadastrar um Dono, um estabelecimento placeholder é criado automaticamente (edite os dados dele em Configurações).
- **Login** (`/`): e-mail e senha.
- **Recuperação de senha** (`/recuperar-senha`): pede e-mail + celular cadastrados; se baterem, libera na hora a definição de uma nova senha (não há envio real de e-mail/SMS nesta versão).

Contas de teste já semeadas pela migration (senha `123456` para as duas):

| Papel   | E-mail                    |
|---------|----------------------------|
| Cliente | demo.cliente@fideli.com   |
| Dono    | demo.dono@fideli.com      |

Use o CPF do cliente demo (`000.000.000-00`) na tela de Check-in (visão do Dono) para testar o fluxo de visitas e descontos.

## O que está mockado nesta versão

- **Google Maps / geolocalização**: a busca de hospitais, farmácias e médicos próximos retorna uma lista fixa de demonstração (`server/src/servicos/saudeMock.js`), não uma integração real.
- **Notificações push (Firebase)**: substituídas por toasts locais no front-end.
- **Exportação de relatórios**: disponível em CSV; exportação em Excel fica para uma próxima versão.
- **Envio de mensagens promocionais**: simulado (retorna a lista de clientes que teriam recebido a mensagem, sem envio real).

## Próximos passos sugeridos

- Integrar Google Maps API e Firebase Cloud Messaging.
- Adicionar exportação em Excel nos relatórios.
- Enviar e-mail/SMS de verdade na recuperação de senha.
