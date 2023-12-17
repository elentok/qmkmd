export interface Layout {
  structure: Structure
  layers: Layer[]
}

export type Structure = SingleStructure | SplitStructure

export interface SplitStructure {
  left: SingleStructure
  right: SingleStructure
}

export interface SingleStructure {
  rows: StructureRow[]
}

export type StructureRow = Array<StructureCell | null>

export interface StructureCell {
  keyIndex: number
}

export type Layer = SingleLayer | SplitLayer

export interface SplitLayer {
  left: SingleLayer
  right: SingleLayer
}

export interface SingleLayer {
  rows: LayerRow[]
}

export type LayerRow = Array<LayerCell | null>

export interface LayerCell {
  mapping: string
}

export class LayoutError extends Error {
  constructor(msg: string, lineNr?: number) {
    super(lineNr != null ? `Error at line #${lineNr}: ${msg}` : msg)
  }
}
