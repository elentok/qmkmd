import { Layer } from "./types.ts"

export function isNotCommentOrBlank(line: string): boolean {
  return !/^\s*$/.test(line) && !line.startsWith("#")
}

export function maxLayerColWidth(layer: Layer): number {
  let maxLength = 0
  for (const row of layer.rows) {
    for (const cell of row) {
      if (cell != null && cell !== "separator" && cell.mapping.length > maxLength) {
        maxLength = cell.mapping.length
      }
    }
  }

  return maxLength
}
