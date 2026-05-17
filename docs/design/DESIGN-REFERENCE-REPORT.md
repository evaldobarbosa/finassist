# Zapgrana - Relatório de Referência de Design

Este documento consolida as melhores práticas de design para websites financeiros em 2026, baseado em análise de tendências atuais do mercado e referências de design.

---

## 1. Tendências de Design para Finance 2026

### 1.1 Princípios Fundamentais

Os websites financeiros de sucesso em 2026 seguem **5+1 tendências principais**:

| Tendência | Descrição | Aplicação no Zapgrana |
|-----------|-----------|----------------------|
| **Humanização** | Elementos que transmitem conexão humana | Foto do Doutor Equilíbrio, tom conversacional |
| **Transparência** | Clareza em preços, processos e dados | Cards com informações detalhadas |
| **Reassuramento** | Elementos que reduzem ansiedade financeira | Cores calmas, linguagem acolhedora |
| **Segurança** | Indicadores visuais de confiança | Badges, certificações, parceiros |
| **Interatividade** | Elementos que engajam o usuário | Simuladores, calculadoras |
| **Diferenciação** | Identidade única no mercado | Integração WhatsApp + IA |

### 1.2 O Que Evitar

- **Cores muito vibrantes** - podem gerar desconfiança
- **Excesso de animações** - distrai e parece amador
- **Estética neubrutalist** - não funciona para finanças
- **Linguagem técnica** - afasta o usuário comum
- **Layouts genéricos** - não se destaca da concorrência

---

## 2. Paleta de Cores Recomendada

### 2.1 Cores Primárias (Confiança e Crescimento)

| Nome | Hex | RGB | Uso |
|------|-----|-----|-----|
| **Primary Dark** | `#006b2c` | 0, 107, 44 | Elementos principais, CTAs primários |
| **Primary** | `#00873a` | 0, 135, 58 | Backgrounds de cards, elementos ativos |
| **Primary Light** | `#7ffc97` | 127, 252, 151 | Acentos, badges de sucesso, hovers |
| **Primary Soft** | `#e8f5e9` | 232, 245, 233 | Backgrounds sutis, estados hover |

### 2.2 Cores Secundárias (Informação e Alerta)

| Nome | Hex | RGB | Uso |
|------|-----|-----|-----|
| **Secondary** | `#0058be` | 0, 88, 190 | Links, informações, elementos secundários |
| **Secondary Light** | `#e3f2fd` | 227, 242, 253 | Backgrounds informativos |
| **Danger** | `#bb0112` | 187, 1, 18 | Alertas, erros, despesas |
| **Danger Light** | `#ffebee` | 255, 235, 238 | Backgrounds de alerta |
| **Warning** | `#f59e0b` | 245, 158, 11 | Avisos, atenção moderada |

### 2.3 Cores Neutras (Interface)

| Nome | Hex | RGB | Uso |
|------|-----|-----|-----|
| **Surface** | `#f9f9ff` | 249, 249, 255 | Background principal da aplicação |
| **Surface Low** | `#ffffff` | 255, 255, 255 | Cards, modais, elementos elevados |
| **Surface Medium** | `#f1f3ff` | 241, 243, 255 | Backgrounds secundários, divisores |
| **Surface High** | `#e1e8fd` | 225, 232, 253 | Elementos destacados, hovers |
| **Text Primary** | `#191c20` | 25, 28, 32 | Texto principal |
| **Text Secondary** | `#43474e` | 67, 71, 78 | Texto secundário, descrições |
| **Border** | `#73777f` | 115, 119, 127 | Bordas, separadores |
| **Border Light** | `#c3c6cf` | 195, 198, 207 | Bordas sutis, dividers |

### 2.4 Cores Funcionais Zapgrana

| Contexto | Cor | Hex |
|----------|-----|-----|
| **Receitas** | Verde Primary | `#00873a` |
| **Despesas** | Vermelho Danger | `#bb0112` |
| **Saldo Positivo** | Verde Light | `#7ffc97` |
| **Saldo Negativo** | Vermelho Danger | `#bb0112` |
| **WhatsApp** | Verde WhatsApp | `#25D366` |
| **Parcelas** | Azul Secondary | `#0058be` |

---

## 3. Tipografia

### 3.1 Sistema Tipográfico

| Categoria | Fonte | Peso | Tamanho |
|-----------|-------|------|---------|
| **Headlines (H1)** | Inter | 700 (Bold) | 48-64px |
| **Headlines (H2)** | Inter | 600 (SemiBold) | 36-48px |
| **Headlines (H3)** | Inter | 600 (SemiBold) | 24-32px |
| **Body Large** | Inter | 400 (Regular) | 18-20px |
| **Body** | Inter | 400 (Regular) | 16px |
| **Body Small** | Inter | 400 (Regular) | 14px |
| **Caption** | Inter | 500 (Medium) | 12px |
| **Button** | Inter | 500 (Medium) | 14-16px |

### 3.2 Hierarquia Visual

```
H1: Títulos de página, hero section
    └── H2: Seções principais
        └── H3: Subsecções, títulos de cards
            └── Body: Parágrafos, descrições
                └── Caption: Labels, metadados
```

---

## 4. Componentes de Interface

### 4.1 Hero Section

**Padrões de Sucesso:**
- Ocupar 60-100% da viewport no desktop
- No mobile, 50-70% para incentivar scroll
- **Um único CTA principal** - múltiplos botões causam fadiga de decisão
- Headline + Subheadline + CTA visíveis sem scroll

**Estrutura Recomendada:**
```
┌─────────────────────────────────────────────────┐
│  [Logo]                    [Nav] [CTA Header]   │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─────────────────┐    ┌──────────────────┐   │
│  │                 │    │                  │   │
│  │   HEADLINE      │    │   [Imagem do     │   │
│  │   Subheadline   │    │   Doutor         │   │
│  │                 │    │   Equilíbrio]    │   │
│  │   [CTA Button]  │    │                  │   │
│  │                 │    │                  │   │
│  │   Trust badges  │    │                  │   │
│  │                 │    │                  │   │
│  └─────────────────┘    └──────────────────┘   │
│                                                 │
└─────────────────────────────────────────────────┘
```

### 4.2 Cards Financeiros

**Estrutura:**
```
┌─────────────────────────────────┐
│  [Ícone]  Título do Card    [?] │
├─────────────────────────────────┤
│                                 │
│  R$ 2.500,00                    │
│  ▲ +12.5% em relação ao mês    │
│                                 │
│  ┌─────────┐  ┌─────────┐       │
│  │ Recebido│  │A receber│       │
│  │ R$ 2.0k │  │ R$ 500  │       │
│  └─────────┘  └─────────┘       │
│                                 │
└─────────────────────────────────┘
```

**Propriedades:**
- Border-radius: 12-16px
- Shadow: `0px 4px 12px rgba(0, 0, 0, 0.08)`
- Padding: 24px
- Hover: elevação sutil

### 4.3 Botões

| Variante | Background | Text | Border | Uso |
|----------|------------|------|--------|-----|
| **Primary** | `#006b2c` | `#ffffff` | none | CTAs principais |
| **Primary Outline** | transparent | `#006b2c` | `#006b2c` | CTAs secundários |
| **Secondary** | `#0058be` | `#ffffff` | none | Ações informativas |
| **Danger** | `#bb0112` | `#ffffff` | none | Ações destrutivas |
| **Ghost** | transparent | `#43474e` | none | Ações terciárias |

**Estados:**
- Hover: darken 10%
- Active: darken 15%
- Disabled: opacity 50%
- Focus: ring de 2px com cor primary-light

### 4.4 Inputs

```css
/* Base */
border: 1px solid #c3c6cf;
border-radius: 8px;
padding: 12px 16px;
font-size: 16px;

/* Focus */
border-color: #006b2c;
box-shadow: 0 0 0 3px rgba(0, 107, 44, 0.1);

/* Error */
border-color: #bb0112;
box-shadow: 0 0 0 3px rgba(187, 1, 18, 0.1);
```

---

## 5. Elementos de Confiança

### 5.1 Social Proof

Baseado em análise de sites financeiros de sucesso:

| Elemento | Posição | Formato |
|----------|---------|---------|
| **Avaliação** | Hero section | Estrelas + nota (4.9/5) |
| **Usuários** | Hero section | "+38 mil usuários" |
| **Parceiro** | Hero section | Logo/foto Doutor Equilíbrio |
| **Depoimentos** | Abaixo do hero | Cards com foto, nome, texto |
| **Logos** | Footer ou seção | Parceiros, certificações |

### 5.2 Indicadores de Segurança

```
┌─────────────────────────────────────────┐
│  🔒 Dados criptografados                │
│  ✓ Não temos acesso às suas senhas      │
│  ✓ Parceria com Doutor Equilíbrio       │
│  ✓ +38 mil usuários confiam             │
└─────────────────────────────────────────┘
```

---

## 6. Gradientes e Efeitos

### 6.1 Gradientes Recomendados

```css
/* Hero background - sutil */
background: linear-gradient(
  135deg,
  #f9f9ff 0%,
  #e8f5e9 50%,
  #f1f3ff 100%
);

/* Card highlight */
background: linear-gradient(
  180deg,
  #ffffff 0%,
  #f1f3ff 100%
);

/* CTA hover */
background: linear-gradient(
  135deg,
  #006b2c 0%,
  #00873a 100%
);
```

### 6.2 Sombras

```css
/* Card default */
--shadow-card: 0px 4px 12px rgba(0, 0, 0, 0.08);

/* Card hover */
--shadow-card-hover: 0px 8px 24px rgba(0, 0, 0, 0.12);

/* Modal/Dropdown */
--shadow-elevated: 0px 16px 48px rgba(20, 27, 43, 0.16);

/* Editorial (destaque) */
--shadow-editorial: 0px 24px 48px -12px rgba(20, 27, 43, 0.08);
```

---

## 7. Espaçamento

### 7.1 Sistema de Grid

```css
/* Container */
max-width: 1280px;
padding-inline: 24px; /* mobile: 16px */

/* Grid */
display: grid;
grid-template-columns: repeat(12, 1fr);
gap: 24px; /* mobile: 16px */
```

### 7.2 Escala de Espaçamento

| Token | Valor | Uso |
|-------|-------|-----|
| `space-1` | 4px | Gaps mínimos |
| `space-2` | 8px | Entre elementos relacionados |
| `space-3` | 12px | Padding interno pequeno |
| `space-4` | 16px | Padding padrão |
| `space-5` | 20px | Gaps médios |
| `space-6` | 24px | Padding de cards |
| `space-8` | 32px | Entre seções |
| `space-10` | 40px | Entre grupos |
| `space-12` | 48px | Entre seções grandes |
| `space-16` | 64px | Margin de seções |
| `space-20` | 80px | Hero padding |
| `space-24` | 96px | Separação de seções principais |

---

## 8. Responsividade

### 8.1 Breakpoints

| Nome | Largura | Uso |
|------|---------|-----|
| `sm` | 640px | Telefones landscape |
| `md` | 768px | Tablets portrait |
| `lg` | 1024px | Tablets landscape, laptops pequenos |
| `xl` | 1280px | Desktop padrão |
| `2xl` | 1536px | Desktop grande |

### 8.2 Adaptações Mobile

- Hero: reduzir para 50-70% da viewport
- Cards: stack vertical
- Navigation: menu hamburguer
- CTAs: full-width
- Tipografia: reduzir 1 nível

---

## 9. Iconografia

### 9.1 Estilo

- **Biblioteca**: Lucide Icons ou Heroicons
- **Stroke width**: 1.5-2px
- **Tamanhos**: 16px, 20px, 24px, 32px
- **Cor**: inherit (do texto pai)

### 9.2 Ícones Essenciais

| Contexto | Ícone |
|----------|-------|
| WhatsApp | MessageCircle (customizado verde) |
| Receita | TrendingUp, ArrowUp, Plus |
| Despesa | TrendingDown, ArrowDown, Minus |
| Conta | Wallet, CreditCard, Building2 |
| Categoria | Tag, Folder |
| Configurações | Settings, Cog |
| Usuário | User, UserCircle |
| Áudio | Mic, Volume2 |
| Foto | Camera, Image |
| Dashboard | LayoutDashboard, Home |
| Gráficos | BarChart3, PieChart |

---

## 10. Animações e Micro-interações

### 10.1 Transições Padrão

```css
/* Default */
transition: all 0.2s ease-in-out;

/* Botões */
transition: background-color 0.15s ease, transform 0.1s ease;

/* Cards */
transition: box-shadow 0.2s ease, transform 0.2s ease;

/* Modais */
transition: opacity 0.2s ease, transform 0.2s ease;
```

### 10.2 Micro-interações

| Elemento | Interação | Efeito |
|----------|-----------|--------|
| Botão | Hover | Scale 1.02, shadow |
| Card | Hover | Elevação sutil, translateY -2px |
| Link | Hover | Underline, cor mais escura |
| Input | Focus | Border color, ring |
| Toggle | Click | Slide suave |
| Modal | Open | Fade + slide up |

---

## 11. Referências de Design

### 11.1 Sites de Finanças Exemplares

| Site | Destaque | Lição |
|------|----------|-------|
| **SoFi** | Hero dinâmico, cores calmas | Verdes e azuis transmitem confiança |
| **Qonto** | Produto no hero, dados reais | Mostrar o app em ação |
| **Ramify** | Comparativos claros, dados | Transparência gera confiança |

### 11.2 Padrões do GranaZen (Concorrente)

| Padrão | Aplicação |
|--------|-----------|
| Cards expansíveis | Detalhes sob demanda |
| Filtros por período | Mantidos entre telas |
| Botão WhatsApp flutuante | Acesso rápido |
| Onboarding guiado | 9 etapas com sidebar |
| Tabelas ordenáveis | UX de dados |

---

## Fontes

- [Digidop - Design Trends for Finance 2026](https://www.digidop.com/blog/2026-design-trends-for-finance-websites)
- [Lounge Lizard - Top 10 Financial Website Designs](https://www.loungelizard.com/blog/top-10-best-financial-services-website-designs/)
- [Figma - Web Design Trends 2026](https://www.figma.com/resource-library/web-design-trends/)
- [Perfect Afternoon - Hero Section Design](https://www.perfectafternoon.com/2025/hero-section-design/)
- [Lounge Lizard - Web Design Color Trends 2026](https://www.loungelizard.com/blog/web-design-color-trends/)

---

*Documento criado em Maio 2026 como guia de design para o Zapgrana.*
