import { getEnglishMonsterName, monsterEnglishNames } from './monsterTranslations'
import { mapToRegion } from './mapRegions'

const exactItemTranslations: Record<string, string> = {
  'EVP데이터 칩(소형)': 'EVP Data Chip (Small)',
  'EVP데이터 칩(중형)': 'EVP Data Chip (Medium)',
  '계곡 탐지기': 'Valley Detector',
  '고장난 HDD': 'Broken HDD',
  '고장난 USB': 'Broken USB',
  '고장난 디스켓': 'Broken Diskette',
  '구형 탐지기': 'Old Detector',
  '궁극체 스킬 강화석': 'Mega Skill Enhancement Stone',
  '데뀨 철창 열쇠 꾸러미': 'Dekyu Cage Key Bundle',
  '데뀨 철창 열쇠 꾸러미2': 'Dekyu Cage Key Bundle 2',
  '데이터 세계 탐지기': 'Data World Detector',
  '막대 사탕': 'Lollipop',
  미트파이: 'Meat Pie',
  밀크셰이크: 'Milkshake',
  '보급형 탐지기': 'Standard Detector',
  샌드위치: 'Sandwich',
  '성숙기 스킬 강화석': 'Champion Skill Enhancement Stone',
  '성장기 스킬 강화석': 'Rookie Skill Enhancement Stone',
  '수상한 감옥 열쇠': 'Suspicious Prison Key',
  '스파이럴 탐지기 랜덤 박스': 'Spiral Detector Random Box',
  식빵: 'White Bread',
  '신형 탐지기': 'New Detector',
  씨앗: 'Seed',
  '악의 습격 시즌 - 카드 상자 A': 'Evil Raid Season - Card Box A',
  '악의 습격 시즌 - 카드 상자 B': 'Evil Raid Season - Card Box B',
  '악의 습격 시즌 - 카드 상자 C': 'Evil Raid Season - Card Box C',
  '악의 습격 시즌 - 카드 상자 D': 'Evil Raid Season - Card Box D',
  '악의 습격 시즌 - 카드 상자 E': 'Evil Raid Season - Card Box E',
  '악의 습격 시즌 - 카드 상자 F': 'Evil Raid Season - Card Box F',
  '악의 습격 시즌 - 카드 상자 G': 'Evil Raid Season - Card Box G',
  '악의 습격 시즌 - 카드 상자 H': 'Evil Raid Season - Card Box H',
  '악의 습격 시즌 - 카드 상자 I': 'Evil Raid Season - Card Box I',
  '악의 습격 시즌 - 카드 상자 J': 'Evil Raid Season - Card Box J',
  '오래된 HDD': 'Old HDD',
  '오래된 USB': 'Old USB',
  '오래된 디스켓': 'Old Diskette',
  '완전체 스킬 강화석': 'Ultimate Skill Enhancement Stone',
  '유년기1 디지타마': 'In-Training I DigiEgg',
  '유년기2 디지타마': 'In-Training II DigiEgg',
  '인펠몬이 훔쳐간 디지타마': 'DigiEgg Stolen by Infermon',
  조각케이크: 'Slice of Cake',
  '조합법 : 부서진 제로유니트': 'Recipe: Broken Zero Unit',
  '조합법 : 빛나는 제로유니트': 'Recipe: Shining Zero Unit',
  '조합법 : 오래된 HDD': 'Recipe: Old HDD',
  '조합법 : 완전체 스킬 강화석': 'Recipe: Ultimate Skill Enhancement Stone',
  '진홍빛 겹눈': 'Crimson Compound Eye',
  '쿠라몬의 데이터': "Kuramon's Data",
  '탐지기 선택 상자': 'Detector Selection Box',
  '특수 탐지기': 'Special Detector',
  팬케이크: 'Pancake',
  '하급 포텐셜 랜덤 상자': 'Low-Grade Potential Random Box',
  햄버거: 'Hamburger',
  '현실 세계 A형 탐지기': 'Real World Type A Detector',
  '현실 세계 B형 탐지기': 'Real World Type B Detector',
}

const accessoryDescriptors: Record<string, string> = {
  광명: 'Bright Light',
  광휘: 'Radiant',
  그늘: 'Shade',
  그림자: 'Shadow',
  냉담: 'Aloof',
  냉대: 'Cold',
  냉랭: 'Chilly',
  냉소: 'Cynical',
  냉정: 'Cool-headed',
  냉철: 'Cold Steel',
  냉혈: 'Cold-blooded',
  냉혹: 'Ruthless',
  대천사: 'Archangel',
  독안: 'One-Eyed',
  먼지안개: 'Dust Fog',
  먼지폭풍: 'Dust Storm',
  모래바람: 'Sand Wind',
  모래안개: 'Sand Fog',
  모래언덕: 'Sand Dune',
  모래폭포: 'Sandfall',
  모래폭풍: 'Sandstorm',
  무감각: 'Numbness',
  무정: 'Heartless',
  미명: 'Dawn',
  속임수: 'Trickery',
  심연: 'Abyss',
  악귀: 'Demon',
  암야: 'Dark Night',
  암흑: 'Darkness',
  어둠: 'Dark',
  어스름: 'Dusk',
  억제: 'Suppression',
  음영: 'Shading',
  인내: 'Endurance',
  자애: 'Mercy',
  절제: 'Temperance',
  증오: 'Hatred',
  진흙폭풍: 'Mudstorm',
  천사: 'Angel',
  타락: 'Fallen',
  통제: 'Control',
  흑천: 'Black Heaven',
}

const accessoryTypes: Record<string, string> = {
  귀걸이: 'Earring',
  목걸이: 'Necklace',
  반지: 'Ring',
  팔찌: 'Bracelet',
}

const partTranslations: Record<string, string> = {
  가죽: 'Leather',
  '가죽 띠': 'Leather Strap',
  가시: 'Stinger',
  '강철 손가락': 'Steel Finger',
  견갑: 'Shoulder Guard',
  겹눈: 'Compound Eye',
  꼬리: 'Tail',
  꼬리깃털: 'Tail Feather',
  꼬리뼈: 'Tailbone',
  날개: 'Wing',
  '날개 깃털': 'Wing Feather',
  '날개 잎': 'Wing Leaf',
  나무조각: 'Wood Fragment',
  더듬이: 'Antenna',
  데이터: 'Data',
  독: 'Venom',
  드릴: 'Drill',
  망토: 'Cape',
  머리카락: 'Hair',
  '머리 껍질': 'Head Shell',
  '머리 깃털': 'Head Feather',
  모자: 'Hat',
  '모자 띠': 'Hat Band',
  몽둥이: 'Club',
  몸통: 'Torso',
  반지: 'Ring',
  발톱: 'Claw',
  뿔: 'Horn',
  단추: 'Button',
  '가죽 팔찌': 'Leather Bracelet',
  '버섯 포자': 'Mushroom Spore',
  버튼: 'Button',
  볏: 'Crest',
  부리: 'Beak',
  붓: 'Brush',
  사슬: 'Chain',
  상아: 'Tusk',
  손톱: 'Claw',
  수액: 'Sap',
  실: 'Thread',
  어금니: 'Fang',
  이빨: 'Tooth',
  '이 빠진 톱니바퀴': 'Broken Gear',
  왕관: 'Crown',
  점액: 'Mucus',
  '전선 조각': 'Wire Fragment',
  줄기: 'Stem',
  지느러미: 'Fin',
  지퍼: 'Zipper',
  집게: 'Pincer',
  진액: 'Sap',
  체리: 'Cherry',
  촉수: 'Tentacle',
  촛농: 'Candle Wax',
  칼날: 'Blade',
  '칼날 지느러미': 'Blade Fin',
  캐논: 'Cannon',
  투구: 'Helmet',
  털: 'Fur',
  털뭉치: 'Furball',
  포신: 'Cannon Barrel',
  폭탄: 'Bomb',
  프릴: 'Frill',
  혀: 'Tongue',
  '황금 상아': 'Golden Tusk',
  '작은 날개': 'Small Wing',
  '철판 조각': 'Steel Plate Fragment',
  '천조각': 'Cloth Fragment',
  장갑: 'Glove',
  작살: 'Harpoon',
  팔보호대: 'Arm Guard',
  빨판: 'Sucker',
  거미줄: 'Web',
  머플러: 'Muffler',
  탄알: 'Shell',
}

export function translateDigimonType(value?: string): string | undefined {
  if (!value) return undefined
  return (
    {
      데이터: 'Data',
      바이러스: 'Virus',
      백신: 'Vaccine',
      프리: 'Free',
      언노운: 'Unknown',
    }[value] ?? value
  )
}

export function translateItemName(item: string): string {
  if (exactItemTranslations[item]) return exactItemTranslations[item]

  const brokenCore = item.match(/^부서진 (.+) 디지코어$/)
  if (brokenCore) return `Broken ${getEnglishMonsterName(brokenCore[1])} DigiCore`

  const possessive = item.match(/^(.+)의 (.+)$/)
  if (possessive) {
    const owner = getEnglishMonsterName(possessive[1])
    const part = partTranslations[possessive[2]] ?? possessive[2]
    return `${owner}'s ${part}`
  }

  const accessory = item.match(/^(.+) (귀걸이|목걸이|반지|팔찌)$/)
  if (accessory) {
    const descriptor = accessoryDescriptors[accessory[1]] ?? accessory[1]
    const type = accessoryTypes[accessory[2]]
    return `${descriptor} ${type}`
  }

  return item
}

const extraNameTranslations: Record<string, string> = {
  쉬라몬: 'Gomamon',
  텐타몬: 'Tentomon',
  아구몬: 'Agumon',
  파피몬: 'Gabumon',
  팔몬: 'Palmon',
  피요몬: 'Biyomon',
  플롯트몬: 'Salamon',
  운석몬: 'Meteormon',
  오파니몬: 'Ophanimon',
  백조몬: 'Swanmon',
  샤코몬: 'Shakomon',
  돌몬: 'Dorumon',
  테리어몬: 'Terriermon',
  크랩몬: 'Crabmon',
  코로몬: 'Koromon',
  데뀨보물상자: 'Dekyu Treasure Chest',
  '케루비몬(악)의 게이트': "Cherubimon (Evil)'s Gate",
  웜홀: 'Wormhole',
  어니몬: 'Etemon',
}

const tooltipPhraseTranslations: Record<string, string> = {
  개굴몬: 'Gekomon',
  '개굴몬 성 내부': 'Gekomon Castle Interior',
  결전: 'Final Battle',
  '결전 장소': 'Final Battle Site',
  공원: 'Park',
  공사장: 'Construction Site',
  광장: 'Plaza',
  교환: 'Exchange',
  '교환 상인': 'Exchange Merchant',
  균열: 'Rift',
  '다크 웹': 'Dark Web',
  던전: 'Dungeon',
  도로: 'Road',
  '둥실몬 서식지': 'Tokomon Habitat',
  레스토랑: 'Restaurant',
  마을: 'Village',
  만물상: 'General Store',
  먹보: 'Glutton',
  먹이: 'Food',
  미궁: 'Maze',
  바위산: 'Rocky Mountain',
  방송국: 'Broadcast Station',
  번화가: 'Downtown',
  '배틀 아이템': 'Battle Item',
  배틀아이템: 'Battle Item',
  판매상: 'Vendor',
  사거리: 'Intersection',
  상인: 'Merchant',
  상자: 'Box',
  '상자 조각': 'Box Fragment',
  성: 'Castle',
  '성 경험치 던전': 'Castle EXP Dungeon',
  세라피몬: 'Seraphimon',
  세계수: 'World Tree',
  소모품: 'Consumables',
  수집가: 'Collector',
  숲: 'Forest',
  스핑크스: 'Sphinx',
  심층부: 'Deep Area',
  아랫마을: 'Lower Village',
  아파트: 'Apartment',
  '아파트 단지': 'Apartment Complex',
  앞: 'Front',
  암석지대: 'Rocky Area',
  어둠성: 'Dark Castle',
  '어둠 성': 'Dark Castle',
  오메가몬: 'Omegamon',
  올라가는: 'Going Up',
  내려가는: 'Going Down',
  오버플로우: 'Overflow',
  '오버플로우 던전': 'Overflow Dungeon',
  요리사: 'Chef',
  입구: 'Entrance',
  내부: 'Interior',
  중심부: 'Central Area',
  제작자: 'Creator',
  주차장: 'Parking Lot',
  중앙: 'Center',
  쪽: 'Side',
  초승달: 'Crescent',
  초입부: 'Entry Area',
  출구: 'Exit',
  층: 'F',
  카드: 'Card',
  토큰: 'Token',
  통제: 'Control',
  포탈: 'Portal',
  해변: 'Beach',
  해변가: 'Beachside',
  호텔: 'Hotel',
  힘: 'Power',
  원하는: 'Seeking',
  자: 'One',
  피라미드: 'Pyramid',
  하단: 'Lower',
  게이트: 'Gate',
  나루터: 'Ferry',
  늪지대: 'Swamp',
  다리: 'Bridge',
  동상: 'Statue',
  부근: 'Near',
  정산: 'Summit',
  정상: 'Summit',
  '정상으로 가는 길': 'Path to the Summit',
  중턱: 'Mid-slope',
  조각: 'Fragment',
  철창: 'Cage',
  열쇠: 'Key',
  꾸러미: 'Bundle',
  'RANK토큰': 'Rank Token',
  '디지털해저드 토큰': 'Digital Hazard Token',
  워프: 'Warp',
  '워프 포인트': 'Warp Point',
  디지몬: 'Digimon',
  장난감: 'Toy',
  공장: 'Factory',
  공터: 'Clearing',
  계곡: 'Valley',
  절벽: 'Cliff',
  반대: 'Opposite Side',
  이동: 'Travel',
  초입: 'Entry',
  육교: 'Overpass',
  골목길: 'Alley',
  섬: 'Island',
  폐허: 'Ruins',
  '폐허가 된': 'Ruined',
  과거: 'Past',
  '식당 주인': 'Restaurant Owner',
  '스파이럴 마운틴': 'Spiral Mountain',
  스파이럴: 'Spiral',
  마운틴: 'Mountain',
  무한: 'Infinite',
  에서: 'from',
  의: "'s",
  을: '',
}

function replaceAllLiteral(value: string, from: string, to: string): string {
  return value.split(from).join(to)
}

export function translateMarkerTooltip(tooltip = ''): string {
  const clean = tooltip.replace(/<br\s*\/?>/gi, ' / ').replace(/<[^>]+>/g, '')
  let translated = clean

  const mapNames = [...mapToRegion.entries()]
    .map(([key, value]) => [key, value.map.en] as const)
    .sort((a, b) => b[0].length - a[0].length)
  for (const [key, value] of mapNames) translated = replaceAllLiteral(translated, key, value)

  const names = { ...monsterEnglishNames, ...extraNameTranslations }
  for (const source of Object.keys(names)) translated = replaceAllLiteral(translated, source, names[source])

  const phraseEntries = Object.entries(tooltipPhraseTranslations).sort((a, b) => b[0].length - a[0].length)
  for (const [source, value] of phraseEntries) translated = replaceAllLiteral(translated, source, value)

  translated = translated
    .replace(/\s*\/\s*/g, ' / ')
    .replace(/\s*'s\s*/g, "'s ")
    .replace(/\s+/g, ' ')
    .replace(/(\d+)F/g, '$1F')
    .trim()

  return translated
}
