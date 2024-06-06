import { filterPresentRows } from "../helpers.ts"
import { Block, Layer, LayerCell, LayoutError, Structure } from "../types.ts"

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

export function createLayerRows(structure: Structure): LayerCell[][] {
  return structure.rows.map((row) => {
    return row.map((cell) => {
      if (cell == null || cell === "separator") return cell

      return { mapping: "__" }
    })
  })
}
