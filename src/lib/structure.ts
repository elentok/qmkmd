import { isNotCommentOrBlank, splitLinesForSplitKeyboard } from "./helpers.ts"
import { LayoutError, SingleStructure, Structure, StructureCell } from "./types.ts"

export function parseStructure(lines: string[]): Structure {
  const presentLines = lines.filter(isNotCommentOrBlank)

  const isSplitStructure = presentLines.some((line) => line.includes("||"))
  if (isSplitStructure) {
    const { left, right } = splitLinesForSplitKeyboard(presentLines)
    return {
      left: parseSingleStructure(left),
      right: parseSingleStructure(right),
    }
  } else {
    return parseSingleStructure(presentLines)
  }
}

function parseSingleStructure(presentLines: string[]): SingleStructure {
  const s: SingleStructure = { rows: [] }

  presentLines.forEach((line, index) => {
    if (!isStructureLineValid(line)) {
      throw new LayoutError(`Invalid structure line: '${line}'`, index + 1)
    }
  })
  const columns = countColumns(presentLines)

  for (const line of presentLines) {
    const row: Array<StructureCell | null> = []
    for (let i = 0; i < columns; i++) {
      const value = line.substring(i * 3, i * 3 + 3).trim()
      if (value.length === 0) {
        row.push(null)
      } else {
        row.push({ keyIndex: Number(value) })
      }
    }
    s.rows.push(row)
  }

  return s
}

const STRUCTURE_RE = /^([\d ][\d ] )*( \d|\d\d?)$/

export function isStructureLineValid(line: string): boolean {
  return STRUCTURE_RE.test(line.trimEnd())
}

export function countColumns(validLines: string[]): number {
  const maxLength = validLines.reduce((max, line) => line.length > max ? line.length : max, 0)
  return Math.ceil(maxLength / 3)
}
