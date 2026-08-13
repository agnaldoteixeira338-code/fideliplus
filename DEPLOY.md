# Publicando o FIDELI+ no Render (para o QR code da apresentação)

Passo a passo simples, sem precisar instalar nada no computador.

## 1. Colocar o projeto no GitHub

O Render publica a partir de um repositório GitHub.

1. Crie uma conta gratuita em **github.com** (se ainda não tiver).
2. Crie um repositório novo, vazio — por exemplo `fideli-plus` (pode ser privado).
3. Copie a URL do repositório que o GitHub mostrar (algo como `https://github.com/seu-usuario/fideli-plus.git`) e me envie — eu faço o `git push` do projeto pra lá.

## 2. Criar os serviços no Render

1. Crie uma conta gratuita em **render.com** (dá pra entrar direto com o GitHub).
2. No painel, clique em **New +** → **Blueprint**.
3. Conecte o repositório `fideli-plus` que você acabou de criar.
4. O Render vai detectar o arquivo `render.yaml` do projeto sozinho e propor a criação de **dois serviços**: `fideli-api` (o servidor) e `fideli-client` (o site).
5. Antes de confirmar, ele vai pedir para preencher algumas variáveis:
   - Em **fideli-api**: `DATABASE_URL` (copie o mesmo valor que está no seu arquivo `server/.env`) e `JWT_SECRET` (copie também do `server/.env`).
   - Em **fideli-client**: `VITE_API_URL` — deixe em branco por enquanto, vamos preencher no próximo passo.
6. Clique em **Apply** / **Create** para os dois serviços começarem a ser publicados. Isso leva alguns minutos.

## 3. Conectar o site à API

1. Quando o serviço **fideli-api** terminar de publicar, copie a URL dele (aparece no topo da página do serviço, algo como `https://fideli-api-xxxx.onrender.com`).
2. Vá no serviço **fideli-client** → aba **Environment** → edite a variável `VITE_API_URL` e cole essa URL da API ali (sem barra `/` no final).
3. Clique em **Manual Deploy** → **Deploy latest commit** no `fideli-client` para ele rebuildar já usando essa URL.
4. Quando terminar, copie a URL do **fideli-client** (essa é a URL final do site, ex: `https://fideli-client-xxxx.onrender.com`) — é ela que vai virar o QR code.

## 4. Gerar o QR code

Com a URL final do site em mãos, me diga qual é ela (ou rode você mesmo):

```bash
cd server
npm run qrcode -- https://fideli-client-xxxx.onrender.com
```

Isso gera a imagem `acesso rapido/QRCode-Apresentacao.png`, pronta para colocar num slide.

## Antes de apresentar

O plano gratuito do Render "adormece" o serviço da API depois de um tempo sem uso. **Abra o link do site você mesmo uns 2-3 minutos antes da apresentação** para a API acordar — assim, quando os professores escanearem o QR code, tudo já responde na hora.
