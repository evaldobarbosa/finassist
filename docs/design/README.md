# Zapgrana - Design System

Este diretório contém toda a documentação de design do Zapgrana.

## Documentos

| Arquivo | Descrição |
|---------|-----------|
| [DESIGN-REFERENCE-REPORT.md](./DESIGN-REFERENCE-REPORT.md) | Relatório completo de referências de design, tendências 2026, paleta de cores, tipografia e componentes |
| [WIREFRAMES.md](./WIREFRAMES.md) | Wireframes da landing page e templates de páginas internas |
| [tailwind.zapgrana.config.js](./tailwind.zapgrana.config.js) | Configuração de tema Tailwind CSS pronta para uso |
| [zapgrana-theme.css](./zapgrana-theme.css) | Variáveis CSS para uso em qualquer projeto |

## Como Usar

### Tailwind CSS

```javascript
// tailwind.config.js
import zapgranaTheme from './docs/design/tailwind.zapgrana.config.js'

export default {
  theme: {
    extend: zapgranaTheme.theme.extend
  }
}
```

### CSS Puro

```css
@import url('./docs/design/zapgrana-theme.css');

.my-button {
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
}
```

## Paleta Resumida

### Cores Principais

| Nome | Hex | Uso |
|------|-----|-----|
| Primary | `#006b2c` | CTAs, links, elementos principais |
| Primary Light | `#7ffc97` | Destaques, badges de sucesso |
| Secondary | `#0058be` | Informações, elementos secundários |
| Danger | `#bb0112` | Alertas, erros, despesas |

### Cores Funcionais

| Contexto | Cor |
|----------|-----|
| Receitas | `#00873a` (verde) |
| Despesas | `#bb0112` (vermelho) |
| WhatsApp | `#25D366` |
| Parcelas | `#0058be` (azul) |

## Tipografia

- **Fonte**: Inter (Google Fonts)
- **Fallback**: ui-sans-serif, system-ui, sans-serif

## Imagens de Referência

### Doutor Equilíbrio

Arquivo: `../WhatsApp Image 2026-04-23 at 16.08.29.jpeg`

Uso: Hero da landing page, seção de parceria, avatares.

## Documentação Relacionada

- [BRANDING.md](../BRANDING.md) - Fundamentos de marca
- [MARKETING-BRIEF.md](../MARKETING-BRIEF.md) - Descrição para marketing
- [GRANAZEN-REFERENCIA.md](../mockups/referencia/GRANAZEN-REFERENCIA.md) - Análise do concorrente

---

*Última atualização: Maio 2026*
