# Tony's Painting and Remodeling

Site público e painel de leads em React, TypeScript, Vite e Supabase.

## Desenvolvimento

Requer Node.js 22 ou superior. Use npm e `package-lock.json` como referência para instalações reproduzíveis.

1. Copie `.env.example` para `.env` e configure a URL e a chave pública do Supabase.
2. Execute `npm ci`.
3. Execute `npm run dev` e abra `http://127.0.0.1:8080`.

Nunca coloque chaves administrativas, segredos de webhook ou VAPID privado em variáveis `VITE_*`: elas ficam visíveis no navegador.

## Verificação

```sh
npm run check
npm audit
deno check --config supabase/functions/deno.json supabase/functions/send-push/index.ts supabase/functions/notify-new-lead/index.ts supabase/functions/send-reminder/index.ts
```

`check` executa lint, TypeScript, testes e build. O resultado de produção fica em `dist`. O workflow do GitHub faz essas verificações sem credenciais reais do Supabase. Configure o provedor de hospedagem para servir `index.html` nas rotas da SPA, como `/contact`, `/services/interior-painting` e `/dashboard`.

## Supabase: preparação antes da implantação

As alterações locais não modificam automaticamente o banco ou as funções já publicadas.

1. Revise em um ambiente de staging os usuários que terão acesso ao CRM. Atribua `app_metadata.role` com valor `staff` ou `admin` somente aos funcionários aprovados, usando as ferramentas administrativas de Auth. Preserve os outros campos de metadata. `user_metadata` não concede acesso. Peça novo login para renovar o token após configurar o papel.
2. Configure `LEAD_WEBHOOK_SECRET` nas Edge Functions com um segredo aleatório forte. Armazene o mesmo valor no Vault com nome `lead_webhook_secret`. Adicione no Vault `project_url` com a URL HTTPS do projeto. Não reutilize o antigo segredo padrão do cron.
3. Configure `CRON_SECRET` e atualize o cron para enviar esse valor no cabeçalho `x-cron-secret`. As funções aceitam POST. Mantenha `VAPID_SUBJECT`, `VAPID_PUBLIC_KEY` e `VAPID_PRIVATE_KEY` configurados; a chave pública deve corresponder à utilizada pelo cliente.
4. Compare o schema remoto com as migrações locais antes de aplicá-las. Foi recuperada a migração ausente `20260708142425_restore_appointments_schema.sql`; em um projeto existente, confira o histórico antes de usar opções para incluir migrações anteriores. Confira também a assinatura de `get_tomorrows_appointments()` caso já exista fora deste histórico.
5. Aplique as migrações de proteção e sincronização de agendamentos e publique `notify-new-lead`, `send-push` e `send-reminder` como uma atualização coordenada. Publicar somente as funções autenticadas deixará o webhook antigo sem autorização.
6. Valide com um funcionário autorizado, um usuário comum e um visitante: leitura e alterações do CRM, envio de formulário, agendamento, notificação e lembrete. Visitantes e usuários comuns não devem conseguir ler leads, fotos privadas ou compromissos.

As políticas novas restringem acesso por linha (RLS), inclusive quando existem políticas permissivas anteriores. Sem um papel de funcionário configurado, o CRM deixa de fornecer os dados. Sem os segredos no Vault, o lead continua sendo salvo, mas a notificação é ignorada com aviso no banco.

## Mídia e limites conhecidos

Os arquivos MP4 referenciados originalmente não vieram no projeto. O site agora apresenta uma imagem real do portfólio e links para os reels no Instagram. Para voltar a hospedar vídeos localmente, adicione os arquivos e implemente o player com tratamento de erro.

Veja [a revisão técnica](docs/code-review.md) para as correções e os pontos que ainda dependem de validação operacional.

## Formulário em duas etapas

Home e contato usam `TwoStepInquiryForm`. A primeira etapa grava nome/telefone; a segunda completa o mesmo lead com e-mail e endereço/ZIP no campo de mensagem do CRM. As landing pages mantêm seus formulários atuais.

Antes de publicar este frontend, aplique `20260915060000_two_step_inquiries.sql` no Supabase e valide o fluxo remoto. Sem a função `save_website_inquiry`, o envio apresenta erro e não avança. Nenhuma simulação é apresentada como gravação real.

A função usa uma capacidade aleatória por formulário, armazenada apenas como hash numa tabela sem acesso público, com validade de 24 horas. Repetições na mesma sessão não duplicam leads nem a conclusão. Recarregar a página inicia outra sessão; o lead parcial anterior permanece salvo. O token não concede leitura do CRM. A proteção antispam continua pendente.

## SEO e publicação

Domínio canônico confirmado: https://tonyspaintingmv.com. Atendimento: Massachusetts, New Hampshire, Rhode Island e Martha's Vineyard.

`npm run build` gera `dist/<rota>/index.html` com título, descrição, canonical e metadados sociais específicos para 24 rotas, incluindo noindex inicial em login, dashboard e confirmação. O script verifica que toda URL do sitemap possui saída. O conteúdo visual e os dados estruturados ainda são renderizados pelo React; isto não é pré-renderização completa.

A hospedagem deve servir o arquivo real de cada rota antes do fallback da SPA. Configure um único padrão de URL (HTTPS, sem www, sem barra final exceto na raiz), com redirecionamentos permanentes para as variantes. Verifique respostas 404 reais nas URLs inexistentes e um redirecionamento permanente de /services/handyman para /services. Essas regras dependem do provedor e não foram publicadas nesta alteração.

robots.txt permite leitura das páginas para que o Google enxergue noindex. A autenticação continua responsável pela proteção do CRM. Confirme no HTML publicado um único canonical/description/robots, teste no Rich Results Test e envie o sitemap no Google Search Console da propriedade correta. A tag de verificação existente foi preservada; propriedade e indexação não foram verificadas nesta sessão.
