# MCC - Merchant Category Codes

## O que é MCC?

MCC (Merchant Category Code) é um código de 4 dígitos usado pelas bandeiras de cartão (Visa, Mastercard, etc.) para classificar estabelecimentos comerciais pelo tipo de produto ou serviço que oferecem.

## MCC vs Categorias Pessoais

| Aspecto | MCC | Categorias FinAssistant |
|---------|-----|-------------------------|
| **Propósito** | Classificar estabelecimentos | Organizar orçamento pessoal |
| **Quantidade** | ~400+ códigos | 18 categorias base |
| **Granularidade** | Alta (5411 ≠ 5412) | Baixa (ambos = Alimentação) |
| **Público-alvo** | PJ / Empresas | PF / Pessoas físicas |
| **Uso principal** | Taxas de intercâmbio, compliance, políticas corporativas | Controle de gastos, metas de orçamento |

## Por que MCC faz mais sentido para PJ?

### Empresas (PJ)
- **Políticas de reembolso**: Distinguir restaurante (5812) de bar (5813) para aprovar ou não despesa
- **Dedução fiscal**: Categorização correta para contabilidade
- **Controle de gastos corporativos**: Limites por tipo de estabelecimento
- **Compliance**: Auditoria e relatórios regulatórios

### Pessoas Físicas (PF)
- **Orçamento simplificado**: "Gastei R$ 500 em Alimentação" é mais útil que "R$ 200 em 5812, R$ 150 em 5411, R$ 150 em 5814"
- **Metas por categoria**: Definir limite de R$ 1.000/mês em Lazer
- **Visualização clara**: Gráficos com 10-15 categorias, não 50+

## Uso do MCC no FinAssistant

### Estratégia Atual
Usamos categorias simplificadas alinhadas com orçamento pessoal:

**Despesas (12):**
- Alimentação, Transporte, Moradia, Saúde, Educação, Lazer
- Vestuário, Serviços, Impostos, Pets, Assinaturas, Outros

**Receitas (6):**
- Salário, Freelance, Investimentos, Vendas, Reembolso, Outros

### Uso Futuro do MCC (Opcional)

O MCC pode ser útil para **auto-categorização** quando transações vierem de integrações com cartões:

```
Transação do cartão com MCC 5411 (Supermercado)
    ↓
Mapeamento automático
    ↓
Categoria: Alimentação
```

## Tabela de Mapeamento (Referência Futura)

### Alimentação
| MCC | Descrição |
|-----|-----------|
| 5411 | Supermercados |
| 5412 | Mercearias |
| 5441 | Docerias e confeitarias |
| 5451 | Laticínios |
| 5462 | Padarias |
| 5499 | Lojas de alimentos diversos |
| 5812 | Restaurantes |
| 5813 | Bares e casas noturnas |
| 5814 | Fast food |

### Transporte
| MCC | Descrição |
|-----|-----------|
| 4111 | Transporte local/suburbano |
| 4121 | Táxis e limusines |
| 4131 | Linhas de ônibus |
| 4784 | Pedágios |
| 5541 | Postos de gasolina |
| 5542 | Postos com automação |
| 7523 | Estacionamentos |
| 7512 | Aluguel de carros |

### Moradia
| MCC | Descrição |
|-----|-----------|
| 4900 | Serviços públicos (luz, água, gás) |
| 5200 | Lojas de materiais de construção |
| 5211 | Madeireiras |
| 5251 | Lojas de ferragens |
| 5712 | Móveis e decoração |
| 5719 | Acessórios para casa |
| 7349 | Serviços de limpeza |

### Saúde
| MCC | Descrição |
|-----|-----------|
| 5122 | Farmácias |
| 5912 | Drogarias |
| 8011 | Médicos |
| 8021 | Dentistas |
| 8031 | Osteopatas |
| 8041 | Quiropráticos |
| 8042 | Optometristas |
| 8049 | Outros profissionais de saúde |
| 8062 | Hospitais |
| 8071 | Laboratórios |

### Educação
| MCC | Descrição |
|-----|-----------|
| 8211 | Escolas |
| 8220 | Faculdades e universidades |
| 8241 | Escolas por correspondência |
| 8244 | Escolas de negócios |
| 8249 | Escolas técnicas |
| 8299 | Outros serviços educacionais |
| 5942 | Livrarias |
| 5943 | Papelarias |

### Lazer
| MCC | Descrição |
|-----|-----------|
| 7832 | Cinemas |
| 7841 | Locadoras de vídeo |
| 7911 | Salões de dança |
| 7922 | Ingressos de teatro |
| 7929 | Bandas e orquestras |
| 7932 | Bilhar e sinuca |
| 7933 | Boliche |
| 7941 | Clubes esportivos |
| 7991 | Atrações turísticas |
| 7992 | Campos de golfe |
| 7993 | Fliperamas |
| 7996 | Parques de diversão |
| 7997 | Clubes e associações |
| 7998 | Aquários e zoológicos |
| 7999 | Recreação diversa |

### Vestuário
| MCC | Descrição |
|-----|-----------|
| 5611 | Roupas masculinas |
| 5621 | Roupas femininas |
| 5631 | Acessórios femininos |
| 5641 | Roupas infantis |
| 5651 | Lojas de família |
| 5661 | Calçados |
| 5681 | Peles |
| 5691 | Roupas diversas |
| 5699 | Acessórios diversos |

### Serviços
| MCC | Descrição |
|-----|-----------|
| 7210 | Lavanderias |
| 7211 | Tinturarias |
| 7216 | Lavanderias self-service |
| 7221 | Estúdios fotográficos |
| 7230 | Salões de beleza |
| 7251 | Sapatarias |
| 7261 | Funerárias |
| 7296 | Aluguel de roupas |
| 7297 | Massagem |
| 7298 | Spas |
| 7299 | Serviços diversos |

### Assinaturas
| MCC | Descrição |
|-----|-----------|
| 4814 | Telecomunicações |
| 4816 | Redes de computadores |
| 4899 | TV a cabo e outros |
| 5815 | Mídia digital (livros, música, vídeo) |
| 5816 | Jogos digitais |
| 5817 | Aplicativos digitais |
| 5818 | Bens digitais grandes |

### Pets
| MCC | Descrição |
|-----|-----------|
| 5995 | Pet shops |
| 0742 | Serviços veterinários |

## Implementação Futura

### Fase 1: Mapeamento Básico
- Criar tabela `mcc_mappings` com MCC → category_id
- Popular com mapeamentos mais comuns

### Fase 2: Auto-categorização
- Quando transação vier com MCC (integração bancária)
- Buscar mapeamento e sugerir categoria
- Usuário pode confirmar ou alterar

### Fase 3: Aprendizado
- Armazenar preferências do usuário
- Se usuário sempre muda MCC 5813 para "Lazer", aprender

## Referências

- [ISO 18245](https://www.iso.org/standard/33365.html) - Retail financial services MCC
- [Visa Merchant Category Codes](https://usa.visa.com/content/dam/VCOM/download/merchants/visa-merchant-data-standards-manual.pdf)
- [Mastercard MCC Guide](https://www.mastercard.us/content/dam/mccom/global/documents/mastercard-rules.pdf)
