import { Layer } from "./types.ts"

export function isCommentOrBlank(line: string): boolean {
  return /^\s*$/.test(line) || line.startsWith("#")
}

export function isNotCommentOrBlank(line: string): boolean {
  return !isCommentOrBlank(line)
}

export interface PresentLines {
  lines: string[]
  indexToLineNr: number[]
}

export function filterPresentRows(lines: string[], firstLineNr: number): PresentLines {
  const indexToLineNr: number[] = []
  const presentLines: string[] = []

  lines.forEach((line, lineIndex) => {
    if (isCommentOrBlank(line)) return

    presentLines.push(line)
    indexToLineNr.push(firstLineNr + lineIndex)
  })

  return {
    lines: presentLines,
    indexToLineNr,
  }
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
