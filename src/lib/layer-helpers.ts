import { Layer, Structure } from "./types.ts"

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
