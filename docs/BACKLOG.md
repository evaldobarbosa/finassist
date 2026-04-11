# Backlog - FinAssistant

Lista de funcionalidades organizadas por milestone.

**Legenda de Status:**
- [ ] Pendente
- [~] Em andamento
- [x] Concluido
- [-] Despriorizado

**Legenda de Prioridade:**
- **P0** - Critico (bloqueia outras entregas)
- **P1** - Alta (essencial para o milestone)
- **P2** - Media (importante mas nao bloqueia)
- **P3** - Baixa (nice to have)

---

## Roadmap de Prioridades

### Curto Prazo (Proximo Sprint)

| Milestone | Descricao | Dependencias |
|-----------|-----------|--------------|
| **M5-010→012** | Matching categoria/conta (fuzzy match) | M4-026 (concluido) |
| **M8** | Multi-tenancy + Ledger | M4 (concluido) |
| **M6** | Interface Grafica (Vue) | M4, M5 |

### Medio Prazo

| Milestone | Descricao | Dependencias |
|-----------|-----------|--------------|
| **M4-050→056** | Recorrencias | M4 (concluido) |
| **M4-060→065** | Relatorios (resumo, por categoria) | M4 (concluido) |

### Despriorizado (Aguardando Feedback)

| Milestone | Descricao | Motivo |
|-----------|-----------|--------|
| **M5-020→022** | Correcoes do usuario | Aguardar usuarios reais testarem |
| **M7** | Consultas de Posicoes | Complexidade vs valor |

---

## M1 - Sugestao de Videos (RAG) - CONCLUIDO

### Infraestrutura

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M1-001 | Criar projeto Laravel 12 | P0 | [x] | Base do backend |
| M1-002 | Configurar PostgreSQL + pgvector | P0 | [x] | Banco vetorial |
| M1-003 | Configurar Docker (dev environment) | P1 | [x] | - |
| M1-004 | Configurar neuron-ai | P0 | [x] | Integracao LLM |

### Ingestao de Conteudo

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M1-010 | Script de download de transcricoes YouTube | P0 | [x] | Ver docs/TRANSCRICAO-YT.md |
| M1-011 | Chunking de transcricoes | P0 | [x] | Dividir em pedacos menores |
| M1-012 | Geracao de embeddings | P0 | [x] | Via LLM |
| M1-013 | Armazenamento no pgvector | P0 | [x] | Tabela de embeddings |
| M1-014 | Metadados dos videos (titulo, URL, duracao) | P1 | [x] | Para referencia na resposta |

### Webhook

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M1-020 | Endpoint POST /webhook/message | P0 | [x] | Recebe mensagens |
| M1-021 | Validacao de payload (phone, message, type) | P0 | [x] | - |
| M1-022 | Identificacao de tipo de mensagem (pergunta) | P1 | [x] | Distinguir de comandos |
| M1-023 | Rate limiting por telefone | P2 | [ ] | Evitar spam |

### RAG

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M1-030 | Embedding da pergunta do usuario | P0 | [x] | - |
| M1-031 | Busca por similaridade no pgvector | P0 | [x] | Top K chunks |
| M1-032 | Construcao do prompt com contexto | P0 | [x] | - |
| M1-033 | Chamada ao LLM para gerar resposta | P0 | [x] | - |
| M1-034 | Extracao do video fonte da resposta | P1 | [x] | Link + titulo |
| M1-035 | Formatacao da resposta para WhatsApp | P1 | [x] | Texto simples |

### Resposta

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M1-040 | Estrutura de resposta JSON | P0 | [x] | phone, response, video_url |
| M1-041 | Tratamento de erros | P1 | [x] | Resposta amigavel |
| M1-042 | Logging de perguntas/respostas | P2 | [ ] | Para analise |

### Extracao de Transacoes via Texto

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M1-050 | Detectar se mensagem e transacao ou pergunta | P0 | [x] | Pre-verificacao por padroes + LLM |
| M1-051 | Extrair dados financeiros de texto | P0 | [x] | Reutiliza ExtractTransactionData |
| M1-052 | Suporte a compras parceladas via texto | P1 | [x] | Igual ao audio |
| M1-053 | Fallback para RAG se nao for transacao | P0 | [x] | Responde perguntas |

---

## M2 - Analise de Audio - CONCLUIDO

### Processamento

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M2-001 | Endpoint POST /webhook/message (type: audio) | P0 | [x] | Mesmo endpoint, tipo diferente |
| M2-002 | Decodificacao de audio base64 | P0 | [x] | - |
| M2-003 | Conversao para formato compativel (se necessario) | P1 | [x] | ffmpeg |
| M2-004 | Transcricao speech-to-text | P0 | [x] | Whisper ou similar |

### Extracao de Entidades

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M2-010 | Identificar tipo (receita/despesa) | P0 | [x] | Palavras-chave |
| M2-011 | Extrair valor monetario | P0 | [x] | Regex + NLP |
| M2-012 | Extrair categoria | P1 | [x] | Mapeamento inteligente |
| M2-013 | Extrair estabelecimento/descricao | P1 | [x] | - |
| M2-014 | Extrair data (ou assumir hoje) | P1 | [x] | - |
| M2-015 | Prompt de extracao estruturada (LLM) | P0 | [x] | JSON output |

### Confirmacao

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M2-020 | Formatar mensagem de confirmacao | P0 | [x] | Texto legivel |
| M2-021 | Armazenar dados pendentes de confirmacao | P0 | [x] | Cache/Redis ou tabela |
| M2-022 | TTL para dados pendentes | P2 | [x] | Expirar apos X horas |

---

## M3 - Analise de Imagem - CONCLUIDO

### Processamento

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M3-001 | Endpoint POST /webhook/message (type: image) | P0 | [x] | Mesmo endpoint |
| M3-002 | Decodificacao de imagem base64 | P0 | [x] | - |
| M3-003 | Pre-processamento de imagem | P2 | [x] | Melhoria de qualidade |
| M3-004 | OCR para extracao de texto | P0 | [x] | Tesseract ou LLM vision |

### Extracao de Entidades

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M3-010 | Identificar tipo de documento | P1 | [x] | Cupom, NF, Pix, etc |
| M3-011 | Extrair valor total | P0 | [x] | - |
| M3-012 | Extrair estabelecimento | P1 | [x] | - |
| M3-013 | Extrair data | P1 | [x] | - |
| M3-014 | Extrair itens (se cupom/NF) | P3 | [ ] | Opcional |
| M3-015 | Prompt de extracao estruturada (LLM vision) | P0 | [x] | JSON output |

### Confirmacao

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M3-020 | Formatar mensagem de confirmacao | P0 | [x] | Similar ao M2 |
| M3-021 | Armazenar dados pendentes | P0 | [x] | - |

---

## M4 - API Financeira - PARCIALMENTE CONCLUIDO

### Setup

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M4-001 | Estrutura base Laravel (se nao existir de M1) | P0 | [x] | - |
| M4-002 | Portar autenticacao WhatsApp do jukebar | P0 | [x] | - |
| M4-003 | Configurar Sanctum | P0 | [x] | Tokens API |
| M4-004 | Middleware de tenant/usuario | P0 | [x] | Isolamento de dados |

### Contas Bancarias

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M4-010 | Migration: tabela accounts | P0 | [x] | - |
| M4-011 | Model Account | P0 | [x] | - |
| M4-012 | Action: CreateAccount | P0 | [x] | - |
| M4-013 | Action: UpdateAccount | P0 | [x] | - |
| M4-014 | Action: DeleteAccount | P1 | [x] | Soft delete |
| M4-015 | Action: GetAccountBalance | P0 | [x] | Calculado |
| M4-016 | Endpoints REST /accounts | P0 | [x] | CRUD |
| M4-017 | Conta padrao para WhatsApp | P1 | [x] | Flag is_default |
| M4-018 | Testes: Accounts | P0 | [x] | - |

### Cartoes de Credito

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M4-070 | Migration: tabela credit_cards | P0 | [x] | Ver docs/MODELAGEM-FINANCEIRA.md |
| M4-071 | Model CreditCard | P0 | [x] | bandeira, dia_vencimento, dia_fechamento |
| M4-072 | Action: CreateCreditCard | P0 | [x] | - |
| M4-073 | Action: UpdateCreditCard | P0 | [x] | - |
| M4-074 | Action: DeleteCreditCard | P1 | [x] | Soft delete |
| M4-075 | Endpoints REST /credit-cards | P0 | [x] | CRUD |
| M4-076 | Testes: CreditCards | P0 | [x] | - |

### Compras Parceladas

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M4-080 | Migration: tabela installment_purchases | P1 | [x] | Compras parceladas |
| M4-081 | Migration: tabela installments (demonstrativo) | P1 | [x] | Parcelas - apenas informativo |
| M4-082 | Model InstallmentPurchase | P1 | [x] | valor_total, parcelas, cartao_id |
| M4-083 | Model Installment | P1 | [x] | Vinculado a compra |
| M4-084 | Action: CreateInstallmentPurchase | P1 | [ ] | Cria compra + projecao parcelas |
| M4-085 | Action: CalculateInvoiceMonth | P1 | [ ] | Baseado no fechamento do cartao |
| M4-086 | Categoria "Pendente de classificacao" | P0 | [x] | Fallback para OCR/audio |
| M4-087 | Testes: InstallmentPurchases | P1 | [ ] | - |

### Categorias

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M4-020 | Migration: tabela categories | P0 | [x] | - |
| M4-021 | Model Category | P0 | [x] | - |
| M4-022 | Action: CreateCategory | P0 | [x] | - |
| M4-023 | Action: UpdateCategory | P0 | [x] | - |
| M4-024 | Action: DeleteCategory | P1 | [x] | - |
| M4-025 | Endpoints REST /categories | P0 | [x] | CRUD |
| M4-026 | Categorias padrao (seeder) | P1 | [x] | Alimentacao, Transporte, etc |
| M4-027 | Cor da categoria | P2 | [x] | Hex color |
| M4-028 | Limite de gasto por categoria | P2 | [x] | - |
| M4-029 | Testes: Categories | P0 | [x] | - |

### Transacoes

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M4-030 | Migration: tabela transactions | P0 | [x] | - |
| M4-031 | Model Transaction | P0 | [x] | - |
| M4-032 | Enum: TransactionType (income/expense) | P0 | [x] | - |
| M4-033 | Enum: TransactionStatus (pending/confirmed) | P0 | [x] | - |
| M4-034 | Enum: TransactionOrigin (manual/audio/image) | P1 | [x] | - |
| M4-035 | Action: CreateTransaction | P0 | [x] | - |
| M4-036 | Action: UpdateTransaction | P0 | [x] | - |
| M4-037 | Action: DeleteTransaction | P1 | [x] | - |
| M4-038 | Action: ConfirmTransaction | P0 | [x] | Muda status |
| M4-039 | Endpoints REST /transactions | P0 | [x] | CRUD + filtros |
| M4-040 | Filtros: periodo, categoria, conta, tipo | P1 | [x] | - |
| M4-041 | Testes: Transactions | P0 | [x] | - |

### Recorrencias - MEDIO PRAZO

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M4-050 | Migration: tabela recurrences | P2 | [ ] | Medio prazo |
| M4-051 | Model Recurrence | P2 | [ ] | Medio prazo |
| M4-052 | Enum: RecurrenceFrequency | P2 | [ ] | daily, weekly, monthly, yearly |
| M4-053 | Action: CreateRecurrence | P2 | [ ] | - |
| M4-054 | Action: GeneratePendingTransactions | P2 | [ ] | Job/Command |
| M4-055 | Endpoints REST /recurrences | P2 | [ ] | - |
| M4-056 | Testes: Recurrences | P2 | [ ] | - |

### Relatorios - MEDIO PRAZO

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M4-060 | Action: GetPeriodSummary | P2 | [ ] | Receitas, despesas, saldo |
| M4-061 | Action: GetCategorySummary | P2 | [ ] | Totais por categoria |
| M4-062 | Action: GetAccountsSummary | P2 | [ ] | Saldo por conta |
| M4-063 | Endpoint GET /reports/summary | P2 | [ ] | Medio prazo |
| M4-064 | Endpoint GET /reports/by-category | P2 | [ ] | Medio prazo |
| M4-065 | Testes: Reports | P2 | [ ] | - |

---

## M5 - Integracao Audio/Imagem -> API

### Fluxo de Confirmacao - CONCLUIDO

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M5-001 | Endpoint para receber confirmacao (SIM/NAO) | P0 | [x] | - |
| M5-002 | Buscar dados pendentes por telefone | P0 | [x] | - |
| M5-003 | Registrar transacao na API | P0 | [x] | Usar M4 Actions |
| M5-004 | Limpar dados pendentes apos registro | P0 | [x] | - |
| M5-005 | Enviar confirmacao de sucesso | P0 | [x] | - |

### Mapeamento - CURTO PRAZO

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M5-010 | Mapear categoria extraida → categoria do usuario | P1 | [ ] | Fuzzy match |
| M5-011 | Usar categoria padrao se nao encontrar | P1 | [ ] | "Pendente de Classificacao" |
| M5-012 | Usar conta padrao do usuario | P1 | [ ] | - |

### Correcoes - DESPRIORIZADO

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M5-020 | Interpretar correcoes do usuario | P3 | [-] | Aguardar feedback real |
| M5-021 | Atualizar dados pendentes | P3 | [-] | - |
| M5-022 | Reenviar confirmacao atualizada | P3 | [-] | - |

---

## M6 - Interface Grafica - CURTO PRAZO

### Setup

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M6-001 | Criar projeto Vue 3 + TypeScript | P0 | [ ] | Vite |
| M6-002 | Configurar Tailwind CSS 4 | P0 | [ ] | - |
| M6-003 | Configurar shadcn-vue | P0 | [ ] | Componentes |
| M6-004 | Configurar Pinia | P0 | [ ] | Estado |
| M6-005 | Configurar roteamento (Vue Router) | P0 | [ ] | - |
| M6-006 | Cliente HTTP (axios/fetch) | P0 | [ ] | - |
| M6-007 | Autenticacao (integrar com API) | P0 | [ ] | - |

### Telas

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M6-010 | Login via WhatsApp | P0 | [ ] | - |
| M6-011 | Dashboard | P0 | [ ] | Cards de resumo |
| M6-012 | Lista de transacoes | P0 | [ ] | Com filtros |
| M6-013 | Formulario de transacao | P0 | [ ] | Criar/editar |
| M6-014 | Lista de contas | P1 | [ ] | - |
| M6-015 | Formulario de conta | P1 | [ ] | - |
| M6-016 | Lista de categorias | P1 | [ ] | - |
| M6-017 | Formulario de categoria | P1 | [ ] | - |
| M6-018 | Relatorios/Graficos | P2 | [ ] | - |
| M6-019 | Configuracoes | P2 | [ ] | - |
| M6-020 | Recorrencias | P2 | [ ] | - |

### Componentes

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M6-030 | Card de resumo financeiro | P0 | [ ] | Ref: GranaZen |
| M6-031 | Lista de transacoes | P0 | [ ] | - |
| M6-032 | Filtros de periodo | P0 | [ ] | - |
| M6-033 | Modal de confirmacao | P1 | [ ] | - |
| M6-034 | Grafico de pizza (categorias) | P2 | [ ] | - |
| M6-035 | Grafico de linhas (evolucao) | P2 | [ ] | - |

---

## M7 - Consultas de Posicoes - DESPRIORIZADO

### Interpretacao

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M7-001 | Identificar intencao de consulta | P3 | [-] | vs registro |
| M7-002 | Extrair periodo da pergunta | P3 | [-] | "esse mes", "marco" |
| M7-003 | Extrair categoria da pergunta | P3 | [-] | "alimentacao" |
| M7-004 | Extrair conta da pergunta | P3 | [-] | "nubank" |

### Consultas

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M7-010 | Consulta: saldo total | P3 | [-] | Todas as contas |
| M7-011 | Consulta: saldo por conta | P3 | [-] | - |
| M7-012 | Consulta: total por categoria | P3 | [-] | - |
| M7-013 | Consulta: resumo do periodo | P3 | [-] | Receitas, despesas, saldo |
| M7-014 | Consulta: comparativo com periodo anterior | P3 | [-] | - |

### Resposta

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M7-020 | Formatacao de resposta para WhatsApp | P3 | [-] | Texto simples |
| M7-021 | Geracao de resposta via LLM | P3 | [-] | Mais natural |

---

## M8 - Multi-tenancy e Ledger - CURTO PRAZO

> **Documentacao:** [docs/ARQUITETURA-LEDGER.md](ARQUITETURA-LEDGER.md)

### Organizacoes e Usuarios

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M8-001 | Migration: tabela users | P0 | [ ] | phone como identificador principal |
| M8-002 | Migration: tabela organizations | P0 | [ ] | type: personal, couple, business |
| M8-003 | Migration: tabela organization_users | P0 | [ ] | roles e permissoes |
| M8-004 | Model User | P0 | [ ] | - |
| M8-005 | Model Organization | P0 | [ ] | - |
| M8-006 | Middleware de tenant | P0 | [ ] | Isolamento por organization_id |
| M8-007 | Seeder: organizacao padrao para testes | P1 | [ ] | - |
| M8-008 | Testes: Organizations | P0 | [ ] | - |

### Plano de Contas

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M8-010 | Migration: tabela chart_accounts | P1 | [ ] | Plano de contas contabil |
| M8-011 | Model ChartAccount | P1 | [ ] | Hierarquico com parent_id |
| M8-012 | Seeder: plano de contas pessoal | P1 | [ ] | Padrao para type=personal |
| M8-013 | Seeder: plano de contas empresarial | P2 | [ ] | Padrao para type=business |
| M8-014 | Vincular categories ao chart_accounts | P2 | [ ] | FK opcional |
| M8-015 | Vincular accounts ao chart_accounts | P2 | [ ] | FK opcional |

### Ledger (Feature Flag)

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M8-020 | Config: features.ledger.enabled | P1 | [ ] | Default: false |
| M8-021 | Migration: tabela ledger_entries | P1 | [ ] | Partidas dobradas |
| M8-022 | Model LedgerEntry | P1 | [ ] | - |
| M8-023 | Service: LedgerService | P1 | [ ] | Gera entries automaticamente |
| M8-024 | Validacao: debitos = creditos | P1 | [ ] | LedgerImbalanceException |
| M8-025 | Integrar LedgerService no TransactionService | P1 | [ ] | Condicional a feature flag |
| M8-026 | Testes: LedgerService | P1 | [ ] | - |

### Relatorios Contabeis (requer Ledger)

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M8-030 | Action: GetBalancete | P2 | [ ] | Saldo de todas as contas |
| M8-031 | Action: GetDRE | P2 | [ ] | Demonstracao do Resultado |
| M8-032 | Action: GetBalancoPatrimonial | P2 | [ ] | Ativos = Passivos + PL |
| M8-033 | Action: GetRazaoAnalitico | P3 | [ ] | Movimentacao por conta |
| M8-034 | Endpoint GET /reports/balancete | P2 | [ ] | - |
| M8-035 | Endpoint GET /reports/dre | P2 | [ ] | - |

---

## Debito Tecnico / Melhorias de Infraestrutura

### Arquitetura de Eventos / Filas - CONCLUIDO

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| DT-010 | Criar evento TransactionExtracted | P1 | [x] | Disparado apos extracao de texto/audio/imagem |
| DT-011 | Criar evento TransactionQueued | P1 | [x] | Item adicionado a fila de registro |
| DT-012 | Criar job ProcessTransactionEvent | P1 | [x] | Processa item da fila |
| DT-013 | Implementar fila para interpretacoes | P1 | [x] | Redis queue para audio/imagem/texto |
| DT-014 | Criar evento TransactionRegistered | P2 | [x] | Apos registro efetivo no banco |
| DT-015 | Implementar retry para falhas | P2 | [ ] | Reprocessar eventos com erro |
| DT-016 | Dashboard de filas (Horizon) | P3 | [ ] | Monitoramento de jobs |

### Docker / Containers

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| DT-001 | Separar OCR em container dedicado | P2 | [ ] | Tesseract, poppler-utils, ImageMagick → container separado |
| DT-002 | Criar API interna para OCR | P2 | [ ] | Endpoint HTTP para processamento de imagens |
| DT-003 | Reduzir tamanho da imagem PHP | P3 | [ ] | Remover dependencias de OCR (~200MB) |

---

## Proximos Passos

### Sprint Atual (Curto Prazo)
1. **M5-010→012** - Fuzzy matching de categorias/contas
2. **M8-001→008** - Multi-tenancy basico (users, organizations)
3. **M6-001→007** - Setup do frontend Vue

### Sprint Seguinte (Medio Prazo)
1. **M4-050→056** - Recorrencias
2. **M4-060→065** - Relatorios
3. **M8-010→026** - Ledger (feature flag)

---

## Backlog Futuro (Sem Prioridade Definida)

### Categorias MCC

> **Documentacao:** [docs/MCC-CATEGORIAS.md](MCC-CATEGORIAS.md)

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| MCC-001 | Migration: tabela mcc_mappings | P3 | [ ] | MCC → category_id |
| MCC-002 | Seeder: mapeamentos basicos | P3 | [ ] | ~50 MCCs mais comuns |
| MCC-003 | Action: GetCategoryByMCC | P3 | [ ] | Busca mapeamento |
| MCC-004 | Integracao com extracao de cartao | P3 | [ ] | Usar MCC quando disponivel |
| MCC-005 | Aprendizado de preferencias do usuario | P3 | [ ] | Armazenar correcoes |

**Contexto:** MCCs sao mais uteis para PJ (politicas corporativas, compliance) que para PF (orcamento pessoal). No FinAssistant, usamos categorias simplificadas. O MCC sera util apenas para auto-categorizacao quando houver integracao com extrato de cartao.
