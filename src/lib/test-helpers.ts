import { parseStructure } from "./structure.ts"
import { Structure } from "./types.ts"

export function createStructure(lines: string[]): Structure {
  return parseStructure({
    name: "structure",
    startLineNr: 10,
    lines,
  })
}
