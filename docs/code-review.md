# Revisão técnica — 15/09/2026

## Correções implementadas

| Área | Problema identificado | Correção |
| --- | --- | --- |
| Instalação | `npm ci` falhava porque o lockfile não correspondia ao package.json | Lockfile regenerado e dependências atualizadas; npm como fluxo documentado |
| Dependências | Auditoria inicial: 22 vulnerabilidades | Atualizações compatíveis com React 18, incluindo Router 7, Vite 6.4.3 e Vitest 4.1.11; auditoria final sem alertas |
| Notificações | Endpoints de push/webhook sem verificação de credenciais | Autorização no servidor, comparação exata, recusa quando segredo está ausente e método POST |
| Cron | Segredo padrão público e comparação por substring | Removido fallback; validação exata do segredo ou service role |
| Banco | Qualquer usuário autenticado podia ler/alterar leads e fotos | Migração RLS com papel de funcionário em app_metadata, inclusive políticas restritivas |
| Agenda | Faltava a criação de appointments no histórico | Migração de schema recuperada e função de lembretes documentada |
| Leads | Mudanças visuais antes de confirmar a gravação; exclusão podia ocultar registro sem apagá-lo | Atualização apenas após resposta persistida, checagem de linha afetada e mensagem de erro |
| Realtime | Fetch inicial podia sobrescrever eventos ou duplicar leads | Recarregamento reconciliado e descarte de respostas ultrapassadas |
| Agendamento | Conversões dependiam do fuso do navegador; horário de verão incorreto | Conversão para Nova York testada, rejeição de horários inexistentes e agrupamento por dia de Nova York |
| Agenda do lead | Modal fechava mesmo com erro e alterava status antes da confirmação | Confirmação após persistência e migração para sincronizar a agenda na mesma transação |
| Formulários | Validação duplicada, telefone arbitrário, falhas de conexão sem tratamento | Validação compartilhada, normalização de dados, limite de tamanho, foco e associação dos erros aos campos |
| Navegação | Menu móvel sobrepunha o CTA no desktop; navegação por teclado incompleta | Visibilidade responsiva corrigida, Escape, contenção e retorno de foco, acesso ao submenu por teclado |
| Botões | Efeito ripple com asChild podia quebrar links após o clique | Composição com Slottable e teste de regressão |
| Mídia | Cinco vídeos referenciados não existiam | Acesso funcional ao portfólio e aos reels externos |
| Carregamento | Todo o site e CRM vinham em um arquivo JavaScript de 1,35 MB | Páginas sob demanda, separação de bibliotecas e fallback de carregamento/erro |
| SEO | Schema/robots usavam domínio divergente do canonical/sitemap | Alinhamento com o domínio já definido no canonical |
| Manutenção | README vazio, sem workflow de verificação | Documentação de instalação, checklist Supabase e CI |

## Verificações

- Build de produção e checagem TypeScript.
- Lint sem erros; 7 avisos preexistentes de Fast Refresh nos componentes compartilhados shadcn.
- Testes de validação, falha de rede, persistência de leads, credenciais, horário de verão e links com ripple.
- `deno check` nas três Edge Functions.
- Teste visual do site em desktop e viewport de 390 px: menu e formulário inválido, com foco no primeiro campo incorreto.
- Auditoria npm sem vulnerabilidades reportadas na data da revisão.

O novo arquivo de entrada tem aproximadamente 345 kB e o maior chunk aproximadamente 475 kB. Esses tamanhos não representam o total transferido na primeira visita: bibliotecas e módulos da página também são carregados. O CRM deixou de ser necessário para abrir as páginas públicas.

## Limites e próximos cuidados

- As migrações SQL ainda precisam ser executadas e testadas em staging com o schema remoto. Não foi alterado o banco de produção nem enviado um lead real durante a revisão.
- O controle de acesso e as notificações só passam a usar as proteções novas depois da configuração e implantação descritas no README.
- O formulário público ainda precisa de proteção antispam no servidor (limite por origem e desafio validado no backend) para resistir a abuso automatizado. Validação de campos não substitui essa proteção.
- O componente legado de avaliações permite publicação automática conforme a política existente. Uma política de moderação exige um fluxo de aprovação; esse fluxo não foi inventado nesta revisão.
- Há conteúdo comercial e avaliações estáticas, imagens externas e arquivos de imagem grandes. A autenticidade dos textos e a disponibilidade de serviços de terceiros não foram auditadas.
- O histórico contém configuração de `submit-project-lead`, mas não contém a implementação dessa função. O fluxo externo NFC/fotos precisa ser comparado com o ambiente remoto antes de implantação.
- Autorização foi alinhada à documentação oficial de [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security) e [autenticação de Edge Functions](https://supabase.com/docs/guides/functions/auth).
