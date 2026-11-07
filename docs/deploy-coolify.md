# Deploy no Coolify

Aplicação: site público + painel de leads (React/Vite, SPA). Build gera `dist/`
com HTML por rota (24 rotas) e o restante é renderizado pelo React.

O repositório já contém tudo o que o Coolify precisa:

- `Dockerfile` — build em Node 22 (`npm ci` + `npm run build`) e runtime nginx.
- `deploy/nginx.conf` — entregue junto na imagem; serve os HTMLs por rota,
  fallback da SPA, cache de assets, `/healthz` para o healthcheck e tipos
  corretos para as mídias (`.mp4`, imagens, fontes).
- `.dockerignore` — evita enviar `node_modules`, `dist` e `.env` ao build.

> Não é preciso publicar no Docker Hub: o Coolify constrói a imagem direto deste repositório.

## 1. Criar o recurso no Coolify

1. Em **Projects → (projeto) → + New Resource**, conecte o GitHub e escolha
   `https://github.com/PChiovatto/Tonys-Panting.git`, branch `main`.
2. **Build Pack: Dockerfile** (não Nixpacks). Se não aparecer, escolha
   "Dockerfile" e deixe *Dockerfile Location* = `/Dockerfile`.
3. **Ports Exposes: `80`** (nome exato do campo no Coolify: *Ports Exposes*).
4. Adicione um domínio e ative HTTPS (Coolify usa Let's Encrypt).
   O domínio canônico do site é `https://tonyspaintingmv.com` — configure o DNS
   apontando para o servidor Coolify antes de emitir o certificado.

## 2. Variáveis de build (obrigatórias)

O Vite **embute** essas variáveis no JavaScript durante o build. Mudá-las exige
um novo deploy (rebuild). Nenhuma é secreta: a chave é a *publishable/anon* do Supabase.

| Variável | Exemplo | Onde obter |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | `https://xxxx.supabase.co` | Supabase → Project Settings → API |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_...` ou `eyJ...` (anon) | Supabase → Project Settings → API |

Marque ambas como **Build Variable**: no Coolify, em *Environment Variables*, use
"Build Variable" / "Available at Buildtime" (sem "Available at Runtime" se preferir
— as `VITE_*` só são usadas no build).

Sem essas variáveis o build ainda finaliza (o `createClient` recebe `undefined`),
mas login, CRM e envio de formulários **não funcionam**. Não é possível validar
no build: confira depois do deploy abrindo `/login` e o formulário de contato.

Nunca use `service_role`, `SUPABASE_SECRET_KEY` ou VAPID privado em `VITE_*`:
tudo isso fica visível no navegador.

## 3. Healthcheck

- Caminho: `/healthz` → resposta `200 ok`.
- A imagem já declara `HEALTHCHECK`; no Coolify também é possível configurar
  *Health Check → Path* como `/healthz`.

## 4. Permalinks / URL

O `deploy/nginx.conf` já trata:
- `/services/interior-painting/` → entrega `dist/services/interior-painting/index.html`.
- Qualquer rota da SPA inexistente → `index.html`.
- Arquivos que não existem → 404 real (não devolve HTML no lugar de JS/CSS).

Para o domínio sem `www`, com HTTPS, crie um redirect 301 no proxy (Coolify →
*Redirects*) de `www.tonyspaintingmv.com` para `tonyspaintingmv.com`.

Para o redirect antigo/Permanente `/services/handyman` → `/services`, use
Coolify → *Redirects* na aplicação.

## 5. Após o deploy (validar)

1. Abrir o domínio: o site carrega e o `og-image.jpg`/imagens aparecem.
2. Abrir `/contact` direto: carrega o formulário (sem 404 do proxy).
3. `https://<dominio>/sitemap.xml` e `/robots.txt` respondem.
4. `/sw.js` responde 200 (`Content-Type: application/javascript`).
5. Login no `/dashboard` com a conta `staff` e envio de um lead de teste.

## 6. Backend (Supabase) — fora do Coolify

O Coolify hospeda **somente o frontend**. As Edge Functions e migrações listadas no
`README.md` continuam sendo um passo separado no projeto Supabase antes de o CRM
e as notificações funcionarem em produção.

## Alternativa: Docker manual

```sh
docker build \
  --build-arg VITE_SUPABASE_URL=https://xxxx.supabase.co \
  --build-arg VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxx \
  -t tonys-painting .
docker run --rm -p 8080:80 tonys-painting
```
