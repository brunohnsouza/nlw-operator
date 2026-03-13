# DevRoast

Análise de código com IA e honestidade brutal. Cole seu código, seja critiquado.

## Funcionalidades

- **Análise de Código** - Envie código e receba feedback detalhado sobre qualidade
- **Modo Roast** - Alterne entre feedback gentil ou sarcasmo máximo
- **Leaderboard** - Veja os piores códigos submetidos ranqueados por nota de vergonha
- **Syntax Highlighting** - Blocos de código lindos com tema vesper
- **Score Ring** - Representação visual das notas de qualidade do código

## Tecnologias

- Next.js 16 (App Router)
- Tailwind CSS
- Biome (linting & formatação)
- Shiki (syntax highlighting)
- Base UI (primitivas acessíveis)

## Começando

```bash
npm install
npm run dev
```

## Estrutura do Projeto

```
src/
├── app/              # Páginas Next.js
├── components/ui/    # Componentes UI reutilizáveis
└── lib/              # Utilitários
```

## Comandos

- `npm run dev` - Iniciar servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run lint` - Executar Biome linter
