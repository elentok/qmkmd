import { parseLayer } from "./layer.ts"
import { parseOptions } from "./options.ts"
import { parseStructure } from "./structure.ts"
import { Layout, LayoutError, Options, Structure } from "./types.ts"

export function readLayout(filename: string): Layout {
  const lines = Deno.readTextFileSync(filename).split("\n")

  const blocks = findBlocks(lines)
  const options = parseOptionsBlock(blocks)
  const structure = parseStructureBlock(blocks)
  const layers = blocks.filter((b) => b.name.startsWith("layer:")).map((block) =>
    parseLayer(block.name.replace(/^layer:/, ""), block.lines, structure)
  )

  return { options, structure, layers }
}

function parseOptionsBlock(blocks: Block[]): Options {
  const optionsBlocks = blocks.filter((b) => b.name === "options")

  if (optionsBlocks.length > 1) {
    const lines = optionsBlocks.map((b) => b.startLineNr).join(", ")
    throw new LayoutError(`Found multiple options blocks at lines ${lines}`)
  }

  return parseOptions(optionsBlocks[0]?.lines)
}

function parseStructureBlock(blocks: Block[]): Structure {
  const structureBlocks = blocks.filter((b) => b.name === "structure")
  if (structureBlocks.length === 0) {
    throw new LayoutError(`Missing structure block`)
  }

  if (structureBlocks.length > 1) {
    const lines = structureBlocks.map((b) => b.startLineNr).join(", ")
    throw new LayoutError(`Found multiple structure blocks at lines ${lines}`)
  }

  return parseStructure(structureBlocks[0].lines)
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
      if (/^```(options|structure|layer:)/.test(line)) {
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
