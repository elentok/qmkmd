import { rewriteLines } from "../lib/format.ts"
import { parseBlocks, parseMarkdownFile } from "../lib/parser/parser.ts"

export function format(input: string): void {
  const { lines, blocks } = parseMarkdownFile(input)
  const layout = parseBlocks(blocks)

  rewriteLines(lines, blocks, layout)

  Deno.writeTextFileSync(input, lines.join("\n"))
}
