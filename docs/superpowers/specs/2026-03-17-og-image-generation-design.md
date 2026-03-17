# Geração Automática de Imagens Open Graph

## Overview

Sistema que gera imagens Open Graph dinamicamente quando o usuário clica em "share_roast", usando @vercel/og para renderizar React/HTML como imagem. Sem IA, sem custos de API externa.

## User Flow

1. Usuário está na página de resultado do roast (`/result/[id]`)
2. Clica no botão "$ share_roast"
3. Sistema gera imagem OG com os dados do roast
4. Sistema copia URL da imagem para clipboard + mostra toast de sucesso

## Architecture

### API Route

`GET /api/og/[id]`

- Parâmetros: `id` do roast (buscado do banco via tRPC)
- Retorna: Imagem PNG (1200x630) com headers de cache
- Headers: `Cache-Control: public, max-age=31536000, immutable`

### Template Component

Usa `@vercel/og` para renderizar React como imagem.

#### Design (do arquivo Pencil devroast.pen)

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                     > devroast                              │
│                                                             │
│                        3.5                                  │
│                       /10                                    │
│                                                             │
│                    ● needs_serious_help                      │
│                                                             │
│                 lang: javascript · 7 lines                   │
│                                                             │
│        "this code was written during a power outage..."      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Estilos

| Campo | Fonte | Cor | Tamanho |
|-------|-------|-----|---------|
| Logo prompt | JetBrains Mono | #10B981 (green) | 24px, bold |
| Logo text | JetBrains Mono | #FAFAFA (white) | 20px |
| Score number | JetBrains Mono | #F59E0B (amber) | 160px, black |
| Score denom | JetBrains Mono | #737373 (gray) | 56px |
| Verdict dot | #EF4444 (red) | ellipse 12x12 | - |
| Verdict text | JetBrains Mono | #EF4444 (red) | 20px |
| Lang info | JetBrains Mono | #737373 (gray) | 16px |
| Roast quote | IBM Plex Mono | #FAFAFA (white) | 22px, max 2 linhas |

#### Cores de Fundo

- Background: #0C0C0C (dark)
- Padding: 64px

#### Dimensões

- Width: 1200px
- Height: 630px (padrão OG)

### Integration

#### Página de Resultado

- Botão "share_roast" faz fetch da imagem OG
- Copia URL para clipboard
- O link compartilhável usa a página `/result/[id]` com metadata dinâmica

#### Metadata OpenGraph

```html
<meta property="og:image" content="https://.../api/og/[id]" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:type" content="image/png" />
```

## Data Flow

```
User clicks "share_roast"
        │
        ▼
fetch('/api/og/[id]') 
        │
        ▼
caller.roasts.getById({ id })
        │
        ▼
Render React template com dados
        │
        ▼
@vercel/og → PNG buffer
        │
        ▼
Return PNG + Cache headers
        │
        ▼
Copy URL to clipboard + Toast
```

## Edge Cases

1. **Roast não encontrado**: Retorna 404 com imagem de erro simple
2. **Dados faltando**: Usa defaults (score "0", verdict "unknown", lang "unknown")
3. **Texto muito longo**: Truncar com ellipsis (max 2 linhas para título)

## Dependencies

```bash
npm install @vercel/og
```

## Acceptance Criteria

1. Imagem OG é gerada com dados corretos do roast
2. Botão "share_roast" copia URL da imagem para clipboard
3. Metadata OpenGraph é adicionada à página de resultado
4. Cache funciona corretamente (imagens não regeneradas desnecessariamente)
5. Edge cases tratados (404, dados faltando, texto longo)
6. Design segue exatamente o spec do Pencil

## Implementation Notes

- Reutilizar cores do tema Tailwind do projeto
- Usar fontes disponíveis no sistema: JetBrains Mono, Geist/IBM Plex Mono
- Testar com diferentes sizes de conteúdo (texto curto, longo)
- Configurar cache appropriadamente para performance
