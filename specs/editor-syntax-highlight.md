# Especificação: Editor de Código com Syntax Highlight

## 1. Análise das Opções

### 1.1 Bibliotecas Pesquisadas

| Biblioteca | Downloads Semanais | Tamanho (gzip) | Auto-detect | Server-side | Qualidade Highlight |
|------------|-------------------|----------------|-------------|-------------|---------------------|
| **Shiki** | ~5M | ~280KB | ❌ | ✅ | ⭐⭐⭐⭐⭐ (VS Code) |
| Prism.js | ~5M | ~5KB | ❌ | ✅ | ⭐⭐⭐ |
| highlight.js | ~10M | ~15KB | ✅ | ✅ | ⭐⭐⭐ |

### 1.2 Análise do Ray-so

O **ray.so** (código aberto pela Raycast) foi analisado:
- Usa **Shiki** como biblioteca principal de syntax highlighting
- Usa **highlight.js** como dependência adicional
- Usa **html-to-image** para exportação de imagens
- Aplica highlight no servidor (Server Component)

### 1.3 Estado Atual do Projeto

O projeto já possui:
- `CodeEditor`: componente com textarea simples (sem highlight em tempo real)
- `CodeBlock`: Server Component com Shiki para exibição highlightada
- Shiki já instalado (v4.0.2)
- Tema "vesper" configurado

---

## 2. Recomendação

### ✅ Recomendado: Shiki

**Justificativa:**
1. **Qualidade superior** - Usa o mesmo motor do VS Code (TextMate grammars)
2. **Server-side rendering** - Zero JavaScript client-side para highlight
3. **Integração com Next.js 16** - Already integrated no projeto
4. **Themas VS Code** - Acesso a hundreds de temas populares
5. **Suporte a 200+ linguagens** - Coverage abrangente

### Alternativas consideradas:

| Alternativa | Quando usar |
|-------------|-------------|
| **react-syntax-highlighter** | Se precisar de componentes React client-side com múltiplos temas |
| **highlight.js** | Se auto-detect de linguagem for mandatório |

---

## 3. Arquitetura Proposta

### 3.1 Detecção de Linguagem

**Abordagem híbrida:**

```
┌─────────────────────────────────────────────────────┐
│  Editor de Código                                   │
├─────────────────────────────────────────────────────┤
│  1. Usuário digita código                          │
│  2. Detectar linguagem (priority):                 │
│     a) Seleção manual do usuário (prioridade alta) │
│     b) Auto-detect via Shiki (se implementado)    │
│  3. Aplicar highlight em tempo real (preview)      │
└─────────────────────────────────────────────────────┘
```

**Biblioteca para auto-detect:** `highlight.js` (já usado pelo Ray-so como fallback)

### 3.2 UI do Editor

O editor deve oferecer:

1. **Campo de seleção de linguagem** (dropdown)
   - Opção "Auto" para detecção automática
   - Lista das linguagens mais populares

2. **Área de input** com syntax highlight
   - Visualização em tempo real do código com cores
   - Alternativa: textarea com overlay de highlight

3. **Preview em tempo real** (opcional)
   --mostrar resultado highlightado conforme digita

---

## 4. Decisões Tomadas ✅

- **Biblioteca:** Shiki (já instalado no projeto)
- **Detecção automática:** highlight.js como fallback
- **Posição do seletor:** Header do editor
- **Frequência de detecção:** Debounce de 500ms

---

## 5. To-Dos para Implementação

### Fase 1: Setup e Configuração

- [ ] **Instalar dependências necessárias**
  - `highlight.js` (para auto-detect de linguagem)
  - `@shikijs/transformers` (para line highlighting)

- [ ] **Criar utilitário de detecção de linguagem**
  - Função `detectLanguage(code: string): string`
  - Usar `highlight.js` para detectar linguagem

- [ ] **Configurar lista de linguagens suportadas**
  - JavaScript, TypeScript, Python, Rust, Go, HTML, CSS, JSON, SQL, Bash, etc.

### Fase 2: Componente CodeEditor com Highlight

- [ ] **Criar componente `CodeEditor` atualizado**
  - Interface: `{ value, onChange, language, onLanguageChange, autoDetect }`
  - Usar Shiki para renderizar preview highlightado

- [ ] **Implementar seletor de linguagem no header**
  - Dropdown com lista de linguagens populares
  - Opção "Auto-detect" (padrão)

- [ ] **Integrar detecção automática com debounce**
  - Detectar linguagem após 500ms sem digitação
  - Atualizar UI quando linguagem for detectada

### Fase 3: Integração na Homepage

- [ ] **Atualizar homepage para usar novo CodeEditor**
  - Adicionar seletor de linguagem na UI
  - Passar código e linguagem para o componente

- [ ] **Adicionar estilos visuais**
  - Manter look do editor (window chrome, cores)
  - Garantir responsividade

---

## 6. Perguntas em Aberto

### 6.1 Linguagens

1. **Quantas linguagens devemos mostrar no dropdown?**
   - Top 10 mais populares (JS, TS, Python, Rust, Go, HTML, CSS, JSON, SQL, Bash)?
   - Todas as linguagens suportadas pelo Shiki?

2. **O que fazer quando a linguagem não for detectada?**
   - Usar JavaScript como padrão?
   - Mostrar "Unknown" ao usuário?

---

## 7. Decisões Finais Confirmadas ✅

| Decisão | Valor |
|---------|-------|
| Biblioteca highlight | Shiki (já instalado) |
| Auto-detect | highlight.js |
| Posição seletor | Header do editor |
| Detecção | Debounce 500ms |
| Input | Textarea + Preview separado |
