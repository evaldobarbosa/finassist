# Arquitetura Ledger - FinAssistant

Documento que define a arquitetura de ledger (livro-razão) com partidas dobradas para suporte a finanças pessoais, casais e pequenas empresas.

---

## Visão Geral

O sistema utiliza uma **abordagem híbrida**:
- **Camada de usuário**: Interface simples (receita/despesa/transferência)
- **Camada interna**: Ledger com partidas dobradas (opcional via feature flag)

```
┌─────────────────────────────────────────────────────────────┐
│                    CAMADA DE USUÁRIO                        │
│         (Interface simples: receita/despesa/transfer)       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  CAMADA DE ABSTRAÇÃO                        │
│           TransactionService / LedgerService                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    LEDGER (interno)                         │
│         Partidas dobradas automáticas (feature flag)        │
└─────────────────────────────────────────────────────────────┘
```

---

## Feature Flag

A ledger com partidas dobradas é controlada por feature flag:

```env
# .env
LEDGER_ENABLED=false
```

```php
// config/features.php
return [
    'ledger' => [
        'enabled' => env('LEDGER_ENABLED', false),
    ],
];
```

**Comportamento:**
- `LEDGER_ENABLED=false`: Apenas tabela `transactions` é usada (modelo simples)
- `LEDGER_ENABLED=true`: Gera `ledger_entries` automaticamente (partidas dobradas)

---

## Modelo de Dados

### Organizações e Usuários

```
organizations
├── id (uuid)
├── name (string)
├── type (enum: personal, couple, business)
├── plan (enum: free, premium, business)
├── settings (json) - configurações específicas
├── created_at, updated_at, deleted_at
```

```
organization_users
├── id (uuid)
├── organization_id (uuid, FK)
├── user_id (uuid, FK)
├── role (enum: owner, admin, member, viewer)
├── permissions (json) - permissões específicas
├── created_at, updated_at
```

```
users
├── id (uuid)
├── phone (string, unique) - identificador principal (WhatsApp)
├── name (string, nullable)
├── email (string, nullable)
├── created_at, updated_at
```

### Plano de Contas

```
chart_accounts
├── id (uuid)
├── organization_id (uuid, FK)
├── parent_id (uuid, FK, nullable) - hierarquia
├── code (string) - código contábil (ex: "1.1.01")
├── name (string)
├── type (enum: asset, liability, equity, income, expense)
├── is_system (boolean) - conta criada pelo sistema
├── is_active (boolean)
├── metadata (json)
├── created_at, updated_at, deleted_at
```

**Tipos de Conta:**
| Tipo | Descrição | Natureza | Exemplos |
|------|-----------|----------|----------|
| asset | Ativo | Devedora | Caixa, Banco, Investimentos |
| liability | Passivo | Credora | Cartão de Crédito, Empréstimos |
| equity | Patrimônio | Credora | Capital, Lucros Acumulados |
| income | Receita | Credora | Salário, Vendas, Rendimentos |
| expense | Despesa | Devedora | Alimentação, Transporte, Moradia |

### Contas Financeiras (User-facing)

```
accounts
├── id (uuid)
├── organization_id (uuid, FK)
├── chart_account_id (uuid, FK, nullable) - vínculo com plano de contas
├── name (string) - nome amigável
├── type (enum: checking, savings, cash, credit_card, investment)
├── institution (string, nullable) - banco/instituição
├── color (string, nullable) - cor para UI
├── icon (string, nullable)
├── is_default (boolean) - conta padrão para transações
├── is_active (boolean)
├── metadata (json)
├── created_at, updated_at, deleted_at
```

### Cartões de Crédito

```
credit_cards
├── id (uuid)
├── account_id (uuid, FK) - vínculo com accounts
├── brand (enum: mastercard, visa, elo, amex, hipercard, other)
├── last_digits (string, 4 chars)
├── billing_day (integer) - dia do vencimento
├── closing_day (integer) - dia do fechamento
├── limit (decimal, nullable)
├── is_active (boolean)
├── created_at, updated_at, deleted_at
```

### Categorias

```
categories
├── id (uuid)
├── organization_id (uuid, FK)
├── chart_account_id (uuid, FK, nullable) - vínculo com plano de contas
├── parent_id (uuid, FK, nullable) - subcategorias
├── name (string)
├── type (enum: income, expense)
├── icon (string, nullable)
├── color (string, nullable)
├── keywords (json) - palavras-chave para classificação automática
├── is_system (boolean)
├── is_active (boolean)
├── created_at, updated_at, deleted_at
```

### Transações

```
transactions
├── id (uuid)
├── organization_id (uuid, FK)
├── user_id (uuid, FK) - quem criou
├── account_id (uuid, FK) - conta principal
├── destination_account_id (uuid, FK, nullable) - para transferências
├── category_id (uuid, FK, nullable)
├── credit_card_id (uuid, FK, nullable) - se for compra no cartão
├── parent_transaction_id (uuid, FK, nullable) - para parcelas
├── type (enum: income, expense, transfer)
├── status (enum: pending, confirmed, cancelled)
├── amount (decimal)
├── date (date) - data da transação
├── description (string)
├── notes (text, nullable)
├── origin (enum: manual, audio, image, text, import)
├── is_installment (boolean)
├── installment_number (integer, nullable) - parcela atual
├── installment_total (integer, nullable) - total de parcelas
├── metadata (json) - dados extras (OCR text, transcription, etc)
├── created_at, updated_at, deleted_at
```

### Ledger Entries (Feature Flag)

```
ledger_entries
├── id (uuid)
├── organization_id (uuid, FK)
├── transaction_id (uuid, FK)
├── chart_account_id (uuid, FK)
├── type (enum: debit, credit)
├── amount (decimal)
├── date (date)
├── created_at
```

**Regra fundamental:** Para cada transaction, a soma dos débitos DEVE ser igual à soma dos créditos.

---

## Plano de Contas Padrão

### Pessoal / Casal

```
1. ATIVOS
   1.1. Disponibilidades
       1.1.01 Caixa (Dinheiro)
       1.1.02 Conta Corrente
       1.1.03 Poupança
   1.2. Investimentos
       1.2.01 Renda Fixa
       1.2.02 Renda Variável

2. PASSIVOS
   2.1. Obrigações
       2.1.01 Cartão de Crédito
       2.1.02 Empréstimos
       2.1.03 Financiamentos

3. DESPESAS
   3.1. Essenciais
       3.1.01 Alimentação
       3.1.02 Moradia
       3.1.03 Transporte
       3.1.04 Saúde
       3.1.05 Educação
   3.2. Estilo de Vida
       3.2.01 Lazer
       3.2.02 Vestuário
       3.2.03 Beleza
   3.3. Financeiras
       3.3.01 Juros
       3.3.02 Taxas Bancárias
       3.3.03 IOF

4. RECEITAS
   4.1. Trabalho
       4.1.01 Salário
       4.1.02 Freelance
       4.1.03 Bônus
   4.2. Investimentos
       4.2.01 Dividendos
       4.2.02 Juros
       4.2.03 Rendimentos
   4.3. Outros
       4.3.01 Presentes
       4.3.02 Reembolsos
```

### Pequena Empresa (MEI/ME)

Adiciona:
```
1.3. Clientes
    1.3.01 Contas a Receber

2.2. Fornecedores
    2.2.01 Contas a Pagar

2.3. Obrigações Fiscais
    2.3.01 DAS (Simples Nacional)
    2.3.02 ISS
    2.3.03 INSS

3.4. Operacionais
    3.4.01 Fornecedores
    3.4.02 Serviços
    3.4.03 Marketing

4.4. Operacionais
    4.4.01 Vendas de Produtos
    4.4.02 Prestação de Serviços

5. PATRIMÔNIO LÍQUIDO
   5.1.01 Capital Social
   5.1.02 Lucros Acumulados
```

---

## Geração de Ledger Entries

### TransactionService

```php
class TransactionService
{
    public function __construct(
        protected LedgerService $ledger
    ) {}

    public function create(array $data): Transaction
    {
        $transaction = Transaction::create($data);

        // Gera ledger entries se feature flag ativada
        if (config('features.ledger.enabled')) {
            $this->ledger->generateEntries($transaction);
        }

        return $transaction;
    }
}
```

### LedgerService

```php
class LedgerService
{
    public function generateEntries(Transaction $transaction): void
    {
        $entries = match ($transaction->type) {
            'expense' => $this->expenseEntries($transaction),
            'income' => $this->incomeEntries($transaction),
            'transfer' => $this->transferEntries($transaction),
        };

        foreach ($entries as $entry) {
            LedgerEntry::create($entry);
        }

        $this->validateBalance($transaction);
    }

    protected function expenseEntries(Transaction $t): array
    {
        // Débito na conta de despesa, Crédito no ativo
        return [
            [
                'transaction_id' => $t->id,
                'chart_account_id' => $t->category->chart_account_id,
                'type' => 'debit',
                'amount' => $t->amount,
            ],
            [
                'transaction_id' => $t->id,
                'chart_account_id' => $t->account->chart_account_id,
                'type' => 'credit',
                'amount' => $t->amount,
            ],
        ];
    }

    protected function incomeEntries(Transaction $t): array
    {
        // Débito no ativo, Crédito na receita
        return [
            [
                'transaction_id' => $t->id,
                'chart_account_id' => $t->account->chart_account_id,
                'type' => 'debit',
                'amount' => $t->amount,
            ],
            [
                'transaction_id' => $t->id,
                'chart_account_id' => $t->category->chart_account_id,
                'type' => 'credit',
                'amount' => $t->amount,
            ],
        ];
    }

    protected function transferEntries(Transaction $t): array
    {
        // Débito na conta destino, Crédito na conta origem
        return [
            [
                'transaction_id' => $t->id,
                'chart_account_id' => $t->destinationAccount->chart_account_id,
                'type' => 'debit',
                'amount' => $t->amount,
            ],
            [
                'transaction_id' => $t->id,
                'chart_account_id' => $t->account->chart_account_id,
                'type' => 'credit',
                'amount' => $t->amount,
            ],
        ];
    }

    protected function validateBalance(Transaction $t): void
    {
        $debits = LedgerEntry::where('transaction_id', $t->id)
            ->where('type', 'debit')
            ->sum('amount');

        $credits = LedgerEntry::where('transaction_id', $t->id)
            ->where('type', 'credit')
            ->sum('amount');

        if (bccomp($debits, $credits, 2) !== 0) {
            throw new LedgerImbalanceException(
                "Ledger imbalance for transaction {$t->id}: debits={$debits}, credits={$credits}"
            );
        }
    }
}
```

---

## Compras Parceladas no Ledger

Quando `LEDGER_ENABLED=true`, uma compra parcelada gera:

```php
// Compra: R$ 1.200 em 12x de R$ 100 no cartão
// Data: 15/03/2024, Fechamento: dia 10, Vencimento: dia 17

// 1. Transação principal (compra)
Transaction::create([
    'type' => 'expense',
    'amount' => 1200,
    'is_installment' => true,
    'installment_total' => 12,
    'credit_card_id' => $card->id,
]);

// 2. Ledger entries da compra
// Débito: Despesa (quando comprou - temporalidade)
// Crédito: Passivo - Cartão de Crédito (dívida)
LedgerEntry::create(['type' => 'debit', 'account' => 'Despesas:Compras', 'amount' => 1200]);
LedgerEntry::create(['type' => 'credit', 'account' => 'Passivo:Cartão', 'amount' => 1200]);

// 3. Quando paga a fatura (cada mês)
// Débito: Passivo - Cartão (reduz dívida)
// Crédito: Ativo - Conta Corrente (sai dinheiro)
LedgerEntry::create(['type' => 'debit', 'account' => 'Passivo:Cartão', 'amount' => 100]);
LedgerEntry::create(['type' => 'credit', 'account' => 'Ativo:Conta', 'amount' => 100]);
```

---

## Relatórios

### Com Ledger Desativado (modelo simples)

- Extrato por conta
- Resumo por categoria
- Total receitas/despesas por período
- Saldo atual das contas

### Com Ledger Ativado (partidas dobradas)

Todos os anteriores, mais:
- **Balancete**: Saldo de todas as contas do plano
- **DRE**: Demonstração do Resultado (Receitas - Despesas)
- **Balanço Patrimonial**: Ativos = Passivos + PL
- **Razão Analítico**: Movimentação detalhada por conta
- **Livro Diário**: Todas as partidas em ordem cronológica

---

## Evolução por Tipo de Organização

| Feature | Personal | Couple | Business |
|---------|----------|--------|----------|
| Transações simples | ✓ | ✓ | ✓ |
| Categorias | ✓ | ✓ | ✓ |
| Múltiplas contas | ✓ | ✓ | ✓ |
| Cartões de crédito | ✓ | ✓ | ✓ |
| Parcelamentos | ✓ | ✓ | ✓ |
| Contas compartilhadas | - | ✓ | ✓ |
| Múltiplos usuários | - | ✓ | ✓ |
| Permissões por usuário | - | ✓ | ✓ |
| Ledger (partidas dobradas) | Opcional | Opcional | Recomendado |
| Plano de contas customizado | - | - | ✓ |
| DRE / Balanço | - | - | ✓ |
| Contas a pagar/receber | - | - | ✓ |

---

## Histórico de Decisões

| Data | Decisão | Justificativa |
|------|---------|---------------|
| 2024-03-28 | Ledger como feature flag | Permitir evolução gradual sem complexidade inicial |
| 2024-03-28 | Modelo híbrido (simples + ledger) | Atender pessoal e empresarial com mesma base |
| 2024-03-28 | Plano de contas padrão por tipo | Facilitar onboarding de cada perfil |
| 2024-03-28 | Feature flag desligada por padrão | Começar simples, ativar quando necessário |
