import { parseAliases } from "./aliases.ts"
import { parseCombos } from "./combos.ts"
import { parseLayer } from "./layer.ts"
import { parseOptions } from "./options.ts"
import { parseStructure } from "./structure.ts"
import { Aliases, Block, Combo, Layout, LayoutError, Options, Structure } from "./types.ts"

export function readMarkdownFile(filename: string): { lines: string[]; blocks: Block[] } {
  const lines = Deno.readTextFileSync(filename).split("\n")
  const blocks = findBlocks(lines)

  return { lines, blocks }
}

export function readLayout(filename: string): Layout {
  const { blocks } = readMarkdownFile(filename)
  return parseBlocks(blocks)
}

export function parseBlocks(blocks: Block[]): Layout {
  const options = parseOptionsBlock(blocks)
  const structure = parseStructureBlock(blocks)
  const layers = blocks.filter((b) => b.name.startsWith("layer:")).map((block) => parseLayer(block, structure))
  const aliases = parseAliasesBlock(blocks)
  const combos = parseCombosBlock(blocks)

  return { options, structure, layers, aliases, combos }
}

function parseAliasesBlock(blocks: Block[]): Aliases | undefined {
  const aliasesBlocks = blocks.filter((b) => b.name === "aliases")

  if (aliasesBlocks.length > 1) {
    const lines = aliasesBlocks.map((b) => b.startLineNr).join(", ")
    throw new LayoutError(`Found multiple options blocks at lines ${lines}`)
  }

  if (aliasesBlocks.length === 0) return

  return parseAliases(aliasesBlocks[0])
}

function parseCombosBlock(blocks: Block[]): Combo[] | undefined {
  const comboBlocks = blocks.filter((b) => b.name === "combos")

  if (comboBlocks.length > 1) {
    const lines = comboBlocks.map((b) => b.startLineNr).join(", ")
    throw new LayoutError(`Found multiple combo blocks at lines ${lines}`)
  }

  if (comboBlocks.length === 0) return

  return parseCombos(comboBlocks[0])
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

  return parseStructure(structureBlocks[0])
}

export function findBlocks(lines: string[]): Block[] {
  const blocks: Block[] = []

  let block: Block | null = null

  let lineNr = 0
  for (const line of lines) {
    lineNr++
    if (block == null) {
      if (/^```(aliases|options|combos|structure|layer:)/.test(line)) {
        block = {
          name: line.substring(3).trim(),
          lines: [],
          startLineNr: lineNr + 1,
        }
      }
    } else {
      if (line === "```") {
        blocks.push(block)
        block = null
      } else {
        block.lines.push(line)
      }
    }
  }

  return blocks
}
