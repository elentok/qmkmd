import { Layout } from "../types.ts"
import { expandMapping } from "./expand-mapping.ts"

export function writeCombos(layout: Layout): string[] {
  const { combos } = layout
  if (combos == null || combos.length === 0) return []

  const constLines: string[] = []
  const comboLines: string[] = []

  combos.forEach((combo, index) => {
    const keys = combo.keys.split("+").map((key) => expandMapping(key, layout)).join(", ")
    const action = expandMapping(combo.action, layout)

    const constName = `combo${index}`
    constLines.push(`const uint16_t PROGMEM ${constName}[] = {${keys}, COMBO_END};`)
    comboLines.push(`  COMBO(${constName}, ${action}),`)
  })

  return [
    ...constLines,
    "",
    `combo_t key_combos[${combos.length}] = {`,
    ...comboLines,
    "};",
  ]
}
