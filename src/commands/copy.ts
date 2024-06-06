import { copyKeys } from "../lib/copy-keys.ts"
import { rewriteLines } from "../lib/format.ts"
import { parseBlocks, parseMarkdownFile } from "../lib/parser/parser.ts"
import { KeyRange } from "../lib/types.ts"

export function copy(source: string, target: string, { range }: { range?: string }): void {
  const { blocks: sourceBlocks } = parseMarkdownFile(source)
  const sourceLayout = parseBlocks(sourceBlocks)

  const { lines: targetLines, blocks: targetBlocks } = parseMarkdownFile(target)
  const targetLayout = parseBlocks(targetBlocks)

  copyKeys(sourceLayout, targetLayout, { range: parseRange(range) })

  rewriteLines(targetLines, targetBlocks, targetLayout)

  Deno.writeTextFileSync(target, targetLines.join("\n"))
}

function parseRange(value?: string): KeyRange | undefined {
  if (value == null) return

  const match = value.match(/^(\d+)-(\d+)$/)
  if (match == null) {
    throw new Error(`Invalid range: ${value}`)
  }

  return {
    start: Number(match[1]),
    end: Number(match[1]),
  }
}
