import { expandMapping } from "./expand-mapping.ts"
import { Layer, LayerError, Layout } from "../types.ts"

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
            let msg = "Unknown error"
            if (e instanceof Error) {
              msg = e.message
            } else {
              console.error("Unexpected error:", e)
            }
            throw new LayerError(msg, layer, layer.rowToLineNr[rowIndex], rowIndex + 1, cellIndex + 1)
          }
          if (mapping == null) {
            throw new LayerError(
              `Invalid mapping '${cell.mapping}`,
              layer,
              layer.rowToLineNr[rowIndex],
              rowIndex + 1,
              cellIndex + 1,
            )
          }
          return { mapping }
        }
      })
    }),
  }
}
