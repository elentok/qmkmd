import { parseLayer } from "./layer.ts"
import { parseStructure } from "./structure.ts"
import { Layout, LayoutError } from "./types.ts"

export function readLayout(filename: string): Layout {
  const lines = Deno.readTextFileSync(filename).split("\n")

  const blocks = findBlocks(lines)

  const structureBlocks = blocks.filter((b) => b.name === "structure")
  if (structureBlocks.length === 0) {
    throw new LayoutError(`Missing structure block`)
  }

  if (structureBlocks.length > 1) {
    const lines = structureBlocks.map((b) => b.startLineNr).join(", ")
    throw new LayoutError(`Found multiple structure blocks at lines ${lines}`)
  }

  const structure = parseStructure(structureBlocks[0].lines)
  const layers = blocks.filter((b) => b.name.startsWith("layer:")).map((block) =>
    parseLayer(block.name.replace(/^layer:/, ""), block.lines, structure)
  )

  return { structure, layers }
}

interface Block {
  name: string
  lines: string[]
  startLineNr: number
  endLineNr: number
}

export function findBlocks(lines: string[]): Block[] {
  const blocks: Block[] = []

  let block: Omit<Block, "endLineNr"> | null = null

  let lineNr = 0
  for (const line of lines) {
    lineNr++
    if (block == null) {
      if (/^```(structure|layer:)/.test(line)) {
        block = {
          name: line.substring(3).trim(),
          lines: [],
          startLineNr: lineNr,
        }
      }
    } else {
      if (line === "```") {
        blocks.push({ ...block, endLineNr: lineNr })
        block = null
      } else {
        block.lines.push(line)
      }
    }
  }

  return blocks
}
