export interface Layout {
  structure: Structure
  layers: Layer[]
  options: Options
  aliases?: Aliases
  combos?: Combo[]
}

export interface Options {
  layoutFn: string
  imports?: string[]
}

export type Aliases = Map<string, Alias>

export interface Alias {
  value: string
  lineNr: number
}

export interface Structure {
  /** The indexes for the separators */
  separators: number[]
  rows: StructureCell[][]
  rowToLineNr: number[]
}

export type StructureCell = { keyIndex: number } | "separator" | null

export interface Layer {
  name: string
  rows: LayerCell[][]
  rowToLineNr: number[]
}

export type LayerCell = LayerCellMapping | "separator" | null

export interface LayerCellMapping {
  mapping: string
}

export class LayoutError extends Error {
  constructor(public msg: string, public lineNr?: number) {
    super(lineNr != null ? `L${lineNr}: ${msg}` : msg)
  }
}

export class LayerError extends LayoutError {
  constructor(
    public msg: string,
    public layer: Layer,
    public lineNr?: number,
    public row?: number,
    public col?: number,
  ) {
    super(
      `Error at layer '${layer.name}'${rowColToText(row, col)}: ${msg}`,
      lineNr,
    )
  }
}

function rowColToText(row?: number, col?: number): string {
  const parts = []
  if (row != null) parts.push(`row ${row}`)
  if (col != null) parts.push(`col ${col}`)
  if (parts.length === 0) return ""

  return ` (${parts.join(", ")})`
}

export interface Block {
  name: string
  lines: string[]
  startLineNr: number
}

export interface KeyRange {
  start: number
  end: number
}

export interface Combo {
  keys: string
  action: string
  lineNr: number
}
