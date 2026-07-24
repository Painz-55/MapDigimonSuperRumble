import { Maximize, Move, RefreshCw, ZoomIn, ZoomOut } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import { resolveAssetUrl } from '../../services/assetResolver'
import type { AssetsManifest, NormalizedMap, NormalizedSpawn, VisibleLayers } from '../../types/dsr'
import { ImageWithFallback } from '../MapMarker/ImageWithFallback'
import { MonsterMarker, UtilityMarker } from '../MapMarker/MapMarker'

interface InteractiveGameMapProps {
  map: NormalizedMap
  spawns: NormalizedSpawn[]
  selectedSpawnId: string | null
  highlightedSpawnId: string | null
  visibleLayers: VisibleLayers
  keepMarkersReadable: boolean
  dragEnabled: boolean
  manifest?: AssetsManifest
  onSelectSpawn: (spawn: NormalizedSpawn) => void
  onTransformChange: (zoom: number, positionX: number, positionY: number) => void
}

function markerVisible(kind: string, layers: VisibleLayers): boolean {
  if (kind === 'portal') return layers.portals
  if (kind === 'warp') return layers.warps
  if (kind === 'shop') return layers.shops
  if (kind === 'overflow') return layers.overflows
  if (kind === 'dungeon') return layers.dungeons
  if (kind === 'datacube') return layers.datacubes
  return true
}

export function InteractiveGameMap({
  map,
  spawns,
  selectedSpawnId,
  highlightedSpawnId,
  visibleLayers,
  keepMarkersReadable,
  dragEnabled,
  manifest,
  onSelectSpawn,
  onTransformChange,
}: InteractiveGameMapProps) {
  const frameRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const mapImage = resolveAssetUrl(map.backgroundImage, manifest)

  useEffect(() => {
    setMapLoaded(false)
    const image = new Image()
    image.src = mapImage
    image.onload = () => setMapLoaded(true)
    return () => {
      image.onload = null
    }
  }, [mapImage])

  useEffect(() => {
    const preload = spawns.slice(0, 80)
    preload.forEach((spawn) => {
      const image = new Image()
      image.src = resolveAssetUrl(spawn.src, manifest)
    })
  }, [manifest, spawns])

  const utilityMarkers = useMemo(() => map.markers, [map.markers])

  return (
    <section className="map-shell" aria-label={`Mapa ${map.localizedName}`}>
      {!mapLoaded ? <div className="map-skeleton">Carregando mapa...</div> : null}
      <div className="map-frame" ref={frameRef}>
        <TransformWrapper
          key={map.key}
          initialScale={0.92}
          minScale={0.45}
          maxScale={4}
          centerOnInit
          disabled={!dragEnabled}
          wheel={{ disabled: false, step: 0.12 }}
          doubleClick={{ disabled: false, step: 0.7 }}
          pinch={{ step: 4 }}
          onTransform={(_, state) => onTransformChange(state.scale, state.positionX, state.positionY)}
        >
          {({ zoomIn, zoomOut, resetTransform, centerView }) => (
            <>
              <div className="map-toolbar" aria-label="Controles do mapa">
                <button type="button" aria-label="Aproximar" onClick={() => zoomIn()}>
                  <ZoomIn size={18} />
                </button>
                <button type="button" aria-label="Afastar" onClick={() => zoomOut()}>
                  <ZoomOut size={18} />
                </button>
                <button type="button" aria-label="Restaurar zoom" onClick={() => resetTransform()}>
                  <RefreshCw size={18} />
                </button>
                <button type="button" aria-label="Centralizar mapa" onClick={() => centerView(0.92)}>
                  <Move size={18} />
                </button>
                <button type="button" aria-label="Tela cheia" onClick={() => frameRef.current?.requestFullscreen()}>
                  <Maximize size={18} />
                </button>
              </div>
              <TransformComponent wrapperClass="transform-wrapper" contentClass="transform-content">
                <div className="map-canvas" role="img" aria-label={`Imagem e marcadores de ${map.localizedName}`}>
                  <ImageWithFallback
                    src={map.backgroundImage}
                    alt={`Mapa ${map.localizedName}`}
                    className="map-background"
                    manifest={manifest}
                  />
                  {utilityMarkers.map((marker) => (
                    <UtilityMarker
                      key={marker.markerId}
                      marker={marker}
                      manifest={manifest}
                      visible={markerVisible(marker.kind, visibleLayers)}
                    />
                  ))}
                  {visibleLayers.monsters
                    ? spawns.map((spawn) => (
                        <MonsterMarker
                          key={spawn.spawnId}
                          spawn={spawn}
                          selected={spawn.spawnId === selectedSpawnId}
                          highlighted={spawn.spawnId === highlightedSpawnId}
                          keepReadable={keepMarkersReadable}
                          manifest={manifest}
                          onSelect={onSelectSpawn}
                        />
                      ))
                    : null}
                </div>
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>
    </section>
  )
}
