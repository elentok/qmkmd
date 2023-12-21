import { filterPresentRows } from "./helpers.ts"
import { Block, LayoutError, Structure, StructureCell } from "./types.ts"

export function parseStructure(block: Block): Structure {
  const { lines, indexToLineNr } = filterPresentRows(block.lines, block.startLineNr)

  const s: Structure = { rows: [], separators: [], rowToLineNr: indexToLineNr }

  lines.forEach((line, index) => {
    if (!isStructureLineValid(line)) {
      throw new LayoutError(`Invalid structure row ${index + 1}: '${line}'`, indexToLineNr[index])
    }
  })
  const columns = countColumns(lines)

  for (const line of lines) {
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
        throw new LayoutError(`Mismatching structure separators at row #${rowIndex + 1}`)
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
