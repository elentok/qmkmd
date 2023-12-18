import { isNotCommentOrBlank, maxLayerColWidth } from "./helpers.ts"
import { Layer, LayerCell, LayoutError, Structure } from "./types.ts"

export function parseLayer(name: string, lines: string[], structure: Structure): Layer {
  const presentLines = lines.filter(isNotCommentOrBlank)

  if (presentLines.length !== structure.rows.length) {
    throw new LayoutError(
      `Layer ${name} has ${presentLines.length} rows while the structure has ${structure.rows.length} rows`,
    )
  }

  const layerRows = structure.rows.map((structureRow, rowIndex) => {
    const line = presentLines[rowIndex]
    const mappings = line.trim().split(/\s+/)
    const nonNullCells = structureRow.filter((c) => c != null).length
    if (mappings.length !== nonNullCells) {
      throw new LayoutError(
        `Layer ${name} row ${
          rowIndex + 1
        } has ${mappings.length} mappings, but the structure specifies ${nonNullCells}`,
      )
    }

    let nextMappingIndex = 0
    return structureRow.map((cell) => {
      if (cell == null) {
        return null
      } else if (cell === "separator") {
        nextMappingIndex++
        return "separator"
      } else {
        return { mapping: mappings[nextMappingIndex++] }
      }
    })
  })

  return { rows: layerRows }
}

export function stringifyLayer(layer: Layer, structure: Structure): string[] {
  const lines: string[] = []
  const colWidth = maxLayerColWidth(layer)

  for (let rowIndex = 0; rowIndex < structure.rows.length; rowIndex++) {
    const row = structure.rows[rowIndex]

    const rowParts: string[] = []

    for (let colIndex = 0; colIndex < row.length; colIndex++) {
      const cell = layer.rows[rowIndex][colIndex]

      if (cell === "separator") {
        rowParts.push("||")
      } else {
        rowParts.push((cell?.mapping ?? "").padEnd(colWidth))
      }
    }

    lines.push(rowParts.join(" ").trimEnd())
  }

  return lines
}
