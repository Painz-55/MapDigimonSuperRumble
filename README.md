# Digimon Super Rumble - Mapa de Monstros

Ferramenta estatica, nao oficial e em portugues brasileiro para consultar mapas, spawns, monstros, portais,
warps, lojas, dungeons, Overflow e Data Cubes de Digimon Super Rumble.

## Capturas

Execute `npm run dev` e abra o mapa para gerar capturas atuais da interface.

## Tecnologias

- React, TypeScript e Vite
- React Router com `HashRouter`, para funcionar no GitHub Pages sem fallback de servidor
- `react-zoom-pan-pinch` para zoom, pan, roda do mouse e toque
- Zod para validacao em tempo de execucao
- Vitest e Testing Library
- ESLint e Prettier

## Requisitos

- Node.js 20 ou superior
- npm

## Instalacao

```bash
npm install
```

## Sincronizacao dos dados

```bash
npm run sync-data
```

O comando baixa `map.json` e `digimon.json`, valida JSON e grava:

- `public/data/map.json`
- `public/data/digimon.json`
- `public/data/data-manifest.json`

Caso a sincronizacao remota falhe, mantenha a ultima copia local valida em `public/data`.

## Sincronizacao dos recursos

```bash
npm run sync-assets
```

O comando baixa imagens de mapas, Digimons e marcadores para `public/assets` e gera
`public/data/assets-manifest.json`. A URL remota segue como fallback.

## Execucao local

```bash
npm run dev
```

## Testes e validacao

```bash
npm run validate-data
npm run test
npm run build
```

## Publicacao no GitHub Pages

O Vite usa `VITE_BASE_PATH` ou o nome do repositorio vindo de `GITHUB_REPOSITORY` para definir `base`.
Para este repositorio, use:

```bash
VITE_BASE_PATH=/SiteGitHubDigimonSR/ npm run build
```

O workflow em `.github/workflows/deploy.yml` instala dependencias, valida os dados, roda testes, gera o build e publica
`dist`.

## Estrutura

- `scripts/`: sincronizacao e validacao
- `public/data/`: dados reais locais
- `public/assets/`: recursos sincronizados opcionalmente
- `src/components/`: UI reutilizavel
- `src/pages/`: rotas principais
- `src/services/`: carregamento, validacao, normalizacao, busca, URLs
- `src/i18n/`: base de idiomas
- `tests/`: testes basicos obrigatorios

## Fonte dos dados

Fonte principal: `dsr1111/dsr`.

Espelhos usados:

- `https://media.dsrwiki.com/data/csv/map.json`
- `https://media.dsrwiki.com/data/csv/digimon.json`

Veja `DATA_SOURCE.md` para as contagens reais e decisoes de normalizacao.

## Aviso

Este projeto e uma ferramenta nao oficial. Nomes, imagens, marcas e dados pertencem aos respectivos detentores de
direitos.

## Traducoes

Edite:

- `src/i18n/pt-BR.ts`
- `src/i18n/ko-KR.ts`
- `src/i18n/en-US.ts`
- `src/data/mapRegions.ts`

Quando nao houver traducao, o nome original e exibido.

## Novos mapas

Mapas novos presentes no JSON entram automaticamente em "Outros mapas". Para organizar e traduzir, adicione o mapa em
`src/data/mapRegions.ts`.

## Corrigir marcador

Corrija a fonte de dados quando possivel. Para uma correcao local temporaria, ajuste o JSON em `public/data/map.json`
preservando `top`, `left`, `src`, `id`, `name`, `level`, `hp` e `items`.

## Substituir imagens remotas

Rode `npm run sync-assets` e substitua os arquivos em `public/assets`. O manifesto relaciona cada URL remota ao caminho
local, mantendo fallback remoto.
