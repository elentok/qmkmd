import { Block, Layer } from "./types.ts"

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

export function filterPresentRows(block: Block): PresentLines {
  const indexToLineNr: number[] = []
  const presentLines: string[] = []

  block.lines.forEach((line, lineIndex) => {
    if (isCommentOrBlank(line)) return

    presentLines.push(line)
    indexToLineNr.push(block.startLineNr + lineIndex)
  })

  return {
    lines: presentLines,
    indexToLineNr,
  }
}

export function parseVariable(line: string): { name: string; value: string } | undefined {
  const eqlIndex = line.indexOf("=")
  if (eqlIndex == null) return

  const name = line.substring(0, eqlIndex).trim()
  const value = line.substring(eqlIndex + 1).trim()

  return { name, value }
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
