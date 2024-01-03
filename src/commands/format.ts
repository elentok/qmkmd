import { rewriteLines } from "../lib/format.ts"
import { parseBlocks, readMarkdownFile } from "../lib/reader.ts"

export function format(input: string): void {
  const { lines, blocks } = readMarkdownFile(input)
  const layout = parseBlocks(blocks)

  rewriteLines(lines, blocks, layout)

  Deno.writeTextFileSync(input, lines.join("\n"))
}
