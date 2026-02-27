// Gen 1 기본형만 배정 (진화 전 단계)
export const BASE_FORMS = [
  1,4,7,10,13,16,19,21,23,27,29,32,35,37,39,41,43,46,48,
  50,52,54,56,58,60,63,66,69,72,74,77,79,81,84,86,88,90,
  92,96,98,100,102,104,109,111,116,118,120,129,133,138,140,147,
]

// PokeAPI 진화 체인 (base_id → [stage0, stage1, stage2, ...])
// 이브이(133)는 4가지 진화형 → 진행도별로 순서대로
const EVO_CHAIN: Record<number, number[]> = {
  1:[1,2,3], 4:[4,5,6], 7:[7,8,9], 10:[10,11,12], 13:[13,14,15],
  16:[16,17,18], 19:[19,20], 21:[21,22], 23:[23,24], 27:[27,28],
  29:[29,30,31], 32:[32,33,34], 35:[35,36], 37:[37,38], 39:[39,40],
  41:[41,42], 43:[43,44,45], 46:[46,47], 48:[48,49], 50:[50,51],
  52:[52,53], 54:[54,55], 56:[56,57], 58:[58,59], 60:[60,61,62],
  63:[63,64,65], 66:[66,67,68], 69:[69,70,71], 72:[72,73], 74:[74,75,76],
  77:[77,78], 79:[79,80], 81:[81,82], 84:[84,85], 86:[86,87],
  88:[88,89], 90:[90,91], 92:[92,93,94], 96:[96,97], 98:[98,99],
  100:[100,101], 102:[102,103], 104:[104,105], 109:[109,110], 111:[111,112],
  116:[116,117], 118:[118,119], 120:[120,121], 129:[129,130],
  133:[133,134,135,136], 138:[138,139], 140:[140,141], 147:[147,148,149],
}

// 단일 진화 없는 포켓몬 (항상 같은 스프라이트)
// 95 롱스톤, 108 내루미, 113 럭키, 114 덩쿠리, 115 캥카, 122 마임맨,
// 123 스라크, 124 루주라, 125 에레브, 126 마그마, 127 쁘사이저, 128 켄타로스,
// 131 라프라스, 132 메타몽 등 — 이미 BASE_FORMS에서 제외됨

export function getEvolutionStage(progress: number): 0 | 1 | 2 | 3 {
  if (progress === 0) return 0       // 알
  if (progress < 40) return 1        // 기본형
  if (progress < 80) return 2        // 1차 진화
  return 3                           // 최종 진화 (100% 완료)
}

/**
 * 진행도에 맞는 실제 포켓몬 ID 반환
 * progress 0 → 알, 1~39 → 기본형, 40~79 → 1차진화, 80+ → 최종진화
 */
export function getActualPokemonId(basePokemonId: number, progress: number): number {
  const stage = getEvolutionStage(progress)
  if (stage === 0) return basePokemonId // 알 상태에서는 ID 무관

  const chain = EVO_CHAIN[basePokemonId]
  if (!chain) return basePokemonId

  // stage 1 → chain[0], stage 2 → chain[1] (없으면 마지막), stage 3 → chain[마지막]
  if (stage === 1) return chain[0]
  if (stage === 2) return chain[Math.min(1, chain.length - 1)]
  return chain[chain.length - 1]
}

export function getSpriteUrl(pokemonId: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/firered-leafgreen/${pokemonId}.png`
}

export const EGG_SPRITE = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mystery-egg.png`

export function isAbandoned(lastUpdatedAt: string): boolean {
  return Date.now() - new Date(lastUpdatedAt).getTime() > 14 * 24 * 60 * 60 * 1000
}

export async function assignRandomPokemon(usedIds: number[]): Promise<number> {
  const available = BASE_FORMS.filter(id => !usedIds.includes(id))
  if (available.length === 0) throw new Error('모든 기본형 포켓몬이 이미 배정됨')
  return available[Math.floor(Math.random() * available.length)]
}
