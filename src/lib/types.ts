export interface Layout {
  structure: Structure
  layers: Layer[]
}

export interface Structure {
  /** The indexes for the separators */
  separators: number[]
  rows: StructureCell[][]
}

export type StructureCell = { keyIndex: number } | "separator" | null

export interface Layer {
  rows: LayerCell[][]
}

export type LayerCell = LayerCellMapping | "separator" | null

export interface LayerCellMapping {
  mapping: string
}

export class LayoutError extends Error {
  constructor(msg: string, lineNr?: number) {
    super(lineNr != null ? `Error at line #${lineNr}: ${msg}` : msg)
  }
}
