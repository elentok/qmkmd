import { isNotCommentOrBlank } from "../lib/helpers.ts"
import { calcColumnWidths, stringifyLayer } from "../lib/layer.ts"
import { parseBlocks, readMarkdownFile } from "../lib/reader.ts"
import { LayoutError } from "../lib/types.ts"

export function format(input: string): void {
  const { lines, blocks } = readMarkdownFile(input)
  const layout = parseBlocks(blocks)

  const columnWidths = calcColumnWidths(layout.layers)
  blocks.filter((b) => b.name.startsWith("layer:")).forEach((layerBlock) => {
    const layerName = layerBlock.name.replace("layer:", "").trim()
    const layer = layout.layers.find((l) => l.name === layerName)
    if (layer == null) {
      throw new LayoutError(`This is weird, can't find a layer named '${layerName}`)
    }
    const formattedLines = stringifyLayer(layer, layout.structure, columnWidths)

    let j = 0
    for (let i = layerBlock.startLineNr; i < layerBlock.endLineNr - 1; i++) {
      if (isNotCommentOrBlank(lines[i])) {
        lines[i] = formattedLines[j++]
      }
    }
  })

  console.log(lines.join("\n"))
}
