import { filterPresentRows } from "./helpers.ts"
import { Block, Layer, LayerCell, LayoutError, Structure } from "./types.ts"

export function parseLayer(block: Block, structure: Structure): Layer {
  const name = block.name.replace(/^layer:/, "")
  const { lines, indexToLineNr } = filterPresentRows(block)

  if (lines.length !== structure.rows.length) {
    throw new LayoutError(
      `Layer '${name}' has ${lines.length} rows while the structure has ${structure.rows.length} rows`,
      block.startLineNr,
    )
  }

  const layerRows = structure.rows.map((structureRow, rowIndex) => {
    const line = lines[rowIndex]
    const mappings = line.trim().split(/\s+/)
    const nonNullCells = structureRow.filter((c) => c != null).length
    if (mappings.length !== nonNullCells) {
      throw new LayoutError(
        `Layer ${name} row ${rowIndex + 1} has ${mappings.length} mappings but the structure specifies ${nonNullCells}`,
        indexToLineNr[rowIndex],
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

  return { name, rows: layerRows, rowToLineNr: indexToLineNr }
}

export function stringifyLayer(layer: Layer, structure: Structure, columnWidths?: number[]): string[] {
  const lines: string[] = []
  if (columnWidths == null) {
    columnWidths = calcColumnWidthsForLayer(layer)
  }

  for (let rowIndex = 0; rowIndex < structure.rows.length; rowIndex++) {
    const row = structure.rows[rowIndex]

    const rowParts: string[] = []

    for (let colIndex = 0; colIndex < row.length; colIndex++) {
      const cell = layer.rows[rowIndex][colIndex]

      if (cell === "separator") {
        rowParts.push("||")
      } else {
        rowParts.push((cell?.mapping ?? "").padEnd(columnWidths[colIndex]))
      }
    }

    lines.push(rowParts.join(" ").trimEnd())
  }

  return lines
}

export function calcColumnWidths(layers: Layer[]): number[] {
  const maxColumnWidths = calcColumnWidthsForLayer(layers[0])
  for (let i = 1; i < layers.length; i++) {
    const columnWidths = calcColumnWidthsForLayer(layers[i])
    for (let col = 0; col < columnWidths.length; col++) {
      if (columnWidths[col] > maxColumnWidths[col]) {
        maxColumnWidths[col] = columnWidths[col]
      }
    }
  }
  return maxColumnWidths
}

function calcColumnWidthsForLayer(layer: Layer): number[] {
  const maxColumnWidths = Array.from({ length: layer.rows[0].length }, () => 0)
  for (const row of layer.rows) {
    row.forEach((cell, cellIndex) => {
      if (cell != null && cell !== "separator" && cell.mapping.length > maxColumnWidths[cellIndex]) {
        maxColumnWidths[cellIndex] = cell.mapping.length
      }
    })
  }

  return maxColumnWidths
}

export function layerQmkName(name: string): string {
  return `L${name.toUpperCase()}`
}

export function createLayerRows(structure: Structure): LayerCell[][] {
  return structure.rows.map((row) => {
    return row.map((cell) => {
      if (cell == null || cell === "separator") return cell

      return { mapping: "__" }
    })
  })
}
