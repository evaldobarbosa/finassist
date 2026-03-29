# Modelagem Financeira - FinAssistant

Documento que define as regras de modelagem financeira do sistema.

---

## Cartão de Crédito

### Cadastro do Cartão

Ao cadastrar um cartão de crédito, deve-se registrar:

| Campo | Descrição | Exemplo |
|-------|-----------|---------|
| nome | Nome identificador | Nubank, Itaú Platinum |
| bandeira | Bandeira do cartão | Mastercard, Visa, Elo |
| ultimos_digitos | Últimos 4 dígitos | 1111 |
| dia_vencimento | Dia do vencimento da fatura | 15 |
| dia_fechamento | Dia do fechamento da fatura | 8 |
| limite | Limite total (opcional) | 50000.00 |

**Cálculo do fechamento:** Se não informado, assumir ~7 dias antes do vencimento.

### Compras Parceladas

Quando uma compra parcelada é identificada (via OCR ou áudio), deve-se registrar:

#### Registro Principal (Compra)

```json
{
  "tipo": "expense",
  "valor_total": 25000.00,
  "parcelas": 5,
  "valor_parcela": 5000.00,
  "cartao_id": "uuid-do-cartao",
  "data_compra": "2018-03-15",
  "estabelecimento": "Loja da Dai",
  "categoria": "Pendente de classificação",
  "origem": "image",
  "status": "confirmed"
}
```

#### Projeção de Parcelas (Demonstrativo)

As parcelas são **apenas demonstrativas** e:

- **NÃO** compõem o montante "a pagar" do mês no extrato padrão
- **NÃO** são registros de despesa independentes
- **SÃO** informações para visualização e relatórios futuros
- **SÃO** vinculadas ao registro principal da compra

```json
{
  "compra_id": "uuid-da-compra",
  "parcelas": [
    { "numero": 1, "valor": 5000.00, "fatura_mes": "2018-04", "status": "pendente" },
    { "numero": 2, "valor": 5000.00, "fatura_mes": "2018-05", "status": "pendente" },
    { "numero": 3, "valor": 5000.00, "fatura_mes": "2018-06", "status": "pendente" },
    { "numero": 4, "valor": 5000.00, "fatura_mes": "2018-07", "status": "pendente" },
    { "numero": 5, "valor": 5000.00, "fatura_mes": "2018-08", "status": "pendente" }
  ]
}
```

#### Determinação da Fatura

Para determinar em qual fatura a compra (ou primeira parcela) será incluída:

1. Verificar a **data da compra**
2. Comparar com o **dia de fechamento** do cartão
3. Se compra **antes** do fechamento → entra na fatura do mês atual
4. Se compra **depois** do fechamento → entra na fatura do próximo mês

**Exemplo:**
- Cartão com fechamento dia 8 e vencimento dia 15
- Compra em 15/03/2018 (após fechamento de março)
- Primeira parcela entra na fatura de **Abril/2018** (vencimento 15/04)

### Pagamento de Fatura

O pagamento da fatura do cartão é registrado como **transferência**:

```json
{
  "tipo": "transfer",
  "valor": 5000.00,
  "conta_origem": "uuid-conta-corrente",
  "conta_destino": "uuid-cartao",
  "data": "2018-04-15",
  "descricao": "Pagamento fatura Mastercard ***1111 - Abril/2018"
}
```

**Regras:**
- A fatura do cartão **não** é uma entidade própria no sistema
- Apenas o **pagamento** é registrado
- O pagamento é uma transferência de conta corrente/caixa para o cartão
- O pagamento **SIM** compõe o extrato do mês como saída de caixa

---

## Extrato Padrão

O extrato padrão do mês mostra apenas:

| Inclui | Não Inclui |
|--------|------------|
| Despesas efetivas (débito, PIX, dinheiro) | Parcelas futuras de compras parceladas |
| Receitas | Projeções |
| Pagamentos de fatura de cartão | Compras no crédito (aparecem quando a fatura é paga) |
| Transferências entre contas | - |

### Princípio da Temporalidade

- **Compra no crédito**: registrada como despesa na data da compra (temporalidade contábil)
- **Impacto no caixa**: ocorre apenas quando a fatura é paga
- **Extrato de caixa**: mostra apenas movimentações efetivas de dinheiro

---

## Categoria Fallback

Quando o sistema não conseguir determinar a categoria de uma transação:

- **Nome**: "Pendente de classificação"
- **Comportamento**: Transação fica marcada para classificação manual pelo usuário
- **Visibilidade**: Pode haver filtro/indicador de "transações a classificar"

---

## Fluxo de Compra Parcelada (OCR/Áudio)

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. Recebe comprovante (imagem/áudio)                            │
├─────────────────────────────────────────────────────────────────┤
│ 2. Extrai dados:                                                │
│    - Valor total: R$ 25.000                                     │
│    - Parcelas: 5x R$ 5.000                                      │
│    - Cartão: Mastercard                                         │
│    - Data: 15/03/2018                                           │
│    - Estabelecimento: Loja da Dai                               │
├─────────────────────────────────────────────────────────────────┤
│ 3. Identifica cartão do usuário (Mastercard ***1111)            │
├─────────────────────────────────────────────────────────────────┤
│ 4. Calcula fatura de cada parcela baseado no fechamento         │
├─────────────────────────────────────────────────────────────────┤
│ 5. Registra:                                                    │
│    - Compra principal (expense, valor total, data da compra)    │
│    - Projeção de parcelas (demonstrativo, JSON)                 │
├─────────────────────────────────────────────────────────────────┤
│ 6. Retorna confirmação ao usuário                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Histórico de Decisões

| Data | Decisão | Justificativa |
|------|---------|---------------|
| 2024-03-28 | Parcelas são apenas demonstrativas | Não devem compor o "a pagar" do mês no extrato padrão |
| 2024-03-28 | Fatura não é entidade própria | Simplificação - registra-se apenas o pagamento |
| 2024-03-28 | Pagamento de fatura é transferência | Conta corrente → Cartão |
| 2024-03-28 | Categoria fallback: "Pendente de classificação" | Para transações não categorizadas automaticamente |
