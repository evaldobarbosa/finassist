# FinAssistant - Frontend Specs

> Documento de especificações para geração de mockups no Stitch.
> Aplicação de gestão financeira pessoal com integração WhatsApp.

---

## 1. Design System

### 1.1 Cores

#### Cores Primárias
| Nome | Hex | Uso |
|------|-----|-----|
| Primary | `#16A34A` | Botões principais, links, elementos de destaque |
| Primary Dark | `#15803D` | Hover de botões primários |
| Primary Light | `#22C55E` | Badges, indicadores positivos |

#### Cores Semânticas
| Nome | Hex | Uso |
|------|-----|-----|
| Income (Receita) | `#16A34A` | Valores positivos, botões de receita |
| Expense (Despesa) | `#DC2626` | Valores negativos, botões de despesa |
| Warning | `#F59E0B` | Alertas, pendências |
| Info | `#3B82F6` | Informações, links |

#### Cores Neutras
| Nome | Hex | Uso |
|------|-----|-----|
| Background | `#F9FAFB` | Fundo da aplicação |
| Surface | `#FFFFFF` | Cards, modais |
| Border | `#E5E7EB` | Bordas, divisores |
| Text Primary | `#111827` | Textos principais |
| Text Secondary | `#6B7280` | Textos secundários, labels |
| Text Muted | `#9CA3AF` | Placeholders, textos desabilitados |

#### Cores de Categorias (Exemplos)
| Categoria | Hex |
|-----------|-----|
| Alimentação | `#FF6B6B` |
| Transporte | `#4ECDC4` |
| Moradia | `#45B7D1` |
| Saúde | `#FF8C94` |
| Lazer | `#F39C12` |
| Salário | `#27AE60` |
| Investimentos | `#2980B9` |

### 1.2 Tipografia

| Elemento | Font | Weight | Size | Line Height |
|----------|------|--------|------|-------------|
| H1 | Inter | 700 | 30px | 36px |
| H2 | Inter | 600 | 24px | 32px |
| H3 | Inter | 600 | 20px | 28px |
| H4 | Inter | 600 | 16px | 24px |
| Body | Inter | 400 | 14px | 20px |
| Body Small | Inter | 400 | 12px | 16px |
| Label | Inter | 500 | 14px | 20px |
| Button | Inter | 500 | 14px | 20px |
| Caption | Inter | 400 | 12px | 16px |

### 1.3 Espaçamentos

| Nome | Valor |
|------|-------|
| xs | 4px |
| sm | 8px |
| md | 16px |
| lg | 24px |
| xl | 32px |
| 2xl | 48px |

### 1.4 Border Radius

| Nome | Valor |
|------|-------|
| sm | 4px |
| md | 8px |
| lg | 12px |
| xl | 16px |
| full | 9999px |

### 1.5 Sombras

| Nome | Valor |
|------|-------|
| sm | `0 1px 2px rgba(0,0,0,0.05)` |
| md | `0 4px 6px rgba(0,0,0,0.1)` |
| lg | `0 10px 15px rgba(0,0,0,0.1)` |
| xl | `0 20px 25px rgba(0,0,0,0.15)` |

---

## 2. Componentes Base

### 2.1 Botões

#### Primary Button
```
- Background: Primary (#16A34A)
- Text: White
- Padding: 12px 24px
- Border Radius: md (8px)
- Hover: Primary Dark (#15803D)
- Disabled: Opacity 50%
```

#### Secondary Button
```
- Background: White
- Border: 1px solid Border (#E5E7EB)
- Text: Text Primary (#111827)
- Padding: 12px 24px
- Border Radius: md (8px)
- Hover: Background (#F9FAFB)
```

#### Danger Button
```
- Background: Expense (#DC2626)
- Text: White
- Padding: 12px 24px
- Border Radius: md (8px)
- Hover: #B91C1C
```

#### Ghost Button
```
- Background: Transparent
- Text: Primary (#16A34A)
- Padding: 12px 24px
- Hover: Primary com 10% opacity
```

#### Icon Button
```
- Background: Transparent
- Size: 40px x 40px
- Border Radius: md (8px)
- Hover: Background (#F9FAFB)
```

### 2.2 Inputs

#### Text Input
```
- Height: 44px
- Padding: 12px 16px
- Border: 1px solid Border (#E5E7EB)
- Border Radius: md (8px)
- Background: White
- Focus: Border Primary (#16A34A), shadow ring
- Error: Border Expense (#DC2626)
- Placeholder: Text Muted (#9CA3AF)
```

#### Money Input
```
- Mesmo estilo do Text Input
- Prefixo "R$" em Text Secondary
- Alinhamento do valor à direita
- Formatação automática (1.234,56)
```

#### Select/Dropdown
```
- Mesmo estilo do Text Input
- Ícone chevron-down à direita
- Dropdown com shadow-lg
- Items com hover Background
```

#### Phone Input
```
- Prefixo com bandeira e código (+55)
- Máscara: (11) 99999-9999
```

### 2.3 Cards

#### Summary Card
```
- Background: White
- Border Radius: lg (12px)
- Padding: 24px
- Shadow: sm
- Header: Título + ícone de olho (ocultar valor)
- Valor principal: H2, cor conforme tipo
- Subtítulo: Caption, Text Secondary
- Detalhes expansíveis (opcional)
```

#### List Card
```
- Background: White
- Border Radius: lg (12px)
- Shadow: sm
- Header com título e ações
- Dividers entre items
```

### 2.4 Modais

```
- Overlay: Black com 50% opacity
- Container: White, Border Radius xl (16px)
- Width: 480px (sm), 640px (md), 800px (lg)
- Padding: 24px
- Header: H3 + botão fechar (X)
- Footer: Botões alinhados à direita
- Animação: fade in + slide up
```

### 2.5 Badges

#### Status Badge
```
- Padding: 4px 12px
- Border Radius: full
- Font: Caption, weight 500
- Cores por status:
  - Pendente: Warning background light, Warning text
  - Confirmado: Income background light, Income text
  - Cancelado: Expense background light, Expense text
```

#### Category Badge
```
- Círculo de cor (12px) + texto
- Background: cor da categoria com 10% opacity
- Text: cor da categoria
- Padding: 4px 12px
- Border Radius: full
```

### 2.6 Tabelas

```
- Header: Background (#F9FAFB), Text Secondary, weight 500
- Rows: Border bottom (#E5E7EB)
- Row Hover: Background (#F9FAFB)
- Padding células: 16px
- Ações: Icon buttons à direita
```

### 2.7 Empty States

```
- Ícone centralizado (64px, Text Muted)
- Título: H4, Text Primary
- Descrição: Body, Text Secondary
- CTA: Primary Button (opcional)
```

### 2.8 Todo Checklist

```
- Container: Card com borda Warning (#F59E0B)
- Header: "Complete seu perfil" + botão minimizar
- Items em grid 2x2 ou lista
- Cada item: círculo vazio + texto + seta
- Item completo: círculo com check verde
- Clicável: abre modal correspondente
```

---

## 3. Layout Principal

### 3.1 Estrutura

```
┌──────────────────────────────────────────────────────────┐
│                        Header                             │
├────────────┬─────────────────────────────────────────────┤
│            │                                              │
│  Sidebar   │              Main Content                    │
│  (240px)   │              (flex: 1)                       │
│            │                                              │
│            │                                              │
└────────────┴─────────────────────────────────────────────┘
```

### 3.2 Header

```
- Height: 64px
- Background: White
- Border bottom: 1px solid Border
- Padding: 0 24px
- Layout: Logo à esquerda | Ações à direita
- Ações: Notificações (ícone bell) + Avatar dropdown
```

### 3.3 Sidebar

```
- Width: 240px
- Background: White
- Border right: 1px solid Border
- Padding: 24px 16px
- Logo no topo
- Menu items com ícones
- Item ativo: Background Primary light, Text Primary
- Item hover: Background (#F9FAFB)
```

#### Menu Items
```
1. 🏠 Dashboard
2. 💳 Transações
3. 🏦 Contas
4. 🏷️ Categorias
5. 💳 Cartões de Crédito
6. ⚙️ Configurações
```

### 3.4 Main Content

```
- Background: Background (#F9FAFB)
- Padding: 32px
- Max Width: 1200px (centralizado em telas grandes)
```

---

## 4. Telas de Autenticação

### 4.1 Login

```
Layout: Split screen
- Esquerda (50%): Formulário
- Direita (50%): Área decorativa (gradiente verde + ilustração)

Formulário:
┌─────────────────────────────────────┐
│                                     │
│  [Logo FinAssistant]                │
│                                     │
│  Bem-vindo de volta                 │
│  Entre na sua conta                 │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ 🔵 Continuar com Google     │    │
│  └─────────────────────────────┘    │
│                                     │
│  ────────── ou ──────────           │
│                                     │
│  E-mail                             │
│  ┌─────────────────────────────┐    │
│  │ seu@email.com               │    │
│  └─────────────────────────────┘    │
│                                     │
│  Senha                              │
│  ┌─────────────────────────────┐    │
│  │ ••••••••                 👁 │    │
│  └─────────────────────────────┘    │
│  [Esqueceu a senha?]                │
│                                     │
│  ┌─────────────────────────────┐    │
│  │        Entrar               │    │
│  └─────────────────────────────┘    │
│                                     │
│  Não tem conta? [Criar conta]       │
│                                     │
└─────────────────────────────────────┘
```

### 4.2 Cadastro

```
Layout: Split screen (mesmo do login)

Formulário:
┌─────────────────────────────────────┐
│                                     │
│  [Logo FinAssistant]                │
│                                     │
│  Criar conta                        │
│  Comece a organizar suas finanças   │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ 🔵 Continuar com Google     │    │
│  └─────────────────────────────┘    │
│                                     │
│  ────────── ou ──────────           │
│                                     │
│  Nome completo                      │
│  ┌─────────────────────────────┐    │
│  │                             │    │
│  └─────────────────────────────┘    │
│                                     │
│  E-mail                             │
│  ┌─────────────────────────────┐    │
│  │                             │    │
│  └─────────────────────────────┘    │
│                                     │
│  Senha                              │
│  ┌─────────────────────────────┐    │
│  │                          👁 │    │
│  └─────────────────────────────┘    │
│  Mínimo 8 caracteres                │
│                                     │
│  ☐ Aceito os Termos de Uso e        │
│    Política de Privacidade          │
│                                     │
│  ┌─────────────────────────────┐    │
│  │      Criar conta            │    │
│  └─────────────────────────────┘    │
│                                     │
│  Já tem conta? [Entrar]             │
│                                     │
└─────────────────────────────────────┘
```

### 4.3 Recuperar Senha

```
Layout: Split screen

Formulário:
┌─────────────────────────────────────┐
│                                     │
│  [← Voltar para login]              │
│                                     │
│  Recuperar senha                    │
│  Digite seu e-mail para receber     │
│  o link de recuperação              │
│                                     │
│  E-mail                             │
│  ┌─────────────────────────────┐    │
│  │ seu@email.com               │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │     Enviar link             │    │
│  └─────────────────────────────┘    │
│                                     │
└─────────────────────────────────────┘

Estado: Enviado
┌─────────────────────────────────────┐
│                                     │
│  ✉️ (ícone grande)                  │
│                                     │
│  E-mail enviado!                    │
│  Verifique sua caixa de entrada     │
│  e clique no link para redefinir    │
│  sua senha.                         │
│                                     │
│  [Voltar para login]                │
│                                     │
└─────────────────────────────────────┘
```

---

## 5. Tela de Billing

### 5.1 Seleção de Plano

```
Layout: Centralizado, fundo Background

┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  [Logo FinAssistant]                                        │
│                                                             │
│  Escolha seu plano                                          │
│  Comece com 7 dias grátis, cancele quando quiser            │
│                                                             │
│  ┌─────────────────────┐    ┌─────────────────────┐         │
│  │                     │    │  ⭐ Recomendado     │         │
│  │  Básico             │    │                     │         │
│  │                     │    │  Pro                │         │
│  │  R$ 19,90/mês       │    │                     │         │
│  │                     │    │  R$ 29,90/mês       │         │
│  │  ✓ Dashboard        │    │                     │         │
│  │  ✓ Transações       │    │  ✓ Tudo do Básico   │         │
│  │  ✓ 3 Contas         │    │  ✓ Contas ilimitadas│         │
│  │  ✓ Categorias       │    │  ✓ WhatsApp         │         │
│  │  ✗ WhatsApp         │    │  ✓ Áudio e Foto     │         │
│  │  ✗ Áudio e Foto     │    │  ✓ Relatórios PDF   │         │
│  │                     │    │  ✓ Suporte priority │         │
│  │  [Selecionar]       │    │                     │         │
│  │                     │    │  [Selecionar]       │         │
│  └─────────────────────┘    └─────────────────────┘         │
│                                                             │
│  Todos os planos incluem:                                   │
│  • 7 dias grátis • Cancele a qualquer momento               │
│  • Seus dados sempre seguros                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Pagamento

```
Layout: Centralizado

┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  [← Trocar plano]                                           │
│                                                             │
│  Pagamento                                                  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Resumo                                               │  │
│  │                                                       │  │
│  │  Plano Pro                           R$ 29,90/mês     │  │
│  │  7 dias grátis                       - R$ 29,90       │  │
│  │  ─────────────────────────────────────────────────    │  │
│  │  Total hoje                              R$ 0,00      │  │
│  │                                                       │  │
│  │  Após o período de teste: R$ 29,90/mês                │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  Dados do cartão                                            │
│                                                             │
│  Número do cartão                                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ 💳 1234 5678 9012 3456                                │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  Validade                    CVV                            │
│  ┌─────────────────────┐     ┌─────────────────────┐        │
│  │ MM/AA               │     │ 123                 │        │
│  └─────────────────────┘     └─────────────────────┘        │
│                                                             │
│  Nome no cartão                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Iniciar período grátis                   │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  🔒 Pagamento seguro processado pelo Stripe                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Dashboard

### 6.1 Layout Completo

```
┌────────────────────────────────────────────────────────────────────────┐
│ [Logo]                                           🔔  [Avatar ▼]        │
├────────────┬───────────────────────────────────────────────────────────┤
│            │                                                           │
│ 🏠 Dashboard│  ┌─────────────────────────────────────────────────────┐  │
│ 💳 Transações│ │ ⚠️ Complete seu perfil                [Minimizar ▼] │  │
│ 🏦 Contas   │  │                                                     │  │
│ 🏷️ Categorias│ │ ○ Conectar WhatsApp      ○ Adicionar receitas fixas │  │
│ 💳 Cartões  │  │ ○ Adicionar despesas     ○ Personalizar categorias  │  │
│            │  │   fixas                                              │  │
│ ──────────  │  └─────────────────────────────────────────────────────┘  │
│ ⚙️ Config   │                                                           │
│            │  ┌─ Filtros ────────────────────────────────────────────┐  │
│            │  │ [Hoje] [7 dias] [Este mês ✓] [Este ano] [Período ▼]  │  │
│            │  └──────────────────────────────────────────────────────┘  │
│            │                                                           │
│            │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│            │  │ Saldo    │ │ Receitas │ │ Despesas │ │ Saldo    │     │
│            │  │ Anterior │ │          │ │          │ │ Atual    │     │
│            │  │          │ │ 👁       │ │ 👁       │ │          │     │
│            │  │ R$ 0,00  │ │ R$ 0,00  │ │ R$ 0,00  │ │ R$ 0,00  │     │
│            │  │          │ │ ────     │ │ ────     │ │          │     │
│            │  │ Até      │ │ Recebido │ │ Pago     │ │ Disponív.│     │
│            │  │ 28/Fev   │ │ R$ 0,00  │ │ R$ 0,00  │ │ R$ 0,00  │     │
│            │  │          │ │ A receber│ │ A pagar  │ │          │     │
│            │  │          │ │ R$ 0,00  │ │ R$ 0,00  │ │ Previsto │     │
│            │  │          │ │          │ │          │ │ R$ 0,00  │     │
│            │  └──────────┘ └──────────┘ └──────────┘ └──────────┘     │
│            │                                                           │
│            │  Transações               [+ Receita] [+ Despesa]         │
│            │  ┌─────────────────────────────────────────────────────┐  │
│            │  │ [Todas ✓] [Receitas] [Despesas]   🔍 Buscar...      │  │
│            │  ├─────────────────────────────────────────────────────┤  │
│            │  │                                                     │  │
│            │  │     📋 Nenhuma transação ainda                     │  │
│            │  │                                                     │  │
│            │  │     Registre sua primeira transação clicando       │  │
│            │  │     em "+ Receita" ou "+ Despesa" acima.           │  │
│            │  │                                                     │  │
│            │  │     Ou conecte seu WhatsApp para enviar            │  │
│            │  │     transações por mensagem!                       │  │
│            │  │                                                     │  │
│            │  │           [Conectar WhatsApp]                      │  │
│            │  │                                                     │  │
│            │  └─────────────────────────────────────────────────────┘  │
│            │                                                           │
└────────────┴───────────────────────────────────────────────────────────┘
```

### 6.2 Summary Cards (Detalhado)

#### Card: Saldo Anterior
```
┌────────────────────────────┐
│ Saldo Anterior             │
│                            │
│ R$ 1.250,00                │
│ Até 28 de Fevereiro        │
│                            │
│ (Receitas - Despesas       │
│  + Saldo das contas)       │
└────────────────────────────┘
Cor do valor: Text Primary
```

#### Card: Receitas
```
┌────────────────────────────┐
│ Receitas              👁   │
│                            │
│ R$ 5.000,00                │  ← Verde (Income)
│ 1 Mar - 31 Mar             │
│                            │
│ ▼ Detalhes                 │
│ ┌────────────────────────┐ │
│ │ ✓ Recebido  R$ 3.000,00│ │
│ │ ⏳ A receber R$ 2.000,00│ │
│ └────────────────────────┘ │
└────────────────────────────┘
```

#### Card: Despesas
```
┌────────────────────────────┐
│ Despesas              👁   │
│                            │
│ R$ 3.200,00                │  ← Vermelho (Expense)
│ 1 Mar - 31 Mar             │
│                            │
│ ▼ Detalhes                 │
│ ┌────────────────────────┐ │
│ │ ✓ Pago      R$ 2.000,00│ │
│ │ ⏳ A pagar  R$ 1.200,00│ │
│ └────────────────────────┘ │
└────────────────────────────┘
```

#### Card: Saldo Atual
```
┌────────────────────────────┐
│ Saldo Atual                │
│                            │
│ Disponível                 │
│ R$ 3.050,00                │  ← Verde se positivo
│ Até 31 de Março            │
│                            │
│ ─────────────────────────  │
│                            │
│ Previsto                   │
│ R$ 3.050,00            ℹ️  │
│ Até 31 de Março            │
└────────────────────────────┘
```

### 6.3 Todo Checklist (Onboarding)

```
┌─────────────────────────────────────────────────────────────────┐
│ ⚠️ Complete seu perfil para aproveitar todos os recursos  [─]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────┐  ┌─────────────────────────┐      │
│  │ ○ Conectar WhatsApp     │  │ ○ Receitas fixas        │      │
│  │   Envie transações por  │  │   Cadastre salário e    │      │
│  │   áudio, foto ou texto  │  │   outras receitas       │      │
│  │                    →    │  │                    →    │      │
│  └─────────────────────────┘  └─────────────────────────┘      │
│                                                                 │
│  ┌─────────────────────────┐  ┌─────────────────────────┐      │
│  │ ○ Despesas fixas        │  │ ○ Personalizar          │      │
│  │   Cadastre aluguel,     │  │   categorias            │      │
│  │   streaming, etc        │  │   Crie subcategorias    │      │
│  │                    →    │  │                    →    │      │
│  └─────────────────────────┘  └─────────────────────────┘      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Estado: Item completo
┌─────────────────────────┐
│ ✓ Conectar WhatsApp     │  ← Check verde, texto riscado
│   +55 11 99999-9999     │  ← Mostra número conectado
│   Conectado ✓           │
└─────────────────────────┘

Estado: Todos completos (banner desaparece ou fica minimizado)
```

### 6.4 Lista de Transações

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Transações                                  [+ Receita] [+ Despesa]    │
├─────────────────────────────────────────────────────────────────────────┤
│ [Todas ✓] [Receitas] [Despesas]                      🔍 Buscar...      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  📅 Hoje - 29 de Março                                                 │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 🟠 Alimentação    iFood                          - R$ 45,00     │   │
│  │                   Carteira • 14:30                        [···] │   │
│  ├─────────────────────────────────────────────────────────────────┤   │
│  │ 🟢 Salário        Salário Março                  + R$ 5.000,00  │   │
│  │                   Nubank • 08:00                          [···] │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  📅 28 de Março                                                        │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 🔵 Transporte     Uber                           - R$ 25,50     │   │
│  │                   Carteira • 19:45                        [···] │   │
│  ├─────────────────────────────────────────────────────────────────┤   │
│  │ 🟠 Alimentação    Supermercado Extra             - R$ 234,80    │   │
│  │                   Nubank • 11:20                          [···] │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────     │
│  Mostrando 4 de 4                              [← Anterior] [Próximo →]│
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

Menu de ações [···]:
┌────────────────────┐
│ ✏️ Editar          │
│ 📋 Duplicar        │
│ 🗑️ Excluir         │
└────────────────────┘
```

---

## 7. Modais de Onboarding

### 7.1 Modal: Conectar WhatsApp

#### Etapa 1: Informar número
```
┌─────────────────────────────────────────────────────┐
│ Conectar WhatsApp                              [X]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  📱                                                 │
│                                                     │
│  Registre transações pelo WhatsApp                  │
│                                                     │
│  Envie mensagens de texto, áudio ou foto            │
│  e nós registramos automaticamente.                 │
│                                                     │
│  Seu número de WhatsApp                             │
│  ┌──────┬────────────────────────────────────────┐  │
│  │ +55  │ (11) 99999-9999                        │  │
│  └──────┴────────────────────────────────────────┘  │
│                                                     │
│                         [Enviar código de verificação]│
│                                                     │
└─────────────────────────────────────────────────────┘
```

#### Etapa 2: Verificar código
```
┌─────────────────────────────────────────────────────┐
│ Verificar código                               [X]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Enviamos um código para                            │
│  +55 11 99999-9999                                  │
│                                                     │
│  Digite o código de 6 dígitos:                      │
│                                                     │
│       ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐         │
│       │   │ │   │ │   │ │   │ │   │ │   │         │
│       └───┘ └───┘ └───┘ └───┘ └───┘ └───┘         │
│                                                     │
│  Não recebeu? [Reenviar código]                     │
│                                                     │
│                              [Verificar]            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

#### Etapa 3: Sucesso
```
┌─────────────────────────────────────────────────────┐
│ WhatsApp conectado!                            [X]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│                    ✅                               │
│                                                     │
│  Seu WhatsApp foi conectado com sucesso!            │
│                                                     │
│  Agora você pode enviar:                            │
│                                                     │
│  💬 "Gastei 50 reais no mercado"                   │
│  🎤 Áudio descrevendo a transação                  │
│  📷 Foto do cupom ou nota fiscal                   │
│                                                     │
│  Salve nosso número:                                │
│  +55 11 98765-4321                                  │
│                                                     │
│                              [Entendi]              │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 7.2 Modal: Receitas Fixas

```
┌─────────────────────────────────────────────────────┐
│ Adicionar Receitas Fixas                       [X]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Cadastre suas receitas que se repetem todo mês.    │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │ Receita #1                              [🗑️] │    │
│  │                                              │    │
│  │ Descrição                                    │    │
│  │ ┌──────────────────────────────────────────┐ │    │
│  │ │ Ex: Salário, Freelance                   │ │    │
│  │ └──────────────────────────────────────────┘ │    │
│  │                                              │    │
│  │ Valor              Dia do recebimento        │    │
│  │ ┌────────────────┐ ┌────────────────┐        │    │
│  │ │ R$ 0,00        │ │ 5              │        │    │
│  │ └────────────────┘ └────────────────┘        │    │
│  │                                              │    │
│  │ Categoria          Conta                     │    │
│  │ ┌────────────────┐ ┌────────────────┐        │    │
│  │ │ Salário      ▼ │ │ Carteira     ▼ │        │    │
│  │ └────────────────┘ └────────────────┘        │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  [+ Adicionar outra receita]                        │
│                                                     │
│                     [Pular]  [Salvar receitas]      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 7.3 Modal: Despesas Fixas

```
┌─────────────────────────────────────────────────────┐
│ Adicionar Despesas Fixas                       [X]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Cadastre suas despesas que se repetem todo mês.    │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │ Despesa #1                              [🗑️] │    │
│  │                                              │    │
│  │ Descrição                                    │    │
│  │ ┌──────────────────────────────────────────┐ │    │
│  │ │ Ex: Aluguel, Netflix, Academia           │ │    │
│  │ └──────────────────────────────────────────┘ │    │
│  │                                              │    │
│  │ Valor              Dia do vencimento         │    │
│  │ ┌────────────────┐ ┌────────────────┐        │    │
│  │ │ R$ 0,00        │ │ 10             │        │    │
│  │ └────────────────┘ └────────────────┘        │    │
│  │                                              │    │
│  │ Categoria          Conta                     │    │
│  │ ┌────────────────┐ ┌────────────────┐        │    │
│  │ │ Moradia      ▼ │ │ Carteira     ▼ │        │    │
│  │ └────────────────┘ └────────────────┘        │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  [+ Adicionar outra despesa]                        │
│                                                     │
│                     [Pular]  [Salvar despesas]      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 7.4 Modal: Personalizar Categorias

```
┌─────────────────────────────────────────────────────┐
│ Personalizar Categorias                        [X]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Crie subcategorias para organizar melhor           │
│  suas transações.                                   │
│                                                     │
│  🔍 Buscar categoria...                             │
│                                                     │
│  DESPESAS                                           │
│  ┌─────────────────────────────────────────────┐    │
│  │ 🟠 Alimentação                          [+] │    │
│  │    └─ Restaurantes                          │    │
│  │    └─ Supermercado                          │    │
│  │    └─ Delivery                          [🗑️]│    │
│  ├─────────────────────────────────────────────┤    │
│  │ 🔵 Transporte                           [+] │    │
│  │    └─ Combustível                           │    │
│  │    └─ Uber/99                               │    │
│  │    └─ Estacionamento                        │    │
│  ├─────────────────────────────────────────────┤    │
│  │ 🟣 Moradia                              [+] │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  RECEITAS                                           │
│  ┌─────────────────────────────────────────────┐    │
│  │ 🟢 Salário                              [+] │    │
│  │ 🟢 Freelance                            [+] │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│                                      [Concluir]     │
│                                                     │
└─────────────────────────────────────────────────────┘

Ao clicar [+]:
┌─────────────────────────────────────────────────────┐
│ Nova subcategoria em Alimentação                    │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Nome da subcategoria                            │ │
│ └─────────────────────────────────────────────────┘ │
│                            [Cancelar]  [Adicionar]  │
└─────────────────────────────────────────────────────┘
```

---

## 8. Tela de Transações

### 8.1 Lista de Transações (Página Dedicada)

```
┌────────────────────────────────────────────────────────────────────────┐
│ [Logo]                                           🔔  [Avatar ▼]        │
├────────────┬───────────────────────────────────────────────────────────┤
│            │                                                           │
│ 🏠 Dashboard│  Transações                   [+ Receita] [+ Despesa]    │
│ 💳 Transações│                                                          │
│ 🏦 Contas   │  ┌─ Filtros ──────────────────────────────────────────┐  │
│ 🏷️ Categorias│ │ Período: [Este mês ▼]                               │  │
│ 💳 Cartões  │  │ Categoria: [Todas ▼]  Conta: [Todas ▼]              │  │
│            │  │ Status: [Todos ▼]  Tipo: [Todos ▼]                   │  │
│ ──────────  │  │                                     [Limpar filtros] │  │
│ ⚙️ Config   │  └────────────────────────────────────────────────────┘  │
│            │                                                           │
│            │  ┌─────────────────────────────────────────────────────┐  │
│            │  │ [Todas ✓] [Receitas] [Despesas]   🔍 Buscar...      │  │
│            │  ├─────────────────────────────────────────────────────┤  │
│            │  │                                                     │  │
│            │  │ ☐  Data       Descrição       Categoria    Valor    │  │
│            │  │ ─────────────────────────────────────────────────── │  │
│            │  │ ☐  29/03     iFood           🟠 Aliment.  -R$45,00  │  │
│            │  │ ☐  29/03     Salário Março   🟢 Salário   +R$5.000  │  │
│            │  │ ☐  28/03     Uber            🔵 Transp.   -R$25,50  │  │
│            │  │ ☐  28/03     Supermercado    🟠 Aliment.  -R$234,80 │  │
│            │  │ ☐  27/03     Netflix         🟣 Assinat.  -R$55,90  │  │
│            │  │                                                     │  │
│            │  ├─────────────────────────────────────────────────────┤  │
│            │  │ Selecionados: 0      [🗑️ Excluir]  [📋 Categorizar] │  │
│            │  │                                                     │  │
│            │  │ Mostrando 5 de 47        [← Anterior] [Próximo →]   │  │
│            │  └─────────────────────────────────────────────────────┘  │
│            │                                                           │
└────────────┴───────────────────────────────────────────────────────────┘
```

### 8.2 Modal: Criar/Editar Transação

```
┌─────────────────────────────────────────────────────┐
│ Nova Despesa                                   [X]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [Receita]  [Despesa ✓]  [Transferência]           │
│                                                     │
│  Valor                                              │
│  ┌─────────────────────────────────────────────┐    │
│  │                              R$ 0,00        │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  Descrição                                          │
│  ┌─────────────────────────────────────────────┐    │
│  │ Ex: Almoço no restaurante                   │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  Data                      Categoria                │
│  ┌──────────────────┐      ┌──────────────────┐     │
│  │ 📅 29/03/2026    │      │ 🟠 Alimentação ▼ │     │
│  └──────────────────┘      └──────────────────┘     │
│                                                     │
│  Conta                     Status                   │
│  ┌──────────────────┐      ┌──────────────────┐     │
│  │ 💳 Carteira    ▼ │      │ ✓ Confirmado   ▼ │     │
│  └──────────────────┘      └──────────────────┘     │
│                                                     │
│  Observações (opcional)                             │
│  ┌─────────────────────────────────────────────┐    │
│  │                                             │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│                       [Cancelar]  [Salvar]          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 8.3 Modal: Transferência

```
┌─────────────────────────────────────────────────────┐
│ Nova Transferência                             [X]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [Receita]  [Despesa]  [Transferência ✓]           │
│                                                     │
│  Valor                                              │
│  ┌─────────────────────────────────────────────┐    │
│  │                              R$ 0,00        │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  De (origem)               Para (destino)           │
│  ┌──────────────────┐  →   ┌──────────────────┐     │
│  │ 💳 Carteira    ▼ │      │ 🏦 Nubank      ▼ │     │
│  └──────────────────┘      └──────────────────┘     │
│                                                     │
│  Data                                               │
│  ┌─────────────────────────────────────────────┐    │
│  │ 📅 29/03/2026                               │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  Descrição (opcional)                               │
│  ┌─────────────────────────────────────────────┐    │
│  │ Ex: Transferência para investimento         │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│                       [Cancelar]  [Transferir]      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 9. Tela de Contas

### 9.1 Lista de Contas

```
┌────────────────────────────────────────────────────────────────────────┐
│ [Logo]                                           🔔  [Avatar ▼]        │
├────────────┬───────────────────────────────────────────────────────────┤
│            │                                                           │
│ 🏠 Dashboard│  Contas Bancárias                        [+ Nova Conta]  │
│ 💳 Transações│                                                          │
│ 🏦 Contas ✓ │  Organize suas finanças com múltiplas contas             │
│ 🏷️ Categorias│                                                          │
│ 💳 Cartões  │  [Ativas ✓]  [Arquivadas]                                │
│            │                                                           │
│ ──────────  │  ┌─────────────────────────────────────────────────────┐  │
│ ⚙️ Config   │  │                                                     │  │
│            │  │  💼 Carteira                          [···]          │  │
│            │  │  ──────────────────────────────────────────          │  │
│            │  │  Saldo atual                                         │  │
│            │  │  R$ 1.250,00                          🔄             │  │
│            │  │                                                      │  │
│            │  │  ⭐ Conta padrão                                     │  │
│            │  │  Transações via WhatsApp usam esta conta             │  │
│            │  │                                                      │  │
│            │  │  [📋 Extrato] [💰 Ajustar] [↔️ Transferir]           │  │
│            │  │                                                      │  │
│            │  └─────────────────────────────────────────────────────┘  │
│            │                                                           │
│            │  ┌─────────────────────────────────────────────────────┐  │
│            │  │                                                     │  │
│            │  │  🏦 Nubank                             [···]         │  │
│            │  │  ──────────────────────────────────────────          │  │
│            │  │  Saldo atual                                         │  │
│            │  │  R$ 3.500,00                          🔄             │  │
│            │  │                                                      │  │
│            │  │  [📋 Extrato] [💰 Ajustar] [↔️ Transferir]           │  │
│            │  │                                                      │  │
│            │  └─────────────────────────────────────────────────────┘  │
│            │                                                           │
│            │  ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐  │
│            │  │                                                     │  │
│            │  │  + Adicionar nova conta                             │  │
│            │  │                                                     │  │
│            │  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘  │
│            │                                                           │
└────────────┴───────────────────────────────────────────────────────────┘

Menu [···]:
┌────────────────────────┐
│ ⭐ Definir como padrão │
│ ✏️ Editar              │
│ 📁 Arquivar            │
└────────────────────────┘
```

### 9.2 Modal: Nova Conta

```
┌─────────────────────────────────────────────────────┐
│ Nova Conta                                     [X]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Tipo de conta                                      │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │
│  │ 💼 Carteira  │ │ 🏦 Banco     │ │ 💰 Poupança  │ │
│  │      ✓      │ │              │ │              │ │
│  └──────────────┘ └──────────────┘ └──────────────┘ │
│                                                     │
│  Nome da conta                                      │
│  ┌─────────────────────────────────────────────┐    │
│  │ Ex: Nubank, Carteira, Poupança              │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  Saldo inicial                                      │
│  ┌─────────────────────────────────────────────┐    │
│  │                              R$ 0,00        │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  Instituição (opcional)                             │
│  ┌─────────────────────────────────────────────┐    │
│  │ Ex: Nubank, Itaú, Bradesco                  │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ☐ Definir como conta padrão                        │
│                                                     │
│                       [Cancelar]  [Criar conta]     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 9.3 Modal: Ajustar Saldo

```
┌─────────────────────────────────────────────────────┐
│ Ajustar Saldo - Carteira                       [X]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Saldo atual: R$ 1.250,00                           │
│                                                     │
│  Novo saldo                                         │
│  ┌─────────────────────────────────────────────┐    │
│  │                              R$ 1.250,00    │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ℹ️ O ajuste será registrado como uma transação    │
│     de "Ajuste de saldo".                           │
│                                                     │
│                       [Cancelar]  [Ajustar]         │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 10. Tela de Categorias

### 10.1 Lista de Categorias

```
┌────────────────────────────────────────────────────────────────────────┐
│ [Logo]                                           🔔  [Avatar ▼]        │
├────────────┬───────────────────────────────────────────────────────────┤
│            │                                                           │
│ 🏠 Dashboard│  Categorias                          [+ Nova Categoria]  │
│ 💳 Transações│                                                          │
│ 🏦 Contas   │  🔍 Buscar categoria...                                  │
│ 🏷️ Categ. ✓ │                                                          │
│ 💳 Cartões  │  [Despesas ✓]  [Receitas]                                │
│            │                                                           │
│ ──────────  │  ┌─────────────────────────────────────────────────────┐  │
│ ⚙️ Config   │  │ Categoria          Subcategorias    Limite   Ações  │  │
│            │  ├─────────────────────────────────────────────────────┤  │
│            │  │ 🟠 Alimentação      3                -        [···] │  │
│            │  │    └─ Restaurantes                                  │  │
│            │  │    └─ Supermercado                                  │  │
│            │  │    └─ Delivery                                      │  │
│            │  ├─────────────────────────────────────────────────────┤  │
│            │  │ 🔵 Transporte       2                -        [···] │  │
│            │  │    └─ Combustível                                   │  │
│            │  │    └─ Uber/99                                       │  │
│            │  ├─────────────────────────────────────────────────────┤  │
│            │  │ 🟣 Moradia          0                R$ 2.000 [···] │  │
│            │  ├─────────────────────────────────────────────────────┤  │
│            │  │ 🟡 Saúde            0                -        [···] │  │
│            │  ├─────────────────────────────────────────────────────┤  │
│            │  │ 🟢 Lazer            0                R$ 500   [···] │  │
│            │  ├─────────────────────────────────────────────────────┤  │
│            │  │ 🔴 Contas           0                -        [···] │  │
│            │  └─────────────────────────────────────────────────────┘  │
│            │                                                           │
└────────────┴───────────────────────────────────────────────────────────┘

Menu [···]:
┌────────────────────────┐
│ ➕ Subcategoria        │
│ ✏️ Editar              │
│ 🗑️ Excluir             │
└────────────────────────┘
```

### 10.2 Modal: Nova Categoria

```
┌─────────────────────────────────────────────────────┐
│ Nova Categoria                                 [X]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Tipo                                               │
│  ┌────────────────────┐ ┌────────────────────┐      │
│  │ 💸 Despesa    ✓    │ │ 💰 Receita         │      │
│  └────────────────────┘ └────────────────────┘      │
│                                                     │
│  Nome da categoria                                  │
│  ┌─────────────────────────────────────────────┐    │
│  │                                             │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  Cor                                                │
│  ┌─────────────────────────────────────────────┐    │
│  │ 🔴🟠🟡🟢🔵🟣⚫⚪                    #FF6B6B │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  Ícone (opcional)                                   │
│  ┌─────────────────────────────────────────────┐    │
│  │ 🍔 🚗 🏠 💊 🎮 👕 📱 💼  ...              │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ☐ Definir limite de gasto mensal                   │
│  ┌─────────────────────────────────────────────┐    │
│  │                              R$ 0,00        │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│                       [Cancelar]  [Criar]           │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 11. Tela de Cartões de Crédito

### 11.1 Lista de Cartões

```
┌────────────────────────────────────────────────────────────────────────┐
│ [Logo]                                           🔔  [Avatar ▼]        │
├────────────┬───────────────────────────────────────────────────────────┤
│            │                                                           │
│ 🏠 Dashboard│  Cartões de Crédito                     [+ Novo Cartão]  │
│ 💳 Transações│                                                          │
│ 🏦 Contas   │  [Meus Cartões ✓]  [Arquivados]                          │
│ 🏷️ Categorias│                                                          │
│ 💳 Cartões ✓│  ┌─────────────────────────────────────────────────────┐  │
│            │  │                                                     │  │
│ ──────────  │  │  💳 Nubank Ultravioleta                  [···]      │  │
│ ⚙️ Config   │  │  ──────────────────────────────────────────         │  │
│            │  │  Mastercard •••• 1234                                │  │
│            │  │                                                      │  │
│            │  │  Fatura atual (Mar/2026)                             │  │
│            │  │  R$ 1.450,00                                         │  │
│            │  │  Fecha dia 15 • Vence dia 22                         │  │
│            │  │                                                      │  │
│            │  │  Limite: R$ 10.000,00                                │  │
│            │  │  Disponível: R$ 8.550,00                             │  │
│            │  │  ████████████░░░░░ 14%                               │  │
│            │  │                                                      │  │
│            │  │  [📋 Ver fatura] [💳 Nova despesa]                   │  │
│            │  │                                                      │  │
│            │  └─────────────────────────────────────────────────────┘  │
│            │                                                           │
│            │  ┌─────────────────────────────────────────────────────┐  │
│            │  │                                                     │  │
│            │  │  💳 Inter Black                           [···]      │  │
│            │  │  ──────────────────────────────────────────         │  │
│            │  │  Mastercard •••• 5678                                │  │
│            │  │                                                      │  │
│            │  │  Fatura atual (Mar/2026)                             │  │
│            │  │  R$ 320,00                                           │  │
│            │  │  Fecha dia 20 • Vence dia 27                         │  │
│            │  │                                                      │  │
│            │  │  [📋 Ver fatura] [💳 Nova despesa]                   │  │
│            │  │                                                      │  │
│            │  └─────────────────────────────────────────────────────┘  │
│            │                                                           │
└────────────┴───────────────────────────────────────────────────────────┘
```

### 11.2 Modal: Novo Cartão

```
┌─────────────────────────────────────────────────────┐
│ Novo Cartão de Crédito                         [X]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Nome do cartão                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │ Ex: Nubank, Inter, C6                       │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  Bandeira                    Últimos 4 dígitos      │
│  ┌──────────────────┐        ┌──────────────────┐   │
│  │ Mastercard    ▼  │        │ 1234             │   │
│  └──────────────────┘        └──────────────────┘   │
│                                                     │
│  Dia do fechamento           Dia do vencimento      │
│  ┌──────────────────┐        ┌──────────────────┐   │
│  │ 15               │        │ 22               │   │
│  └──────────────────┘        └──────────────────┘   │
│                                                     │
│  Limite do cartão                                   │
│  ┌─────────────────────────────────────────────┐    │
│  │                              R$ 0,00        │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  Conta para pagamento da fatura                     │
│  ┌─────────────────────────────────────────────┐    │
│  │ Carteira                                  ▼ │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│                       [Cancelar]  [Criar cartão]    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 11.3 Tela: Detalhes da Fatura

```
┌────────────────────────────────────────────────────────────────────────┐
│ [← Voltar]                                                             │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  Fatura - Nubank Ultravioleta                                          │
│                                                                        │
│  [◀ Fev/2026]  [Mar/2026 ✓]  [Abr/2026 ▶]                             │
│                                                                        │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                 │   │
│  │  Total da fatura                    Status                      │   │
│  │  R$ 1.450,00                        🟡 Aberta                   │   │
│  │                                                                 │   │
│  │  Fecha em: 15/03/2026              Vence em: 22/03/2026        │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                        │
│  Lançamentos                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                 │   │
│  │  10/03   iFood                   🟠 Alimentação    R$ 45,00     │   │
│  │  08/03   Amazon                  🟣 Compras        R$ 199,00    │   │
│  │  05/03   Spotify                 🟣 Assinatura     R$ 21,90     │   │
│  │  05/03   Netflix                 🟣 Assinatura     R$ 55,90     │   │
│  │  01/03   Uber                    🔵 Transporte     R$ 32,00     │   │
│  │  28/02   Magazine Luiza 2/10     🟣 Compras        R$ 150,00    │   │
│  │                                                                 │   │
│  │  ─────────────────────────────────────────────────────────────  │   │
│  │  Parcelas                                         R$ 150,00     │   │
│  │  Compras à vista                                  R$ 353,80     │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                        │
│                                            [Pagar fatura]              │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 12. Tela de Configurações

### 12.1 Layout Geral

```
┌────────────────────────────────────────────────────────────────────────┐
│ [Logo]                                           🔔  [Avatar ▼]        │
├────────────┬───────────────────────────────────────────────────────────┤
│            │                                                           │
│ 🏠 Dashboard│  Configurações                                           │
│ 💳 Transações│                                                          │
│ 🏦 Contas   │  ┌─────────────────────────────────────────────────────┐  │
│ 🏷️ Categorias│ │                                                     │  │
│ 💳 Cartões  │  │  [👤 Perfil ✓] [🔔 Notificações] [📱 WhatsApp]      │  │
│            │  │  [💳 Assinatura] [📁 Dados]                          │  │
│ ──────────  │  │                                                     │  │
│ ⚙️ Config ✓ │  └─────────────────────────────────────────────────────┘  │
│            │                                                           │
│            │  (conteúdo da aba selecionada)                            │
│            │                                                           │
└────────────┴───────────────────────────────────────────────────────────┘
```

### 12.2 Aba: Perfil

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Meu Perfil                                                     │
│                                                                 │
│  ┌───────┐                                                      │
│  │       │  [Alterar foto]                                      │
│  │  JD   │                                                      │
│  │       │                                                      │
│  └───────┘                                                      │
│                                                                 │
│  Nome                                                           │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ João da Silva                                           │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  E-mail                                                         │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ joao@email.com                                      🔒  │    │
│  └─────────────────────────────────────────────────────────┘    │
│  Para alterar, entre em contato com o suporte.                  │
│                                                                 │
│                                        [Salvar alterações]      │
│                                                                 │
│  ─────────────────────────────────────────────────────────      │
│                                                                 │
│  Segurança                                                      │
│                                                                 │
│  [🔑 Alterar senha]                                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 12.3 Aba: Notificações

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Notificações                                                   │
│                                                                 │
│  Configure como deseja receber lembretes de contas a pagar.     │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │  Habilitar notificações                          [  ✓]  │    │
│  │                                                         │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │                                                         │    │
│  │  Notificar via WhatsApp                          [  ✓]  │    │
│  │  Receba lembretes no seu WhatsApp conectado             │    │
│  │                                                         │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │                                                         │    │
│  │  Notificar via E-mail                            [   ]  │    │
│  │  Receba lembretes no seu e-mail cadastrado              │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  Quando lembrar?                                                │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ No dia do vencimento                                  ▼ │    │
│  └─────────────────────────────────────────────────────────┘    │
│  Opções: No dia, 1 dia antes, 3 dias antes, 1 semana antes      │
│                                                                 │
│                                        [Salvar configurações]   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 12.4 Aba: WhatsApp

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  WhatsApp                                                       │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │  📱 Número conectado                                    │    │
│  │                                                         │    │
│  │  +55 11 99999-9999                         ✅ Verificado│    │
│  │                                                         │    │
│  │  [Alterar número]                                       │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  Como usar                                                      │
│                                                                 │
│  Salve nosso número e envie mensagens para registrar            │
│  transações automaticamente:                                    │
│                                                                 │
│  📱 +55 11 98765-4321                          [Copiar]         │
│                                                                 │
│  Exemplos:                                                      │
│  • "Gastei 50 reais no mercado"                                 │
│  • Envie um áudio descrevendo o gasto                           │
│  • Envie uma foto do cupom fiscal                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Se não conectado:
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  WhatsApp                                                       │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │  📱 Nenhum número conectado                             │    │
│  │                                                         │    │
│  │  Conecte seu WhatsApp para enviar transações por        │    │
│  │  mensagem de texto, áudio ou foto.                      │    │
│  │                                                         │    │
│  │  [Conectar WhatsApp]                                    │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 12.5 Aba: Assinatura

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Assinatura                                                     │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │  Plano atual: Pro                         🟢 Ativo      │    │
│  │                                                         │    │
│  │  R$ 29,90/mês                                           │    │
│  │  Próxima cobrança: 15/04/2026                           │    │
│  │                                                         │    │
│  │  [Gerenciar assinatura]  [Cancelar plano]               │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  Histórico de pagamentos                                        │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 15/03/2026    Plano Pro    R$ 29,90    ✅ Pago          │    │
│  │ 15/02/2026    Plano Pro    R$ 29,90    ✅ Pago          │    │
│  │ 15/01/2026    Plano Pro    R$ 29,90    ✅ Pago          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 12.6 Aba: Dados

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Meus Dados                                                     │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │  📥 Exportar dados                                      │    │
│  │                                                         │    │
│  │  Exporte todas as suas transações em formato CSV.       │    │
│  │                                                         │    │
│  │  [Exportar transações]                                  │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │  🗑️ Excluir transações                                  │    │
│  │                                                         │    │
│  │  Exclua todas as transações e comece do zero.           │    │
│  │  Esta ação não pode ser desfeita.                       │    │
│  │                                                         │    │
│  │  [Excluir todas as transações]  ← botão vermelho        │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │  ⚠️ Excluir conta                                       │    │
│  │                                                         │    │
│  │  Exclua permanentemente sua conta e todos os dados.     │    │
│  │  Esta ação não pode ser desfeita.                       │    │
│  │                                                         │    │
│  │  [Excluir minha conta]  ← botão vermelho                │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 13. Estados Especiais

### 13.1 Loading

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│                    ◠ (spinner)                      │
│                    Carregando...                    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 13.2 Empty State - Transações

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│                    📋                               │
│                                                     │
│           Nenhuma transação ainda                   │
│                                                     │
│    Registre sua primeira transação clicando em     │
│    "+ Receita" ou "+ Despesa" acima.               │
│                                                     │
│    Ou conecte seu WhatsApp para enviar             │
│    transações por mensagem!                        │
│                                                     │
│              [Conectar WhatsApp]                   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 13.3 Empty State - Filtro sem resultados

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│                    🔍                               │
│                                                     │
│         Nenhum resultado encontrado                 │
│                                                     │
│    Tente ajustar os filtros ou buscar por          │
│    outro termo.                                    │
│                                                     │
│              [Limpar filtros]                      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 13.4 Error State

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│                    ⚠️                               │
│                                                     │
│           Algo deu errado                          │
│                                                     │
│    Não foi possível carregar os dados.             │
│    Tente novamente em alguns instantes.            │
│                                                     │
│              [Tentar novamente]                    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 13.5 Modal de Confirmação

```
┌─────────────────────────────────────────────────────┐
│ Excluir transação?                             [X]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Tem certeza que deseja excluir esta transação?     │
│                                                     │
│  iFood - R$ 45,00                                   │
│  29/03/2026 • Alimentação                           │
│                                                     │
│  Esta ação não pode ser desfeita.                   │
│                                                     │
│                       [Cancelar]  [Excluir]         │
│                          cinza       vermelho       │
└─────────────────────────────────────────────────────┘
```

### 13.6 Toast/Notificações

```
Sucesso (verde):
┌─────────────────────────────────────────────────────┐
│ ✅ Transação criada com sucesso                 [X] │
└─────────────────────────────────────────────────────┘

Erro (vermelho):
┌─────────────────────────────────────────────────────┐
│ ❌ Erro ao salvar transação. Tente novamente.   [X] │
└─────────────────────────────────────────────────────┘

Info (azul):
┌─────────────────────────────────────────────────────┐
│ ℹ️ WhatsApp conectado com sucesso               [X] │
└─────────────────────────────────────────────────────┘

Posição: Canto superior direito, stack de baixo para cima
Duração: 5 segundos, ou até fechar
```

---

## 14. Responsividade

### 14.1 Breakpoints

| Nome | Largura | Comportamento |
|------|---------|---------------|
| Mobile | < 768px | Sidebar vira menu hamburger, cards empilham |
| Tablet | 768px - 1024px | Sidebar colapsada (ícones), 2 colunas |
| Desktop | > 1024px | Layout completo |

### 14.2 Mobile - Dashboard

```
┌─────────────────────────────┐
│ [☰]  FinAssistant      [🔔] │
├─────────────────────────────┤
│                             │
│ ⚠️ Complete seu perfil  [▼] │
│                             │
├─────────────────────────────┤
│ [Hoje] [7d] [Mês✓] [Ano]   │
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ Saldo       R$ 1.250,00 │ │
│ └─────────────────────────┘ │
│ ┌───────────┐ ┌───────────┐ │
│ │ Receitas  │ │ Despesas  │ │
│ │ R$ 5.000  │ │ R$ 3.200  │ │
│ └───────────┘ └───────────┘ │
├─────────────────────────────┤
│ Transações                  │
│ [+Receita] [+Despesa]       │
│ ────────────────────────── │
│ Hoje                        │
│ ┌─────────────────────────┐ │
│ │ 🟠 iFood       -R$45,00 │ │
│ │ 🟢 Salário   +R$5.000   │ │
│ └─────────────────────────┘ │
│                             │
└─────────────────────────────┘

Menu Mobile (sidebar deslizante):
┌─────────────────────────────┐
│ [X]                         │
│                             │
│ [Avatar] João da Silva      │
│ joao@email.com              │
│                             │
│ ─────────────────────────── │
│                             │
│ 🏠 Dashboard                │
│ 💳 Transações               │
│ 🏦 Contas                   │
│ 🏷️ Categorias               │
│ 💳 Cartões                  │
│                             │
│ ─────────────────────────── │
│                             │
│ ⚙️ Configurações            │
│ 🚪 Sair                     │
│                             │
└─────────────────────────────┘
```

---

## 15. Interações e Animações

### 15.1 Transições

| Elemento | Propriedade | Duração | Easing |
|----------|-------------|---------|--------|
| Botões | background-color | 150ms | ease-in-out |
| Modais | opacity, transform | 200ms | ease-out |
| Cards hover | box-shadow | 150ms | ease-in-out |
| Sidebar mobile | transform | 300ms | ease-in-out |
| Toast | transform, opacity | 300ms | ease-out |
| Dropdown | opacity, transform | 150ms | ease-out |

### 15.2 Skeleton Loading

```
┌─────────────────────────────┐
│ ████████████                │  ← Título (animação pulse)
│                             │
│ ████████████████████        │  ← Texto
│ ██████████████              │
│                             │
│ ┌─────────┐ ┌─────────┐     │
│ │ ░░░░░░░ │ │ ░░░░░░░ │     │  ← Cards (shimmer)
│ │ ░░░░░░░ │ │ ░░░░░░░ │     │
│ └─────────┘ └─────────┘     │
└─────────────────────────────┘

Cor: #E5E7EB (Border)
Animação: shimmer gradient da esquerda para direita
```

---

## 16. Acessibilidade

### 16.1 Requisitos

- Contraste mínimo 4.5:1 para texto
- Todos os elementos interativos acessíveis via teclado
- Labels em todos os inputs
- Alt text em imagens
- Aria-labels em ícones sem texto
- Focus visible em todos os elementos interativos

### 16.2 Focus States

```
Botões e inputs com foco:
- Outline: 2px solid Primary (#16A34A)
- Offset: 2px
- Border-radius: igual ao elemento
```

---

## Anexo: Checklist de Telas

| # | Tela | Prioridade | Status |
|---|------|------------|--------|
| 1 | Login | P0 | [ ] |
| 2 | Cadastro | P0 | [ ] |
| 3 | Recuperar Senha | P1 | [ ] |
| 4 | Seleção de Plano | P0 | [ ] |
| 5 | Pagamento | P0 | [ ] |
| 6 | Dashboard | P0 | [ ] |
| 7 | Modal: Conectar WhatsApp | P0 | [ ] |
| 8 | Modal: Receitas Fixas | P1 | [ ] |
| 9 | Modal: Despesas Fixas | P1 | [ ] |
| 10 | Modal: Personalizar Categorias | P1 | [ ] |
| 11 | Lista de Transações | P0 | [ ] |
| 12 | Modal: Nova Transação | P0 | [ ] |
| 13 | Modal: Transferência | P1 | [ ] |
| 14 | Lista de Contas | P0 | [ ] |
| 15 | Modal: Nova Conta | P0 | [ ] |
| 16 | Modal: Ajustar Saldo | P1 | [ ] |
| 17 | Lista de Categorias | P0 | [ ] |
| 18 | Modal: Nova Categoria | P0 | [ ] |
| 19 | Lista de Cartões | P1 | [ ] |
| 20 | Modal: Novo Cartão | P1 | [ ] |
| 21 | Detalhes da Fatura | P1 | [ ] |
| 22 | Config: Perfil | P1 | [ ] |
| 23 | Config: Notificações | P2 | [ ] |
| 24 | Config: WhatsApp | P1 | [ ] |
| 25 | Config: Assinatura | P1 | [ ] |
| 26 | Config: Dados | P2 | [ ] |
| 27 | Estados: Loading | P0 | [ ] |
| 28 | Estados: Empty | P0 | [ ] |
| 29 | Estados: Error | P0 | [ ] |
| 30 | Modal: Confirmação | P0 | [ ] |
| 31 | Toast/Notificações | P0 | [ ] |
| 32 | Versão Mobile | P1 | [ ] |

---

*Documento gerado para uso no Stitch - FinAssistant Frontend Specs v1.0*
