import { filterPresentRows, parseVariable } from "../helpers.ts"
import { Alias, Aliases, Block } from "../types.ts"

export function parseAliases(block: Block): Aliases {
  const { lines, indexToLineNr } = filterPresentRows(block)

  const aliases = new Map<string, Alias>()

  lines.forEach((line, index) => {
    const v = parseVariable(line)
    if (v != null) {
      aliases.set(v.name, { value: v.value, lineNr: indexToLineNr[index] })
    }
  })

  return aliases
}
