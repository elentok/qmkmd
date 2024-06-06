import { parseAliases } from "./aliases.ts"
import { parseCombos } from "./combos.ts"
import { parseLayer } from "./layer.ts"
import { parseOptions } from "./options.ts"
import { parseStructure } from "./structure.ts"
import { Block, Layout } from "../types.ts"
import { findBlocks, getOptionalBlock, getRequiredBlock } from "./blocks.ts"

export function parseLayoutFile(filename: string): Layout {
  const { blocks } = parseMarkdownFile(filename)
  return parseBlocks(blocks)
}

export function parseMarkdownFile(filename: string): { lines: string[]; blocks: Block[] } {
  const lines = Deno.readTextFileSync(filename).split("\n")
  const blocks = findBlocks(lines)

  return { lines, blocks }
}

export function parseBlocks(blocks: Block[]): Layout {
  const options = parseOptions(getOptionalBlock(blocks, "options")?.lines)
  const structure = parseStructure(getRequiredBlock(blocks, "structure"))
  const layers = blocks.filter((b) => b.name.startsWith("layer:")).map((block) => parseLayer(block, structure))

  const aliasesBlock = getOptionalBlock(blocks, "aliases")
  const aliases = aliasesBlock ? parseAliases(aliasesBlock) : undefined

  const combosBlock = getOptionalBlock(blocks, "combos")
  const combos = combosBlock ? parseCombos(combosBlock) : undefined

  return { options, structure, layers, aliases, combos }
}
