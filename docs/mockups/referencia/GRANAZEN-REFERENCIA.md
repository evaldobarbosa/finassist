# GranaZen - Análise de Referência

> Documentação baseada nas capturas de tela do GranaZen para servir como referência no desenvolvimento do FinAssistant.

## Visão Geral

**Proposta:** Gestão financeira simplificada com WhatsApp e Inteligência Artificial.

**Diferenciais:**
- Integração nativa com WhatsApp para registro de transações
- IA para processamento de mensagens (texto, áudio, foto, PDF)
- +38 mil usuários
- Suporte multi-idioma (PT-BR, PT-PT, EN, ES)
- Suporte multi-moeda (10 moedas)

---

## Estrutura de Telas

### 1. Landing Page

**Arquivo:** `01-home.png`, `01-home-full.png`

**Seções:**
- Hero com destaque para integração WhatsApp + IA
- Funcionalidades
- Como funciona
- Planos e preços
- FAQ
- CTA: "Experimente GranaZen — 3 dias grátis!"

**Elementos de UI:**
- Header com navegação (Funcionalidades, Como funciona, Planos, FAQ)
- Botão "Acessar conta"
- Seletor de idioma (PT)
- Social proof: avaliação 5 estrelas + contador de usuários
- Preview do app em dispositivos móveis
- Banner de cookies

---

### 2. Autenticação

#### 2.1 Login
**Arquivo:** `06-login.png`

**Campos:**
- Toggle: Entrar por telefone / Entrar por e-mail
- Input telefone com seletor de país (+55)
- Botão "Entrar"
- Link: "Não tem uma conta? Cadastre-se"

**Layout:** Split screen (formulário à esquerda, área verde à direita)

#### 2.2 Cadastro
**Arquivo:** `07-cadastro.png`

**Etapas (stepper):**
1. Dados Pessoais
2. Plano
3. Pagamento

**Campos (etapa 1):**
- Nome completo
- WhatsApp (com seletor de país)
- E-mail
- Confirmar e-mail
- Checkbox: aceitar termos

---

### 3. Onboarding

**Arquivos:** `09-onboarding-inicio.png` até `27-dashboard.png`

**Sidebar de progresso (9 etapas):**
1. Idioma - Escolha seu idioma
2. Tipo de uso - Como você vai usar
3. Moeda - Selecione sua moeda
4. Contas - Configure suas contas
5. Categorias - Organize seus gastos
6. Despesas - Adicione gastos fixos
7. Receitas - Adicione suas receitas
8. Lembretes - Configure alertas
9. WhatsApp - Conecte seu número

#### Etapa 1: Idioma
**Arquivo:** `10-onboarding-step1.png`, `16-step1-idioma.png`

**Opções:**
- Português (Brasil) ✓
- Português (Portugal)
- English
- Español

**Botões:** Voltar | Continuar

#### Etapa 2: Tipo de Uso
**Arquivo:** `11-onboarding-step2.png`, `13-step2-tipo-uso.png`, `17-step2-tipo-uso.png`, `18-step2-tipo-uso.png`

**Opções:**
- **Uso pessoal** - Para organizar minhas finanças pessoais do dia a dia
- **Casal** - Para organizar as finanças em conjunto com meu parceiro(a)
- **Empresarial** - Para gerenciar as finanças do meu negócio ou empresa
- **Pessoal e Empresarial** - Para gerenciar tanto finanças pessoais quanto do negócio

**Campo condicional (se Empresarial ou Pessoal+Empresarial):**
- Segmento do seu negócio (dropdown)
- Exemplo: "Educação e Cursos"

#### Etapa 3: Moeda
**Arquivo:** `20-step3-moeda.png`

**Opções (grid 2x5):**
| Moeda | Código |
|-------|--------|
| Real Brasileiro | R$ (BRL) |
| Dólar Americano | $ (USD) ✓ |
| Euro | € (EUR) |
| Libra Esterlina | £ (GBP) |
| Peso Argentino | $ (ARS) |
| Peso Chileno | $ (CLP) |
| Peso Colombiano | $ (COP) |
| Peso Mexicano | $ (MXN) |
| Sol Peruano | S/ (PEN) |
| Guaraní Paraguayo | ₲ (PYG) |

#### Etapa 4: Contas
**Arquivo:** `21-step4-contas.png`

**Campos por conta:**
- Nome da conta (ex: "carteira")
- Saldo atual (ex: "Ex: 1000,00")

**Ações:**
- "+ Adicionar outra conta bancária"
- "Pular" (link)

**Info:** Cartão de crédito? Você pode pular esta etapa e adicionar seus gastos fixos depois pelo painel.

#### Etapa 5: Categorias
**Arquivo:** `22-step5-categorias.png`

**Categorias pré-definidas (com cores):**
- 🟠 Alimentação
- 🟡 Vestuário
- 🟣 Assinatura
- 🟢 Salário
- 🟣 Viagem

**Ações:**
- Campo "Adicionar nova categoria" + botão "Adicionar"
- Botão lixeira para remover categoria

#### Etapa 6: Despesas Fixas
**Arquivo:** `23-step6-despesas.png`

**Campos:**
- Descrição (ex: "Aluguel, Internet, Academia")
- Categoria (dropdown)
- Valor (R$ 0,00)
- Data de vencimento (date picker)
- Conta bancária (dropdown)
- Toggle: "Já foi pago?"

**Ações:**
- "+ Adicionar outro gasto fixo"
- "Pular" (link)

#### Etapa 7: Receitas Fixas
**Arquivo:** `24-step7-receitas.png`

**Campos:** (mesma estrutura das despesas)
- Descrição (ex: "Salário, Freelance, Aluguel")
- Categoria (dropdown)
- Valor (R$ 0,00)
- Data do vencimento (date picker)
- Conta bancária (dropdown)
- Toggle: "Já recebeu?"

**Ações:**
- "+ Adicionar outra receita fixa"
- "Pular" (link)

#### Etapa 8: Lembretes
**Arquivo:** `25-step8-lembretes.png`

**Seção "Funciona no automático":**
> Não se preocupe em lembrar de cada conta. Assim que você cadastrar uma conta a pagar ou a receber, nós vamos te avisar automaticamente quando o vencimento estiver chegando. Você só precisa escolher como quer ser lembrado!

**Configurações:**
- Toggle: Ativar lembretes automáticos (para todas as contas pendentes)
- Como deseja receber:
  - Toggle: WhatsApp
  - Toggle: E-mail
- Quando lembrar? (dropdown): "No dia do vencimento"

#### Etapa 9: WhatsApp
**Arquivo:** `26-step9-whatsapp.png`

**Título:** Integração com WhatsApp

**Descrição:** Registre seus gastos e receitas de forma rápida direto pelo WhatsApp, sem precisar abrir a plataforma!

**Envie de várias formas:**
| Tipo | Exemplo |
|------|---------|
| Texto | "Gastei 50 no mercado" |
| Áudio | Grave um áudio falando o gasto |
| Foto | Tire foto do cupom ou nota |
| PDF | Envie boletos e notas fiscais |

**Card destaque:**
> **Simples e rápido**
> Nossa IA entende suas mensagens e registra automaticamente. Você só precisa enviar!

**Botão:** Finalizar

#### Tela Final: Tudo Pronto
**Arquivo:** `12-onboarding-final.png`

**Resumo da configuração:**
- Tipo de uso: Pessoal e Empresarial
- Categorias criadas: 16
- Gastos fixos cadastrados: 0
- Receitas fixas cadastradas: 0

**Feedback:** "Como foi sua experiência?" (5 emojis de triste a coração)

**Cloudflare:** Verificação de segurança

**Botão:** "Ir para o Painel"

---

### 4. Dashboard Principal

**Arquivo:** `screencapture-granazen-painel-2026-03-27-22_51_52.png`

#### Header/Navegação
**Menu principal:**
- 🏠 Planeje sua grana
- 📊 Relatórios
- 🏷️ Categorias
- 🏦 Contas bancárias
- 💳 Cartão de crédito
- 📈 Limites de gastos
- ⚙️ Configurações
- 👥 Comunidade

**User menu:** Avatar + Nome + Plano (Zen)

#### Filtros de Período
- Hoje
- 7 dias atrás
- **Esse mês** (ativo)
- Esse ano
- Range customizado (calendário)
- Botões: Limpar filtro | Atualizar

#### Cards de Resumo (4 cards)

**Card 1: Saldo do Período Anterior**
- Valor: US$ 0,00
- Subtítulo: Até 28 De Fevereiro
- Info: (Receita - Despesa + Saldo bancário)
- Expandir: Ocultar detalhes
- Sub-items:
  - 🔴 Pendências: US$ 0,00
  - 🟢 Disponível: US$ 0,00

**Card 2: Receitas**
- Valor: US$ 0,00 (com ícone de olho para ocultar)
- Período: 1 De Março - 31 De Março
- Expandir: Ocultar detalhes
- Sub-items:
  - ✅ Recebido: US$ 0,00
  - ⏳ A receber: US$ 0,00

**Card 3: Despesas**
- Valor: US$ 0,00 (vermelho, com ícone de olho)
- Período: 1 De Março - 31 De Março
- Expandir: Ocultar detalhes
- Sub-items:
  - ✅ Pago: US$ 0,00
  - ⏳ A pagar: US$ 0,00

**Card 4: Saldo Disponível / Saldo Previsto**
- Saldo Disponível: US$ 0,00
- Subtítulo: Até 31 De Março
- Info: (Receita - Despesa + Saldo bancário)
- Saldo Previsto: US$ 0,00 (com ícone info)
- Subtítulo: Até 31 De Março
- Info: (Receita - Despesa + Saldo bancário)

#### Seção de Transações

**Header:**
- Navegação mês: < Março >
- Botões: "+ Receita" (verde) | "+ Despesa" (vermelho)

**Tabs:**
- Todas
- Receitas
- Despesas

**Filtros:**
- Sem agrupamento (dropdown)
- Campo de busca: "Pesquisar por descrição ou valor..."
- Ordenação: "Data de Vencimento"
- Botões: Ordenar | Filtrar

**Lista vazia:**
> 📋 Nenhuma transação encontrada
> Não há transações para exibir no período selecionado.

**Paginação:**
- Mostrar: 30 (dropdown)
- Total: 0
- Botões: Voltar | Próximo

#### Seção de Gráficos (lateral direita)

**Tabs:**
- Todas
- Receitas
- **Despesas** (ativo)
- Despesas Não Pagas
- Despesas Pagas
- Receitas...

**Título:** Todas as Despesas
**Período:** 1 De Março - 31 De Março

**Estado vazio:**
> 📊 Não há dados suficientes para mostrar este gráfico.

**Seção Detalhes:**
> Nenhum detalhe disponível.

**Botão flutuante:** WhatsApp (verde)

---

### 5. Relatórios

**Arquivo:** `screencapture-granazen-painel-lembretes-2026-03-27-22_52_57.png`

**Breadcrumb:** Granazen > Relatórios

**Tabs:**
- **Gráficos** (ativo)
- Lançamentos pendentes
- Fluxo de caixa

**Filtros:** (mesmo do dashboard)

#### Gráficos de Análise
**Ação:** "Gerenciar Gráficos"
**Instrução:** Arraste os gráficos para reordená-los

**Card 1: Despesas por Categoria**
- Período: 1 De Março - 31 De Março
- Estado vazio com ícone de gráfico

**Card 2: Receitas por Categoria**
- Período: 1 De Março - 31 De Março
- Estado vazio com ícone de gráfico

**Card 3: Gráficos de frequência Receitas X Despesas**
- Descrição: Visualize a frequência de receitas e despesas ao longo do tempo
- Controles: Coluna (dropdown) | Diário (dropdown)
- Gráfico de linhas com eixo X (datas do mês) e legenda (Receitas verde, Despesas vermelho)

---

### 6. Categorias

**Arquivo:** `screencapture-granazen-painel-minhas-categorias-2026-03-27-22_53_12.png`, `screencapture-granazen-painel-minhas-categorias-2026-03-27-22_53_31.png`

**Título:** 🏷️ Categoria

**Ações header:**
- Botão: "+ Adicionar categoria"
- Botão: "📁 Arquivadas"

**Filtros:**
- Campo de busca: "Pesquisar categorias..."
- Toggle: Com limite de gasto
- Toggle: Com subcategoria
- Info: "Valor total do limite de gastos: R$ 0,00"
- Botão: "📊 Relatório limite de gasto"

**Tabela:**
| Coluna | Descrição |
|--------|-----------|
| Categoria ↕ | Nome com cor (bolinha colorida) |
| Limite de gasto ↕ | Valor ou "-" |
| Ações | Ícones: 😊 Editar ✏️ Duplicar + Lixeira 🗑️ |

**Categorias listadas:**
- 🟠 Alimentação
- 🟣 Assinatura
- 🔴 Casa
- 🟣 Cuidados pessoais
- 🟢 Doações
- 🔵 Educação
- 🔵 Impostos
- 🔴 Lazer e Entretenimento
- 🟢 Mercado
- 🔵 Outros
- 🟠 Pets
- 🟢 Salário
- 🟡 Saúde
- 🔵 Transporte
- 🟠 Vestuário
- 🟣 Viagem

#### Modal: Adicionar Categoria

**Campos:**
- Nome da Categoria (input)
- Cor da Categoria (paleta de cores + input hex: #33FF33)
- Toggle: Definir limite de gasto
- Palavras para identificar a categoria (input + botão "Adicionar")
  - Placeholder: "Adicionar descrição"

**Botões:** Cancelar | Salvar Categoria

---

### 7. Contas Bancárias

**Arquivo:** `screencapture-granazen-painel-accounts-2026-03-27-22_54_25.png`

**Título:** Contas bancárias

**Descrição:** Organize suas finanças criando múltiplas contas! Você pode adicionar contas bancárias (como Bradesco, Nubank, Itaú)

**Ação:** "+ Adicionar conta"

**Tabs:**
- **Ativas** (ativo)
- Arquivadas

#### Card de Conta: Carteira

**Info principal:**
- 📈 Saldo atual
- **US$ 0,00** (verde)
- Ícone de atualizar

**Badge:** "👤 Conta padrão - Ao lançar via WhatsApp sem informar uma conta, será utilizada essa conta."

**Ações (grid 2x3):**
| Ação | Ícone |
|------|-------|
| Extrato | 📋 |
| Ajustar saldo | 💰 |
| Transferir | ↔️ |
| Importar OFX | ⬆️ |
| Editar | ✏️ |
| Arquivar | 📁 |

---

### 8. Filtros por Categoria/Conta

**Arquivo:** `screencapture-granazen-painel-filtros-2026-03-27-22_53_55.png`, `screencapture-granazen-painel-filtros-2026-03-27-22_54_38.png`

**Funcionalidade:** Filtrar transações por categoria ou conta específica

**Badge de filtro ativo:** Ex: "🟠 Alimentação ✕" ou "Carteira ✕"

**Botão:** "← Voltar"

---

### 9. Cartão de Crédito

**Arquivo:** `screencapture-granazen-painel-cartao-credito-2026-03-27-22_55_09.png`

**Título:** Cartões de Crédito

**Ações header:**
- Botão: "💳 Despesa Cartão" (verde)
- Botão: "📈 Receita" (verde)
- Botão: "+ Novo Cartão"

**Tabs:**
- **Meus cartões** (ativo)
- Arquivados

#### Modal: Novo Cartão

**Campos:**
| Campo | Tipo | Exemplo |
|-------|------|---------|
| Descrição | Input | "Meu cartão" |
| Limite Disponível | Input monetário | US$ 0,00 |
| Bandeira | Dropdown | Visa |
| Data de Fechamento | Input numérico | 1 |
| Data de Vencimento | Input numérico | 1 |
| Conta | Dropdown | carteira |
| Pessoa | Dropdown | "Escolha uma pessoa" |

**Botão:** Salvar

---

### 10. Limites de Gastos

**Arquivo:** `screencapture-granazen-painel-limites-de-gastos-2026-03-27-22_55_26.png`

**Título:** Limites de gastos

**Descrição:** Acompanhe no geral ou por categoria

**Tabs:**
- Geral
- **Por categoria** (ativo)

**Navegação:** < Março 2026 >

**Resumo:**
- **Gastos Por Categoria**
- US$ 0,00 de US$ 0,00
- Barra de progresso (vazia)

**Legenda:** 🟢 Hoje | Sem limite

**Tabela:**
| Coluna | Descrição |
|--------|-----------|
| Progresso Do Limite Total | Barra de progresso por categoria |
| Categoria | Nome com cor |
| Valor | US$ 0,00 de US$ 0,00 |
| Ação | "Ver transações →" | + |

---

### 11. Configurações

**Arquivos:** `screencapture-granazen-painel-configuracoes-*`

**Tabs de configuração:**
- 👤 Meu perfil
- 👥 Gestão compartilhada
- ⚙️ Preferência
- 🔔 Notificações
- 🎨 Aparência
- 📁 Dados
- 📋 Planos

#### 11.1 Meu Perfil
**Arquivo:** `screencapture-granazen-painel-configuracoes-2026-03-27-22_55_43.png`

**Campos:**
- Avatar (círculo com iniciais "NA")
- Botão: "Adicionar Foto"
- Nome (input)
- E-mail (readonly) - "Para alterar, entre em contato com o suporte."
- Telefone (readonly) - "Para alterar, entre em contato com o suporte."

**Botão:** "Salvar Alterações"

#### 11.2 Gestão Compartilhada
**Arquivo:** `screencapture-granazen-painel-configuracoes-2026-03-27-22_55_58.png`

**Descrição:** Compartilhe o acesso à sua conta com outras pessoas. Você pode adicionar até 1 usuários.

**Info:** 👥 0/1 pessoas

**Botão:** "👥 Adicionar pessoa"

**Card upsell:**
> Por apenas **R$ 15,92** ao mês!
> Adicione mais usuários à sua conta e maximize sua gestão financeira.
> **Botão:** Contratar agora

#### 11.3 Preferência
**Arquivo:** `screencapture-granazen-painel-configuracoes-2026-03-27-22_56_15.png`

**Descrição:** Escolha o tipo de moeda para visualizar valores.

**Campos:**
- Idioma (dropdown): Português (Brasil)
- Tipo de moeda (dropdown): US Dollar (USD)

**Botão:** Salvar

#### 11.4 Notificações
**Arquivo:** `screencapture-granazen-painel-configuracoes-2026-03-27-22_56_27.png`

**Título:** Configuração de Notificação

**Descrição:** Configure suas preferências de notificação para contas a pagar e receber

**Campos:**
- Toggle: Habilitar Notificações ✓
- Toggle: Notificações via WhatsApp ✓
- Toggle: Notificações via E-mail ✓
- Quando Lembrar (dropdown): "No dia do vencimento"

**Botão:** "Salvar Configurações"

#### 11.5 Dados
**Arquivo:** `screencapture-granazen-painel-configuracoes-2026-03-27-22_56_43.png`

**Cards (3 colunas):**

**Card 1: Exportar lançamentos**
- Descrição: Se você deseja exportar todos os seus lançamentos financeiros, utilize o botão abaixo.
- Botão: "⬇️ Exportar" (verde)

**Card 2: Excluir todos os lançamentos** (texto laranja)
- Descrição: Se você deseja começar do zero, excluindo todos os lançamentos financeiros, utilize o botão abaixo.
- Botão: "🗑️ Excluir todos os lançamentos" (vermelho)

**Card 3: Excluir minha conta** (texto vermelho)
- Descrição: Você pode solicitar a exclusão permanente de todos os seus dados pessoais a qualquer momento.
- Botão: "👤 Excluir minha conta" (vermelho)

#### 11.6 Planos
**Arquivo:** `screencapture-granazen-painel-configuracoes-2026-03-27-22_56_55.png`

**Status da assinatura:**
- Badge: "Em teste"
- Info: Seu período de testes está ativo!
- Período: 28 de março de 2026 - 31 de março de 2026
- Aviso: Caso não seja cancelado antes do fim de teste, a cobrança será efetuada automaticamente
- Link: "Gerenciar minhas assinaturas"

**Comparativo de Planos:**

| Recurso | Premium (R$ 19,90/mês) | Zen (R$ 27,92/mês) |
|---------|------------------------|---------------------|
| Trial | 3 dias grátis | 3 dias grátis |
| Sistema web com gráficos interativos | ✓ | ✓ |
| Lançamentos por texto | ✓ | ✓ |
| Controle de gastos via WhatsApp por texto | ✓ | ✓ |
| Transações ilimitadas de gastos no sistema | ✓ | ✓ |
| Criação de categorias e subcategorias | ✓ | ✓ |
| Sistema de referência | ✓ | ✓ |
| Lembretes por WhatsApp de contas a pagar | ✓ | ✓ |
| Lançamentos através do WhatsApp | ✓ | ✓ |
| Até 3 Contas bancárias | ✓ | ✓ |
| Relatório mensal financeiro mensal em PDF | ✓ | ✓ |
| Limite de gastos por categoria | ✓ | ✓ |
| Metas de gastos | ✓ | ✓ |
| Exportação de dados | ✓ | ✓ |
| Suporte por ligação | - | ✓ |
| Contas bancárias ilimitadas | - | ✓ |
| Lançamentos por áudio, foto e PDF | - | ✓ |
| Relatório anual financeiro em PDF | - | ✓ |
| Nova IA para extração de notas fiscais | - | ✓ |

**Nota Zen:** Você pode até 1 Usuários e mais sem custo

**Botões:** Assinar (para cada plano)

---

### 12. Comunidade

**Arquivo:** `screencapture-granazen-painel-comunidade-2026-03-27-22_57_16.png`

**Header:** 🟢 GranaZen

**Tabs:**
- 💡 Sugestões/melhorias (dropdown)
- 📋 Registro de Alterações
- ❓ Central de Ajuda

**Sidebar direita - Quadros:**
- Ver todas as postagens
- Sugestões/melhorias

**Call to action:**
> **Tem sugestões de melhorias?**
> Nos conte o que podemos fazer para tornar o GranaZen melhor.

**Filtros:**
- 🆕 Novo
- 🔝 Top
- 📈 Em tendência
- 🔍 Pesquisar
- ➕ Adicionar sugestão

**Filtro ativo:** Quadro: Sugestões/melhorias ✕

**Info:** Desenvolvido por Featurebase

#### Sugestões Populares

| Sugestão | Votos | Comentários | Status |
|----------|-------|-------------|--------|
| **Conectar com Open Finance** - Olá Permitir recurso da ferramenta conectar com Open Finance nas contas bancárias relacionando para um cartão/conta | 19 | - | - |
| **Informar a fatura** - Esse campo de "Fatura" poderia trazer a próxima fatura como padrão, acredito que pode agilizar os lançamentos. | 12 | 1 | Resolvido |
| **Aba Investimentos** - Criar uma aba só para investimentos e assim podemos controlar e ver quantos temos investido e não como saldo disponível | 10 | 2 | - |
| **Aprimorar a visualização do sistema pelo celular** - A responsividade não está totalmente adequada, e algumas funcionalidades apresentam instabilidades quando acessadas pelo celular. | 6 | - | - |

---

## Padrões de UI/UX Identificados

### Cores
- **Primária:** Verde (#22C55E ou similar)
- **Secundária:** Verde escuro (#16A34A)
- **Receitas:** Verde
- **Despesas:** Vermelho
- **Neutro:** Cinza
- **Background:** Branco/Cinza claro

### Componentes Recorrentes

1. **Cards de resumo** - Com valores, subtítulos, detalhes expansíveis
2. **Toggles** - Para ativar/desativar funcionalidades
3. **Dropdowns** - Para seleções
4. **Modais** - Para formulários de criação/edição
5. **Tabs** - Para navegação secundária
6. **Tabelas** - Com ordenação e ações
7. **Botões flutuantes** - WhatsApp
8. **Badges** - Para status e filtros ativos
9. **Steppers** - Para fluxos multi-etapa
10. **Cards de preço** - Com features comparativas

### Padrões de Interação

1. **Filtros persistentes** - Período selecionado mantido entre telas
2. **Feedback visual** - Estados vazios com ícones e mensagens
3. **Ações contextuais** - Botões de ação próximos aos dados
4. **Confirmação** - Modais para ações destrutivas
5. **Ocultação de valores** - Ícone de olho para privacidade

---

## Funcionalidades para Referência no FinAssistant

### Prioridade Alta
- [ ] Dashboard com cards de resumo financeiro
- [ ] Gestão de categorias com cores
- [ ] Registro de receitas e despesas
- [ ] Filtros por período
- [ ] Contas bancárias múltiplas

### Prioridade Média
- [ ] Onboarding guiado
- [ ] Relatórios e gráficos
- [ ] Cartões de crédito
- [ ] Limites de gastos
- [ ] Notificações/Lembretes

### Prioridade Baixa (Diferencial)
- [ ] Integração WhatsApp
- [ ] IA para processamento de mensagens
- [ ] Importação OFX
- [ ] Gestão compartilhada
- [ ] Comunidade/Feedback

---

## Arquivos de Referência

Todos os screenshots estão em: `docs/mockups/referencia/`

| Arquivo | Descrição |
|---------|-----------|
| `01-home.png` | Landing page - hero |
| `01-home-full.png` | Landing page - completa |
| `02-funcionalidades.png` | Seção funcionalidades |
| `03-como-funciona.png` | Seção como funciona |
| `04-planos.png` | Seção planos |
| `05-faq.png` | Seção FAQ |
| `06-login.png` | Tela de login |
| `07-cadastro.png` | Tela de cadastro |
| `09-onboarding-inicio.png` | Onboarding - início |
| `10-27*.png` | Etapas do onboarding |
| `screencapture-*.png` | Capturas do painel |
