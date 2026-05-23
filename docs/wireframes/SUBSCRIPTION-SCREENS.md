# Wireframes - Telas de Assinatura Zapgrana

## Visão Geral do Fluxo

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         FLUXO DE ASSINATURA                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐          │
│  │  Signup  │───▶│  Plans   │───▶│ Checkout │───▶│ Success  │          │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘          │
│       │               │                                                 │
│       │               │         ┌──────────┐                           │
│       │               └────────▶│  Trial   │───▶ Dashboard             │
│       │                         └──────────┘                           │
│       │                                                                 │
│       └──────────────────────────────────────▶ Dashboard (Free)        │
│                                                      │                  │
│                                               ┌──────┴──────┐          │
│                                               │ Limit Modal │          │
│                                               └──────┬──────┘          │
│                                                      │                  │
│                                               ┌──────▼──────┐          │
│                                               │   Upgrade   │          │
│                                               └─────────────┘          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Tela de Seleção de Planos (`/plans`)

**Layout:** Full-width centrado (dentro do AuthLayout ou standalone)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                         [Logo Zapgrana]                          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                  │   │
│  │                    Escolha seu plano                             │   │
│  │           Comece grátis por 7 dias. Cancele quando quiser.       │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                  │   │
│  │     ┌─────────────┐                         ┌─────────────┐     │   │
│  │     │   Mensal    │                         │    Anual    │     │   │
│  │     │  (ativo)    │                         │  2 meses    │     │   │
│  │     │             │                         │   grátis    │     │   │
│  │     └─────────────┘                         └─────────────┘     │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                  │   │
│  │  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐            │   │
│  │  │             │   │  ★ POPULAR │   │             │            │   │
│  │  │   GRÁTIS    │   │             │   │    PRO     │            │   │
│  │  │             │   │   BÁSICO    │   │             │            │   │
│  │  │    R$ 0     │   │             │   │  R$ 49,90  │            │   │
│  │  │   /mês      │   │  R$ 19,90   │   │   /mês     │            │   │
│  │  │             │   │   /mês      │   │             │            │   │
│  │  │ ─────────── │   │             │   │ ─────────── │            │   │
│  │  │             │   │ ─────────── │   │             │            │   │
│  │  │ ✓ 10 msgs   │   │             │   │ ✓ 500 msgs │            │   │
│  │  │ ✓ 1 conta   │   │ ✓ 100 msgs │   │ ✓ 10 contas│            │   │
│  │  │ ✗ Áudio     │   │ ✓ 3 contas │   │ ✓ Áudio    │            │   │
│  │  │ ✗ Imagem    │   │ ✓ 20 áudios│   │ ✓ Imagem   │            │   │
│  │  │             │   │ ✓ 10 imgs  │   │ ✓ 5 cartões│            │   │
│  │  │             │   │ ✓ 2 cartões│   │ ✓ Relatórios│           │   │
│  │  │             │   │             │   │             │            │   │
│  │  │ [Continuar] │   │ [Começar   │   │ [Começar   │            │   │
│  │  │  Grátis   ] │   │   Trial  ] │   │   Trial  ] │            │   │
│  │  │             │   │             │   │             │            │   │
│  │  └─────────────┘   └─────────────┘   └─────────────┘            │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  🔒 Pagamento seguro  •  Cancele a qualquer momento             │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Especificações do Card de Plano

```
┌─────────────────────────────────────┐
│                                     │
│  ┌───────────────────────────────┐  │   Badge "POPULAR" (apenas Básico)
│  │       ★ MAIS POPULAR          │  │   - bg-primary text-white
│  └───────────────────────────────┘  │   - rounded-full px-3 py-1
│                                     │
│           [Icon do Plano]           │   Icon: Lucide (Sparkles, Zap, Crown)
│                                     │
│             BÁSICO                  │   font-semibold text-xl
│                                     │
│           R$ 19,90                  │   text-3xl font-bold text-primary
│             /mês                    │   text-sm text-muted
│                                     │
│  ───────────────────────────────    │   Separator
│                                     │
│  ✓ 100 mensagens de texto           │   Lista de features
│  ✓ 3 contas bancárias               │   ✓ = text-primary
│  ✓ 20 mensagens de áudio            │   ✗ = text-muted line-through
│  ✓ 10 mensagens de imagem           │
│  ✓ 2 cartões de crédito             │
│                                     │
│  ┌───────────────────────────────┐  │
│  │    Começar Trial Grátis       │  │   Button primary (plano popular)
│  └───────────────────────────────┘  │   Button outline (outros)
│                                     │
│       7 dias grátis, depois         │   text-xs text-muted
│          R$ 19,90/mês               │
│                                     │
└─────────────────────────────────────┘

Dimensões:
- Card width: 280px (mobile) / 320px (desktop)
- Card padding: 24px
- Border radius: 16px (rounded-2xl)
- Shadow: shadow-lg para popular, shadow-md para outros
- Border: 2px solid primary para popular
```

---

## 2. Tela de Checkout/Pagamento (`/checkout`)

**Layout:** Split-screen (esquerda: formulário, direita: resumo)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  ┌────────────────────────────┐  ┌────────────────────────────────────┐│
│  │                            │  │                                    ││
│  │  [Logo Zapgrana]           │  │     ┌────────────────────────┐    ││
│  │                            │  │     │                        │    ││
│  │  Finalizar assinatura      │  │     │    Resumo do Pedido    │    ││
│  │                            │  │     │                        │    ││
│  │  ───────────────────────── │  │     │  Plano Básico          │    ││
│  │                            │  │     │  Mensal                │    ││
│  │  Forma de Pagamento        │  │     │                        │    ││
│  │                            │  │     │  ────────────────────  │    ││
│  │  ┌──────────┐ ┌──────────┐ │  │     │                        │    ││
│  │  │          │ │          │ │  │     │  Subtotal    R$ 19,90  │    ││
│  │  │   PIX    │ │  Cartão  │ │  │     │  Desconto      -R$ 0   │    ││
│  │  │          │ │          │ │  │     │  ────────────────────  │    ││
│  │  └──────────┘ └──────────┘ │  │     │  Total       R$ 19,90  │    ││
│  │                            │  │     │                        │    ││
│  │  ═══════════════════════   │  │     │  Cobrança mensal       │    ││
│  │                            │  │     │  Próxima: 23/06/2026   │    ││
│  │  ## Se PIX selecionado:    │  │     │                        │    ││
│  │                            │  │     └────────────────────────┘    ││
│  │  ┌───────────────────────┐ │  │                                    ││
│  │  │                       │ │  │     ┌────────────────────────┐    ││
│  │  │     [QR CODE PIX]     │ │  │     │                        │    ││
│  │  │                       │ │  │     │  ✓ 7 dias grátis       │    ││
│  │  │                       │ │  │     │  ✓ Cancele quando      │    ││
│  │  └───────────────────────┘ │  │     │    quiser              │    ││
│  │                            │  │     │  ✓ Suporte prioritário │    ││
│  │  [ Copiar código PIX ]     │  │     │                        │    ││
│  │                            │  │     └────────────────────────┘    ││
│  │  Expira em: 29:45          │  │                                    ││
│  │                            │  │                                    ││
│  │  ═══════════════════════   │  │                                    ││
│  │                            │  │                                    ││
│  │  ## Se Cartão selecionado: │  │                                    ││
│  │                            │  │                                    ││
│  │  Número do cartão          │  │                                    ││
│  │  ┌───────────────────────┐ │  │                                    ││
│  │  │ 4111 1111 1111 1111   │ │  │                                    ││
│  │  └───────────────────────┘ │  │                                    ││
│  │                            │  │                                    ││
│  │  Validade        CVV       │  │                                    ││
│  │  ┌───────────┐ ┌─────────┐ │  │                                    ││
│  │  │  12/28    │ │   123   │ │  │                                    ││
│  │  └───────────┘ └─────────┘ │  │                                    ││
│  │                            │  │                                    ││
│  │  Nome no cartão            │  │                                    ││
│  │  ┌───────────────────────┐ │  │                                    ││
│  │  │ JOAO DA SILVA         │ │  │                                    ││
│  │  └───────────────────────┘ │  │                                    ││
│  │                            │  │                                    ││
│  │  Parcelas                  │  │                                    ││
│  │  ┌───────────────────────┐ │  │                                    ││
│  │  │ 1x de R$ 19,90 ▼      │ │  │                                    ││
│  │  └───────────────────────┘ │  │                                    ││
│  │                            │  │                                    ││
│  │  ┌───────────────────────┐ │  │                                    ││
│  │  │   Assinar agora       │ │  │                                    ││
│  │  └───────────────────────┘ │  │                                    ││
│  │                            │  │                                    ││
│  │  🔒 Seus dados estão       │  │                                    ││
│  │     protegidos             │  │                                    ││
│  │                            │  │                                    ││
│  └────────────────────────────┘  └────────────────────────────────────┘│
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Estados do Checkout

```
Estado: Processando Pagamento
┌─────────────────────────────────────┐
│                                     │
│         [Spinner animado]           │
│                                     │
│     Processando pagamento...        │
│                                     │
│     Aguarde, não feche esta         │
│     página.                         │
│                                     │
└─────────────────────────────────────┘

Estado: PIX Aguardando
┌─────────────────────────────────────┐
│                                     │
│         [QR Code grande]            │
│                                     │
│     Escaneie o QR Code ou           │
│     copie o código abaixo           │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ 00020126580014br.gov.bcb...   │  │
│  └───────────────────────────────┘  │
│                                     │
│      [ 📋 Copiar código ]           │
│                                     │
│     ⏱️ Expira em 28:32              │
│                                     │
│  ───────────────────────────────    │
│                                     │
│  Aguardando confirmação do          │
│  pagamento...                       │
│                                     │
└─────────────────────────────────────┘
```

---

## 3. Tela de Sucesso (`/checkout/success`)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                                                                         │
│                                                                         │
│                         ┌─────────────────┐                             │
│                         │                 │                             │
│                         │    ✓ (verde)    │    Ícone check animado     │
│                         │                 │    (scale + fade in)        │
│                         └─────────────────┘                             │
│                                                                         │
│                                                                         │
│                      Assinatura confirmada!                             │
│                                                                         │
│                  Bem-vindo ao Zapgrana Básico                           │
│                                                                         │
│                                                                         │
│              ┌─────────────────────────────────────┐                    │
│              │                                     │                    │
│              │  Seu período de teste começa agora  │                    │
│              │                                     │                    │
│              │  📅 Trial até: 30/05/2026           │                    │
│              │  💳 Primeira cobrança: 30/05/2026   │                    │
│              │  💰 Valor: R$ 19,90/mês             │                    │
│              │                                     │                    │
│              └─────────────────────────────────────┘                    │
│                                                                         │
│                                                                         │
│              ┌─────────────────────────────────────┐                    │
│              │     Começar a usar o Zapgrana       │                    │
│              └─────────────────────────────────────┘                    │
│                                                                         │
│                                                                         │
│                Enviamos um e-mail de confirmação                        │
│                    para joao@email.com                                  │
│                                                                         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Modal de Limite Excedido (In-App)

**Trigger:** Quando usuário tenta usar recurso além do limite

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  ░░░░░░░░░░░░░░░░░░░░░ BACKDROP ESCURO ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ░░░░░░░┌───────────────────────────────────────────────────┐░░░░░░░░  │
│  ░░░░░░░│                                                 X │░░░░░░░░  │
│  ░░░░░░░│                                                   │░░░░░░░░  │
│  ░░░░░░░│              ⚠️ (ícone amarelo)                   │░░░░░░░░  │
│  ░░░░░░░│                                                   │░░░░░░░░  │
│  ░░░░░░░│        Limite de mensagens atingido               │░░░░░░░░  │
│  ░░░░░░░│                                                   │░░░░░░░░  │
│  ░░░░░░░│   Você usou todas as 10 mensagens de texto        │░░░░░░░░  │
│  ░░░░░░░│   do seu plano Grátis este mês.                   │░░░░░░░░  │
│  ░░░░░░░│                                                   │░░░░░░░░  │
│  ░░░░░░░│   ┌─────────────────────────────────────────┐     │░░░░░░░░  │
│  ░░░░░░░│   │                                         │     │░░░░░░░░  │
│  ░░░░░░░│   │  ████████████████████████████████  100% │     │░░░░░░░░  │
│  ░░░░░░░│   │                                         │     │░░░░░░░░  │
│  ░░░░░░░│   │  10/10 mensagens usadas                 │     │░░░░░░░░  │
│  ░░░░░░░│   │  Renova em: 01/06/2026                  │     │░░░░░░░░  │
│  ░░░░░░░│   │                                         │     │░░░░░░░░  │
│  ░░░░░░░│   └─────────────────────────────────────────┘     │░░░░░░░░  │
│  ░░░░░░░│                                                   │░░░░░░░░  │
│  ░░░░░░░│   ┌─────────────────────────────────────────┐     │░░░░░░░░  │
│  ░░░░░░░│   │      Fazer upgrade para Básico          │     │░░░░░░░░  │
│  ░░░░░░░│   │         100 mensagens/mês               │     │░░░░░░░░  │
│  ░░░░░░░│   │           R$ 19,90/mês                  │     │░░░░░░░░  │
│  ░░░░░░░│   └─────────────────────────────────────────┘     │░░░░░░░░  │
│  ░░░░░░░│                                                   │░░░░░░░░  │
│  ░░░░░░░│            [ Ver todos os planos ]                │░░░░░░░░  │
│  ░░░░░░░│                                                   │░░░░░░░░  │
│  ░░░░░░░└───────────────────────────────────────────────────┘░░░░░░░░  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Seção de Upgrade no Dashboard

**Localização:** Banner no topo do dashboard ou card na sidebar

```
Banner Topo (quando < 20% do limite restante):
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  ⚡ Seus limites estão acabando! Restam 2 mensagens.  [ Fazer Upgrade ] │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

Card Sidebar (para usuários Free):
┌─────────────────────────────────┐
│                                 │
│  ┌───────────────────────────┐  │
│  │                           │  │
│  │   🚀 Desbloqueie mais     │  │
│  │      recursos             │  │
│  │                           │  │
│  │   • 100 mensagens/mês     │  │
│  │   • Mensagens de áudio    │  │
│  │   • Relatórios avançados  │  │
│  │                           │  │
│  │  ┌─────────────────────┐  │  │
│  │  │  Começar por        │  │  │
│  │  │  R$ 19,90/mês       │  │  │
│  │  └─────────────────────┘  │  │
│  │                           │  │
│  └───────────────────────────┘  │
│                                 │
└─────────────────────────────────┘
```

---

## 6. Tela de Gerenciamento de Assinatura (`/settings/subscription`)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  [← Voltar]                    Minha Assinatura                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                  │   │
│  │  Plano Atual                                                     │   │
│  │  ─────────────────────────────────────────────────────────────   │   │
│  │                                                                  │   │
│  │  ┌────────────────────────────────────────────────────────────┐ │   │
│  │  │                                                            │ │   │
│  │  │   [Icon]  BÁSICO                        [ Mudar Plano ]    │ │   │
│  │  │                                                            │ │   │
│  │  │   R$ 19,90/mês                                             │ │   │
│  │  │   Próxima cobrança: 23/06/2026                             │ │   │
│  │  │                                                            │ │   │
│  │  │   Status: ● Ativo                                          │ │   │
│  │  │                                                            │ │   │
│  │  └────────────────────────────────────────────────────────────┘ │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                  │   │
│  │  Uso do Mês                                                      │   │
│  │  ─────────────────────────────────────────────────────────────   │   │
│  │                                                                  │   │
│  │  Mensagens de Texto                                              │   │
│  │  ████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░  45/100 (45%)     │   │
│  │                                                                  │   │
│  │  Mensagens de Áudio                                              │   │
│  │  ██████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  5/20 (25%)       │   │
│  │                                                                  │   │
│  │  Mensagens de Imagem                                             │   │
│  │  ████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  2/10 (20%)       │   │
│  │                                                                  │   │
│  │  Contas Bancárias                                                │   │
│  │  ████████████████████████████████████████████  3/3 (100%) ⚠️    │   │
│  │                                                                  │   │
│  │  Cartões de Crédito                                              │   │
│  │  ████████████████████████████░░░░░░░░░░░░░░░░  1/2 (50%)        │   │
│  │                                                                  │   │
│  │  Renova em: 01/06/2026                                           │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                  │   │
│  │  Forma de Pagamento                                              │   │
│  │  ─────────────────────────────────────────────────────────────   │   │
│  │                                                                  │   │
│  │  💳 Visa •••• 4242                          [ Alterar ]          │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                  │   │
│  │  Histórico de Faturas                                            │   │
│  │  ─────────────────────────────────────────────────────────────   │   │
│  │                                                                  │   │
│  │  23/05/2026   R$ 19,90   Pago ✓           [ Ver fatura ]         │   │
│  │  23/04/2026   R$ 19,90   Pago ✓           [ Ver fatura ]         │   │
│  │  23/03/2026   R$ 19,90   Pago ✓           [ Ver fatura ]         │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                  │   │
│  │                 [ Cancelar assinatura ]                          │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Modal de Cancelamento

```
┌───────────────────────────────────────────────────────────────┐
│                                                             X │
│                                                               │
│                    Cancelar assinatura?                       │
│                                                               │
│   Sentiremos sua falta! 😢                                    │
│                                                               │
│   Ao cancelar:                                                │
│   • Você perderá acesso aos recursos premium                  │
│   • Seu histórico será mantido                                │
│   • Você pode voltar quando quiser                            │
│                                                               │
│   Sua assinatura ficará ativa até 23/06/2026                  │
│                                                               │
│   ─────────────────────────────────────────────────────────   │
│                                                               │
│   Antes de ir, conte-nos o motivo:                            │
│                                                               │
│   ○ Muito caro                                                │
│   ○ Não uso o suficiente                                      │
│   ○ Encontrei alternativa melhor                              │
│   ○ Problemas técnicos                                        │
│   ○ Outro: [________________]                                 │
│                                                               │
│   ─────────────────────────────────────────────────────────   │
│                                                               │
│   ┌─────────────────────┐  ┌─────────────────────────────┐   │
│   │  Manter assinatura  │  │  Confirmar cancelamento     │   │
│   │     (primário)      │  │      (destructive)          │   │
│   └─────────────────────┘  └─────────────────────────────┘   │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

---

## Tokens de Design (Referência)

```css
/* Cores */
--color-primary: #006b2c;        /* Verde Zapgrana */
--color-primary-light: #7ffc97;  /* Verde claro */
--color-danger: #bb0112;         /* Vermelho */
--color-warning: #f59e0b;        /* Amarelo */
--color-surface: #f9f9ff;        /* Background */
--color-surface-card: #ffffff;   /* Cards */

/* Tipografia */
--font-family: 'Poppins', sans-serif;
--font-size-h1: 48px;
--font-size-h2: 32px;
--font-size-h3: 24px;
--font-size-body: 16px;
--font-size-small: 14px;

/* Espaçamento */
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
--spacing-2xl: 48px;

/* Bordas */
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 24px;
--radius-full: 9999px;

/* Sombras */
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
--shadow-md: 0 4px 6px rgba(0,0,0,0.1);
--shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
```

---

## Componentes Reutilizáveis

### PlanCard.vue
```
Props:
- plan: Plan
- isPopular: boolean
- isSelected: boolean
- billingPeriod: 'monthly' | 'yearly'

Emits:
- select: (plan: Plan) => void
```

### UsageBar.vue
```
Props:
- feature: string
- used: number
- limit: number | null (null = unlimited)
- showWarning: boolean

Computed:
- percentage: number
- isNearLimit: boolean (> 80%)
- isAtLimit: boolean (>= 100%)
```

### LimitModal.vue
```
Props:
- feature: string
- used: number
- limit: number
- renewDate: Date
- suggestedPlan: Plan

Emits:
- upgrade: () => void
- close: () => void
```

### PaymentForm.vue
```
Props:
- plan: Plan
- method: 'pix' | 'credit_card'

Emits:
- submit: (paymentData: PaymentData) => void
- methodChange: (method: string) => void
```

---

## Responsividade

### Mobile (< 768px)
- Cards de plano empilhados verticalmente
- Checkout em tela única (resumo colapsável)
- Modal de limite em full-screen
- Barra de uso simplificada

### Tablet (768px - 1024px)
- 2 cards de plano por linha
- Checkout split-screen mantido
- Modal centralizado

### Desktop (> 1024px)
- 3 cards de plano por linha
- Layout completo conforme wireframes
