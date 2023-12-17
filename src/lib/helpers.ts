import { Layer, LayoutError, SingleLayer } from "./types.ts"

export function isNotCommentOrBlank(line: string): boolean {
  return !/^\s*$/.test(line) && !line.startsWith("#")
}

export function splitLinesForSplitKeyboard(presentLines: string[]): { left: string[]; right: string[] } {
  const splitLines = presentLines.map((line, lineIndex) => {
    const halfs = line.split(" || ")
    if (halfs.length !== 2) {
      throw new LayoutError(`Invalid split keyboard line: '${line}'`, lineIndex + 1)
    }
    return halfs
  })
  return {
    left: splitLines.map((halfs) => halfs[0]),
    right: splitLines.map((halfs) => halfs[1]),
  }
}

export function maxLayerColWidth(layer: Layer): number {
  if ("left" in layer) {
    return Math.max(maxSingleLayerColWidth(layer.left), maxSingleLayerColWidth(layer.right))
  }

  return maxSingleLayerColWidth(layer)
}

export function maxSingleLayerColWidth(layer: SingleLayer): number {
  let maxLength = 0
  for (const row of layer.rows) {
    for (const cell of row) {
      if (cell != null && cell.mapping.length > maxLength) {
        maxLength = cell.mapping.length
      }
    }
  }

  return maxLength
}
