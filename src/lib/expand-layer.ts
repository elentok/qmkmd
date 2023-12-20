import { expandMapping } from "./expand-mapping.ts"
import { Layer, Layout, LayoutError } from "./types.ts"

export function expandLayer(layer: Layer, layout: Layout): Layer {
  return {
    ...layer,
    rows: layer.rows.map((row, rowIndex) => {
      return row.map((cell, cellIndex) => {
        if (cell == null || cell === "separator") {
          return cell
        } else {
          let mapping: string | undefined
          try {
            mapping = expandMapping(cell.mapping, layout)
          } catch (e) {
            throw new LayoutError(
              `Layer ${layer.name}: row ${rowIndex + 1}, column ${cellIndex + 1}: ${e}`,
              rowIndex + 1,
            )
          }
          if (mapping == null) {
            if (/[\/(+]/.test(cell.mapping)) {
              return { mapping: "???" }
            }
            throw new LayoutError(
              `Layer ${layer.name}: unknown key '${cell.mapping}' at row ${rowIndex + 1}, column ${cellIndex + 1}`,
              rowIndex + 1,
            )
          }
          return { mapping }
        }
      })
    }),
  }
}
