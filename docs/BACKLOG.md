# Backlog - FinAssistant

Lista de funcionalidades organizadas por milestone.

**Legenda de Status:**
- [ ] Pendente
- [~] Em andamento
- [x] Concluído

**Legenda de Prioridade:**
- **P0** - Crítico (bloqueia outras entregas)
- **P1** - Alta (essencial para o milestone)
- **P2** - Média (importante mas não bloqueia)
- **P3** - Baixa (nice to have)

---

## M1 - Sugestão de Vídeos (RAG)

### Infraestrutura

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M1-001 | Criar projeto Laravel 12 | P0 | [ ] | Base do backend |
| M1-002 | Configurar PostgreSQL + pgvector | P0 | [ ] | Banco vetorial |
| M1-003 | Configurar Docker (dev environment) | P1 | [ ] | - |
| M1-004 | Configurar neuron-ai | P0 | [ ] | Integração LLM |

### Ingestão de Conteúdo

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M1-010 | Script de download de transcrições YouTube | P0 | [ ] | Ver docs/TRANSCRICAO-YT.md |
| M1-011 | Chunking de transcrições | P0 | [ ] | Dividir em pedaços menores |
| M1-012 | Geração de embeddings | P0 | [ ] | Via LLM |
| M1-013 | Armazenamento no pgvector | P0 | [ ] | Tabela de embeddings |
| M1-014 | Metadados dos vídeos (título, URL, duração) | P1 | [ ] | Para referência na resposta |

### Webhook

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M1-020 | Endpoint POST /webhook/message | P0 | [ ] | Recebe mensagens |
| M1-021 | Validação de payload (phone, message, type) | P0 | [ ] | - |
| M1-022 | Identificação de tipo de mensagem (pergunta) | P1 | [ ] | Distinguir de comandos |
| M1-023 | Rate limiting por telefone | P2 | [ ] | Evitar spam |

### RAG

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M1-030 | Embedding da pergunta do usuário | P0 | [ ] | - |
| M1-031 | Busca por similaridade no pgvector | P0 | [ ] | Top K chunks |
| M1-032 | Construção do prompt com contexto | P0 | [ ] | - |
| M1-033 | Chamada ao LLM para gerar resposta | P0 | [ ] | - |
| M1-034 | Extração do vídeo fonte da resposta | P1 | [ ] | Link + título |
| M1-035 | Formatação da resposta para WhatsApp | P1 | [ ] | Texto simples |

### Resposta

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M1-040 | Estrutura de resposta JSON | P0 | [ ] | phone, response, video_url |
| M1-041 | Tratamento de erros | P1 | [ ] | Resposta amigável |
| M1-042 | Logging de perguntas/respostas | P2 | [ ] | Para análise |

---

## M2 - Análise de Áudio

### Processamento

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M2-001 | Endpoint POST /webhook/message (type: audio) | P0 | [ ] | Mesmo endpoint, tipo diferente |
| M2-002 | Decodificação de áudio base64 | P0 | [ ] | - |
| M2-003 | Conversão para formato compatível (se necessário) | P1 | [ ] | ffmpeg |
| M2-004 | Transcrição speech-to-text | P0 | [ ] | Whisper ou similar |

### Extração de Entidades

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M2-010 | Identificar tipo (receita/despesa) | P0 | [ ] | Palavras-chave |
| M2-011 | Extrair valor monetário | P0 | [ ] | Regex + NLP |
| M2-012 | Extrair categoria | P1 | [ ] | Mapeamento inteligente |
| M2-013 | Extrair estabelecimento/descrição | P1 | [ ] | - |
| M2-014 | Extrair data (ou assumir hoje) | P1 | [ ] | - |
| M2-015 | Prompt de extração estruturada (LLM) | P0 | [ ] | JSON output |

### Confirmação

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M2-020 | Formatar mensagem de confirmação | P0 | [ ] | Texto legível |
| M2-021 | Armazenar dados pendentes de confirmação | P0 | [ ] | Cache/Redis ou tabela |
| M2-022 | TTL para dados pendentes | P2 | [ ] | Expirar após X horas |

---

## M3 - Análise de Imagem

### Processamento

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M3-001 | Endpoint POST /webhook/message (type: image) | P0 | [ ] | Mesmo endpoint |
| M3-002 | Decodificação de imagem base64 | P0 | [ ] | - |
| M3-003 | Pré-processamento de imagem | P2 | [ ] | Melhoria de qualidade |
| M3-004 | OCR para extração de texto | P0 | [ ] | Tesseract ou LLM vision |

### Extração de Entidades

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M3-010 | Identificar tipo de documento | P1 | [ ] | Cupom, NF, Pix, etc |
| M3-011 | Extrair valor total | P0 | [ ] | - |
| M3-012 | Extrair estabelecimento | P1 | [ ] | - |
| M3-013 | Extrair data | P1 | [ ] | - |
| M3-014 | Extrair itens (se cupom/NF) | P3 | [ ] | Opcional |
| M3-015 | Prompt de extração estruturada (LLM vision) | P0 | [ ] | JSON output |

### Confirmação

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M3-020 | Formatar mensagem de confirmação | P0 | [ ] | Similar ao M2 |
| M3-021 | Armazenar dados pendentes | P0 | [ ] | - |

---

## M4 - API Financeira

### Setup

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M4-001 | Estrutura base Laravel (se não existir de M1) | P0 | [ ] | - |
| M4-002 | Portar autenticação WhatsApp do jukebar | P0 | [ ] | - |
| M4-003 | Configurar Sanctum | P0 | [ ] | Tokens API |
| M4-004 | Middleware de tenant/usuário | P0 | [ ] | Isolamento de dados |

### Contas Bancárias

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M4-010 | Migration: tabela accounts | P0 | [ ] | - |
| M4-011 | Model Account | P0 | [ ] | - |
| M4-012 | Action: CreateAccount | P0 | [ ] | - |
| M4-013 | Action: UpdateAccount | P0 | [ ] | - |
| M4-014 | Action: DeleteAccount | P1 | [ ] | Soft delete? |
| M4-015 | Action: GetAccountBalance | P0 | [ ] | Calculado |
| M4-016 | Endpoints REST /accounts | P0 | [ ] | CRUD |
| M4-017 | Conta padrão para WhatsApp | P1 | [ ] | Flag is_default |
| M4-018 | Testes: Accounts | P0 | [ ] | - |

### Cartões de Crédito

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M4-070 | Migration: tabela credit_cards | P0 | [ ] | Ver docs/MODELAGEM-FINANCEIRA.md |
| M4-071 | Model CreditCard | P0 | [ ] | bandeira, dia_vencimento, dia_fechamento |
| M4-072 | Action: CreateCreditCard | P0 | [ ] | - |
| M4-073 | Action: UpdateCreditCard | P0 | [ ] | - |
| M4-074 | Action: DeleteCreditCard | P1 | [ ] | Soft delete |
| M4-075 | Endpoints REST /credit-cards | P0 | [ ] | CRUD |
| M4-076 | Testes: CreditCards | P0 | [ ] | - |

### Compras Parceladas

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M4-080 | Migration: tabela installment_purchases | P1 | [ ] | Compras parceladas |
| M4-081 | Migration: tabela installments (demonstrativo) | P1 | [ ] | Parcelas - apenas informativo |
| M4-082 | Model InstallmentPurchase | P1 | [ ] | valor_total, parcelas, cartao_id |
| M4-083 | Model Installment | P1 | [ ] | Vinculado à compra |
| M4-084 | Action: CreateInstallmentPurchase | P1 | [ ] | Cria compra + projeção parcelas |
| M4-085 | Action: CalculateInvoiceMonth | P1 | [ ] | Baseado no fechamento do cartão |
| M4-086 | Categoria "Pendente de classificação" | P0 | [ ] | Fallback para OCR/áudio |
| M4-087 | Testes: InstallmentPurchases | P1 | [ ] | - |

### Categorias

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M4-020 | Migration: tabela categories | P0 | [ ] | - |
| M4-021 | Model Category | P0 | [ ] | - |
| M4-022 | Action: CreateCategory | P0 | [ ] | - |
| M4-023 | Action: UpdateCategory | P0 | [ ] | - |
| M4-024 | Action: DeleteCategory | P1 | [ ] | - |
| M4-025 | Endpoints REST /categories | P0 | [ ] | CRUD |
| M4-026 | Categorias padrão (seeder) | P1 | [ ] | Alimentação, Transporte, etc |
| M4-027 | Cor da categoria | P2 | [ ] | Hex color |
| M4-028 | Limite de gasto por categoria | P2 | [ ] | - |
| M4-029 | Testes: Categories | P0 | [ ] | - |

### Transações

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M4-030 | Migration: tabela transactions | P0 | [ ] | - |
| M4-031 | Model Transaction | P0 | [ ] | - |
| M4-032 | Enum: TransactionType (income/expense) | P0 | [ ] | - |
| M4-033 | Enum: TransactionStatus (pending/confirmed) | P0 | [ ] | - |
| M4-034 | Enum: TransactionOrigin (manual/audio/image) | P1 | [ ] | - |
| M4-035 | Action: CreateTransaction | P0 | [ ] | - |
| M4-036 | Action: UpdateTransaction | P0 | [ ] | - |
| M4-037 | Action: DeleteTransaction | P1 | [ ] | - |
| M4-038 | Action: ConfirmTransaction | P0 | [ ] | Muda status |
| M4-039 | Endpoints REST /transactions | P0 | [ ] | CRUD + filtros |
| M4-040 | Filtros: período, categoria, conta, tipo | P1 | [ ] | - |
| M4-041 | Testes: Transactions | P0 | [ ] | - |

### Recorrências

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M4-050 | Migration: tabela recurrences | P1 | [ ] | - |
| M4-051 | Model Recurrence | P1 | [ ] | - |
| M4-052 | Enum: RecurrenceFrequency | P1 | [ ] | daily, weekly, monthly, yearly |
| M4-053 | Action: CreateRecurrence | P1 | [ ] | - |
| M4-054 | Action: GeneratePendingTransactions | P1 | [ ] | Job/Command |
| M4-055 | Endpoints REST /recurrences | P1 | [ ] | - |
| M4-056 | Testes: Recurrences | P1 | [ ] | - |

### Relatórios

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M4-060 | Action: GetPeriodSummary | P1 | [ ] | Receitas, despesas, saldo |
| M4-061 | Action: GetCategorySummary | P1 | [ ] | Totais por categoria |
| M4-062 | Action: GetAccountsSummary | P1 | [ ] | Saldo por conta |
| M4-063 | Endpoint GET /reports/summary | P1 | [ ] | - |
| M4-064 | Endpoint GET /reports/by-category | P1 | [ ] | - |
| M4-065 | Testes: Reports | P1 | [ ] | - |

---

## M5 - Integração Áudio/Imagem → API

### Fluxo de Confirmação

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M5-001 | Endpoint para receber confirmação (SIM/NÃO) | P0 | [ ] | - |
| M5-002 | Buscar dados pendentes por telefone | P0 | [ ] | - |
| M5-003 | Registrar transação na API | P0 | [ ] | Usar M4 Actions |
| M5-004 | Limpar dados pendentes após registro | P0 | [ ] | - |
| M5-005 | Enviar confirmação de sucesso | P0 | [ ] | - |

### Mapeamento

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M5-010 | Mapear categoria extraída → categoria do usuário | P1 | [ ] | Fuzzy match |
| M5-011 | Usar categoria padrão se não encontrar | P1 | [ ] | "Outros" |
| M5-012 | Usar conta padrão do usuário | P1 | [ ] | - |

### Correções

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M5-020 | Interpretar correções do usuário | P2 | [ ] | "O valor é 50" |
| M5-021 | Atualizar dados pendentes | P2 | [ ] | - |
| M5-022 | Reenviar confirmação atualizada | P2 | [ ] | - |

---

## M6 - Interface Gráfica

### Setup

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M6-001 | Criar projeto Vue 3 + TypeScript | P0 | [ ] | Vite |
| M6-002 | Configurar Tailwind CSS 4 | P0 | [ ] | - |
| M6-003 | Configurar shadcn-vue | P0 | [ ] | Componentes |
| M6-004 | Configurar Pinia | P0 | [ ] | Estado |
| M6-005 | Configurar roteamento (Vue Router) | P0 | [ ] | - |
| M6-006 | Cliente HTTP (axios/fetch) | P0 | [ ] | - |
| M6-007 | Autenticação (integrar com API) | P0 | [ ] | - |

### Telas

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M6-010 | Login via WhatsApp | P0 | [ ] | - |
| M6-011 | Dashboard | P0 | [ ] | Cards de resumo |
| M6-012 | Lista de transações | P0 | [ ] | Com filtros |
| M6-013 | Formulário de transação | P0 | [ ] | Criar/editar |
| M6-014 | Lista de contas | P1 | [ ] | - |
| M6-015 | Formulário de conta | P1 | [ ] | - |
| M6-016 | Lista de categorias | P1 | [ ] | - |
| M6-017 | Formulário de categoria | P1 | [ ] | - |
| M6-018 | Relatórios/Gráficos | P2 | [ ] | - |
| M6-019 | Configurações | P2 | [ ] | - |
| M6-020 | Recorrências | P2 | [ ] | - |

### Componentes

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M6-030 | Card de resumo financeiro | P0 | [ ] | Ref: GranaZen |
| M6-031 | Lista de transações | P0 | [ ] | - |
| M6-032 | Filtros de período | P0 | [ ] | - |
| M6-033 | Modal de confirmação | P1 | [ ] | - |
| M6-034 | Gráfico de pizza (categorias) | P2 | [ ] | - |
| M6-035 | Gráfico de linhas (evolução) | P2 | [ ] | - |

---

## M7 - Consultas de Posições

### Interpretação

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M7-001 | Identificar intenção de consulta | P0 | [ ] | vs registro |
| M7-002 | Extrair período da pergunta | P1 | [ ] | "esse mês", "março" |
| M7-003 | Extrair categoria da pergunta | P1 | [ ] | "alimentação" |
| M7-004 | Extrair conta da pergunta | P2 | [ ] | "nubank" |

### Consultas

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M7-010 | Consulta: saldo total | P0 | [ ] | Todas as contas |
| M7-011 | Consulta: saldo por conta | P1 | [ ] | - |
| M7-012 | Consulta: total por categoria | P1 | [ ] | - |
| M7-013 | Consulta: resumo do período | P0 | [ ] | Receitas, despesas, saldo |
| M7-014 | Consulta: comparativo com período anterior | P2 | [ ] | - |

### Resposta

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| M7-020 | Formatação de resposta para WhatsApp | P0 | [ ] | Texto simples |
| M7-021 | Geração de resposta via LLM | P1 | [ ] | Mais natural |

---

## Débito Técnico / Melhorias de Infraestrutura

### Docker / Containers

| ID | Item | Prioridade | Status | Notas |
|----|------|------------|--------|-------|
| DT-001 | Separar OCR em container dedicado | P2 | [ ] | Tesseract, poppler-utils, ImageMagick → container separado |
| DT-002 | Criar API interna para OCR | P2 | [ ] | Endpoint HTTP para processamento de imagens |
| DT-003 | Reduzir tamanho da imagem PHP | P3 | [ ] | Remover dependências de OCR (~200MB) |

**Justificativa DT-001:**
- Imagem atual: 890MB (com OCR)
- Imagem esperada sem OCR: ~650MB
- Benefícios: builds mais rápidos, separação de responsabilidades, escalabilidade independente

---

## Próximos Passos

1. **Revisar e priorizar** - Ajustar prioridades conforme necessidade
2. **Criar sprints** - Agrupar itens em sprints de 1-2 semanas
3. **Detalhar itens P0** - Criar documentação detalhada para itens críticos
4. **Iniciar M1** - Primeiro milestone
