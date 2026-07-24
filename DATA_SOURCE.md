# Fonte e normalizacao dos dados

Este projeto usa os dados publicos do repositorio `dsr1111/dsr`, espelhados em:

- `https://media.dsrwiki.com/data/csv/map.json`
- `https://media.dsrwiki.com/data/csv/digimon.json`

As copias usadas pela aplicacao publicada ficam em `public/data/map.json` e `public/data/digimon.json`.

## Inspecao de 2026-07-24

- Mapas carregados: 27
- Registros de spawn em `mobs`: 254
- Digimons unicos encontrados nos mapas: 110
- Entradas em `digimon.json`: 357
- Menor nivel encontrado: 2
- Maior nivel encontrado: 102
- Spawns agressivos: 17
- Eventos de evolucao: 6
- Mapas sem monstros: `???`, `테이머의 집`

## Formatos observados

Cada mapa e indexado pelo nome original coreano e possui `backgroundImage`. Os arrays opcionais encontrados sao
`portals`, `warps`, `shops`, `overflows`, `dungeon`, `datacube` e `mobs`.

Marcadores usam `id`, `tooltip`, `top`, `left` e `src`. Spawns de monstros usam `id`, `name`, `top`, `left`, `src`,
`level`, `hp`, `items` e, opcionalmente, `isAggressive` e `evol`.

## Decisoes

- A chave coreana do mapa nunca e modificada.
- O agrupamento por regiao usa a lista oficial do pedido; mapas novos entram automaticamente em "Outros mapas".
- Cada entrada de `mobs` vira um spawn independente. Entradas repetidas representam pontos diferentes e sao preservadas.
- O ID estavel do spawn inclui mapa, monstro, nivel, coordenadas e indice original.
- Coordenadas usam a area fixa 700 x 700, aplicando `top` e `left` sem recalculo.
- `digimon.json` complementa os spawns quando o nome da especie existe na base.
- Imagens locais baixadas por `sync-assets` sao preferidas quando presentes, com fallback para a URL remota.
