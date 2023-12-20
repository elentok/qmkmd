import { expandMapping } from "./expand-mapping.ts"
import { Layer, LayerError, Layout, LayoutError } from "./types.ts"

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
            throw new LayerError(e, layer, rowIndex + 1, cellIndex + 1)
          }
          if (mapping == null) {
            if (/[\/(+]/.test(cell.mapping)) {
              return { mapping: "???" }
            }
            throw new LayerError(`Invalid mapping '${cell.mapping}`, layer, rowIndex + 1, cellIndex + 1)
          }
          return { mapping }
        }
      })
    }),
  }
}
