import { Block, LayoutError } from "../types.ts"

export function getRequiredBlock(blocks: Block[], name: string): Block {
  const block = getOptionalBlock(blocks, name)
  if (block == null) {
    throw new LayoutError(`Missing ${name} block`)
  }
  return block
}

export function getOptionalBlock(blocks: Block[], name: string): Block | undefined {
  const matchingBlocks = blocks.filter((b) => b.name === name)

  if (matchingBlocks.length > 1) {
    const lines = matchingBlocks.map((b) => b.startLineNr).join(", ")
    throw new LayoutError(`Found multiple ${name} blocks at lines ${lines}`)
  }

  return matchingBlocks[0]
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
