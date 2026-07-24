import { useDsrData } from '../store/DataContext'

export function AboutPage() {
  const { data } = useDsrData()
  return (
    <main className="page-shell">
      <header className="page-title">
        <h1>Sobre o projeto</h1>
        <p>
          Ferramenta estatica e nao oficial em portugues brasileiro para consultar mapas, spawns, portais,
          warps, lojas, dungeons, Overflow e Data Cubes de Digimon Super Rumble.
        </p>
      </header>
      <section className="panel">
        <h2>Fonte dos dados</h2>
        <p>
          Os dados sao sincronizados do repositorio dsr1111/dsr, com copias locais em public/data para evitar
          dependencia de API em tempo de execucao.
        </p>
      </section>
      {data?.manifest ? (
        <section className="stats-grid">
          <article><strong>{data.manifest.mapCount}</strong><span>mapas</span></article>
          <article><strong>{data.manifest.totalSpawnCount}</strong><span>spawns</span></article>
          <article><strong>{data.manifest.uniqueDigimonCount}</strong><span>Digimons unicos</span></article>
          <article><strong>{data.manifest.aggressiveCount}</strong><span>agressivos</span></article>
        </section>
      ) : null}
      <section className="panel">
        <h2>Aviso</h2>
        <p>
          Este projeto nao e afiliado, endossado ou patrocinado pelos detentores de direitos de Digimon Super
          Rumble. Nomes, imagens, marcas e dados pertencem aos seus respectivos proprietarios.
        </p>
      </section>
    </main>
  )
}
