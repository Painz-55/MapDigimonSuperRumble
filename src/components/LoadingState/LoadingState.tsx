export function LoadingState() {
  return (
    <div className="state state--loading" role="status" aria-live="polite">
      <span className="spinner" />
      <strong>Carregando dados reais do DSR...</strong>
      <p>Usando as copias locais sincronizadas em public/data.</p>
    </div>
  )
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="state state--error" role="alert">
      <strong>Nao foi possivel abrir o mapa.</strong>
      <p>{message}</p>
      <p>Execute npm run sync-data para atualizar a copia local dos dados.</p>
    </div>
  )
}
