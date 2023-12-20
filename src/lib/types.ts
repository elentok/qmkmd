export interface Layout {
  structure: Structure
  layers: Layer[]
  options: Options
}

export interface Options {
  layoutFn: string
}

export interface Structure {
  /** The indexes for the separators */
  separators: number[]
  rows: StructureCell[][]
}

export type StructureCell = { keyIndex: number } | "separator" | null

export interface Layer {
  name: string
  rows: LayerCell[][]
}

export type LayerCell = LayerCellMapping | "separator" | null

export interface LayerCellMapping {
  mapping: string
}

export class LayoutError extends Error {
  // constructor(msg: string) {
  //   super(lineNr != null ? `Error at line #${lineNr}: ${msg}` : msg)
  // }
}

export class LayerError extends Error {
  constructor(public msg: string, public layer: Layer, public row?: number, public col?: number) {
    super(
      `Error at layer '${layer.name}'${rowColToText(row, col)}: ${msg}`,
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
