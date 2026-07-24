import { useDsrData } from '../store/DataContext'

export function AboutPage() {
  const { data } = useDsrData()
  return (
    <main className="page-shell">
      <header className="page-title">
        <h1>About the project</h1>
        <p>
          A static, unofficial tool for browsing Digimon Super Rumble maps, spawns, portals, warps, shops,
          dungeons, Overflow points, and Data Cubes.
        </p>
      </header>
      <section className="panel">
        <h2>Data source</h2>
        <p>
          Data is synchronized from the dsr1111/dsr repository, with local copies in public/data so the published
          site does not depend on a runtime API.
        </p>
      </section>
      {data?.manifest ? (
        <section className="stats-grid">
          <article><strong>{data.manifest.mapCount}</strong><span>maps</span></article>
          <article><strong>{data.manifest.totalSpawnCount}</strong><span>spawns</span></article>
          <article><strong>{data.manifest.uniqueDigimonCount}</strong><span>unique Digimons</span></article>
          <article><strong>{data.manifest.aggressiveCount}</strong><span>aggressive spawns</span></article>
        </section>
      ) : null}
      <section className="panel">
        <h2>Disclaimer</h2>
        <p>
          This project is not affiliated with, endorsed by, or sponsored by the Digimon Super Rumble rights holders.
          Names, images, trademarks, and data belong to their respective owners.
        </p>
      </section>
    </main>
  )
}
