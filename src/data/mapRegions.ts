export interface KnownMapEntry {
  key: string
  pt: string
  en: string
}

export interface KnownRegion {
  key: string
  pt: string
  ko: string
  en: string
  maps: KnownMapEntry[]
}

export const knownRegions: KnownRegion[] = [
  {
    key: 'file-island',
    pt: 'Ilha Arquivo',
    ko: '파일섬',
    en: 'File Island',
    maps: [
      { key: '시작의 마을', pt: 'Vila Inicial', en: 'Start Village' },
      { key: '용의 눈 호수', pt: 'Lago Olho do Dragao', en: "Dragon's Eye Lake" },
      { key: '기어 사바나', pt: 'Gear Savanna', en: 'Gear Savanna' },
      { key: '무한 산', pt: 'Montanha Infinita', en: 'Infinity Mountain' },
    ],
  },
  {
    key: 'server-continent',
    pt: 'Continente Servidor',
    ko: '서버대륙',
    en: 'Server Continent',
    maps: [
      { key: '사막 지대', pt: 'Regiao Desertica', en: 'Desert Region' },
      { key: '어둠성 계곡', pt: 'Vale do Castelo das Trevas', en: 'Dark Castle Valley' },
      { key: '개굴몬 성 1F', pt: 'Castelo de Gekomon, 1o andar', en: 'Gekomon Castle 1F' },
      { key: '개굴몬 성 2F', pt: 'Castelo de Gekomon, 2o andar', en: 'Gekomon Castle 2F' },
      { key: '어둠성 내부', pt: 'Interior do Castelo das Trevas', en: 'Dark Castle Interior' },
    ],
  },
  {
    key: 'real-world',
    pt: 'Mundo Real',
    ko: '현실 세계',
    en: 'Real World',
    maps: [
      { key: '캠핑장', pt: 'Acampamento', en: 'Campground' },
      { key: '빛의 언덕', pt: 'Colina da Luz', en: 'Hikarigaoka' },
      { key: '지하철 역', pt: 'Estacao de Metro', en: 'Subway Station' },
      { key: '오다이바 입구', pt: 'Entrada de Odaiba', en: 'Odaiba Entrance' },
      { key: '오다이바 북부', pt: 'Odaiba Norte', en: 'North Odaiba' },
      { key: '시부야', pt: 'Shibuya', en: 'Shibuya' },
      { key: '오다이바 남부', pt: 'Odaiba Sul', en: 'South Odaiba' },
      { key: '국제 전시장', pt: 'Centro Internacional de Exposicoes', en: 'International Exhibition Center' },
    ],
  },
  {
    key: 'spiral-mountain',
    pt: 'Montanha Espiral',
    ko: '스파일럴 마운틴',
    en: 'Spiral Mountain',
    maps: [
      { key: '네트워크 바다', pt: 'Mar da Rede', en: 'Network Sea' },
      { key: '수목 지구', pt: 'Distrito Florestal', en: 'Forest District' },
      { key: '강철 도시', pt: 'Cidade de Aco', en: 'Steel City' },
      { key: '강철 도시 지하', pt: 'Subsolo da Cidade de Aco', en: 'Steel City Underground' },
      { key: '어둠의 권역', pt: 'Dominio das Trevas', en: 'Dark Area' },
      { key: '스파일럴 마운틴 정상', pt: 'Topo da Montanha Espiral', en: 'Spiral Mountain Summit' },
      { key: '???', pt: 'Area desconhecida', en: 'Unknown Area' },
    ],
  },
  {
    key: 'data-world',
    pt: 'Mundo dos Dados',
    ko: '데이터 세계',
    en: 'Data World',
    maps: [
      { key: '테이머의 집', pt: 'Casa do Tamer', en: "Tamer's House" },
      { key: '빛의 언덕 과거(밤)', pt: 'Colina da Luz no Passado, a noite', en: 'Past Hikarigaoka at Night' },
      { key: '네트워크', pt: 'Network', en: 'Network' },
    ],
  },
]

export const otherRegion = {
  key: 'other',
  pt: 'Outros mapas',
  ko: '기타',
  en: 'Other Maps',
}

export const mapToRegion = new Map(
  knownRegions.flatMap((region) => region.maps.map((map, order) => [map.key, { region, map, order }] as const)),
)
