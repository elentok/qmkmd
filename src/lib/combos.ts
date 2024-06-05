import { filterPresentRows, parseVariable } from "./helpers.ts"
import { Block, Combo } from "./types.ts"

export function parseCombos(block: Block): Combo[] {
  const { lines, indexToLineNr } = filterPresentRows(block)

  const combos: Combo[] = []

  lines.forEach((line, index) => {
    const v = parseVariable(line)
    if (v != null) {
      combos.push({ keys: v.name, action: v.value, lineNr: indexToLineNr[index] })
    }
  })

  return combos
}
