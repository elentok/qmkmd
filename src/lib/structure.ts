import { isNotCommentOrBlank } from "./helpers.ts"
import { LayoutError, Structure, StructureCell } from "./types.ts"

export function parseStructure(lines: string[]): Structure {
  const presentLines = lines.filter(isNotCommentOrBlank)

  // const isSplitStructure = presentLines.some((line) => line.includes("||"))
  const s: Structure = { rows: [], separators: [] }

  presentLines.forEach((line, index) => {
    if (!isStructureLineValid(line)) {
      throw new LayoutError(`Invalid structure line: '${line}'`, index + 1)
    }
  })
  const columns = countColumns(presentLines)

  for (const line of presentLines) {
    const row: StructureCell[] = []
    for (let i = 0; i < columns; i++) {
      const value = line.substring(i * 3, i * 3 + 3).trim()
      if (value.length === 0) {
        row.push(null)
      } else if (value === "||") {
        row.push("separator")
      } else {
        row.push({ keyIndex: Number(value) })
      }
    }
    s.rows.push(row)
  }

  // store separator indexes
  s.rows[0].forEach((cell, cellIndex) => {
    if (cell === "separator") {
      s.separators.push(cellIndex)
    }
  })

  // Make sure every row has the same separators
  s.rows.forEach((row, rowIndex) => {
    for (const separator of s.separators) {
      if (row[separator] !== "separator") {
        throw new LayoutError(`Mismatching structure separators`, rowIndex + 1)
      }
    }
  })

  return s
}

const STRUCTURE_RE = /^([\d ][\d ] |\|\| )*( \d|\d\d?)$/

export function isStructureLineValid(line: string): boolean {
  return STRUCTURE_RE.test(line.trimEnd())
}

export function countColumns(validLines: string[]): number {
  const maxLength = validLines.reduce((max, line) => line.length > max ? line.length : max, 0)
  return Math.ceil(maxLength / 3)
}
