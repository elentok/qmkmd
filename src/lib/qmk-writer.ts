import { calcColumnWidths } from "./layer.ts"
import { expandLayer } from "./qmk-mapper.ts"
import { Layout } from "./types.ts"

export function writeQmkCode(layout: Layout): string[] {
  const { options: o, structure: s } = layout

  const lines = [
    "const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {",
  ]

  const expandedLayers = layout.layers.map(expandLayer)
  const columnWidths = calcColumnWidths(expandedLayers)

  for (const layer of expandedLayers) {
    lines.push(`  [${layer.name.toUpperCase()}] = ${o.layoutFn}(`)

    for (let rowIndex = 0; rowIndex < s.rows.length; rowIndex++) {
      const row = s.rows[rowIndex]

      const rowParts: string[] = []

      for (let colIndex = 0; colIndex < row.length; colIndex++) {
        const cell = layer.rows[rowIndex][colIndex]
        const colWidth = columnWidths[colIndex] + 1

        if (cell === "separator") {
          rowParts.push(" /* || */ ")
        } else if (cell == null) {
          rowParts.push("".padEnd(colWidth))
        } else {
          rowParts.push(`${cell.mapping},`.padEnd(colWidth))
        }
      }

      const line = "    " + rowParts.join(" ").trimEnd()
      lines.push(line)
    }

    lines[lines.length - 1] = lines[lines.length - 1].replace(/,$/, "")

    lines.push("  ),")
  }

  lines.push("}")
  return lines
}
