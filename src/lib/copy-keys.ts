import { KeyRange, Layer, Layout, StructureCell } from "./types.ts"
type CopyPlan = Map<KeyCoord, KeyCoord>

export function copyKeys(source: Layout, target: Layout, { range }: { range?: KeyRange }) {
  const plan = createCopyPlan(source, target, { range })

  for (const layer of source.layers) {
    const targetLayer = target.layers.find((l) => l.name === layer.name)
    if (targetLayer == null) {
      console.warn(`Cannot find target layer ${layer.name}, skipping`)
      continue
    }

    copyKeysBetweenLayers(layer, targetLayer, plan)
  }
}

function copyKeysBetweenLayers(source: Layer, target: Layer, plan: CopyPlan): void {
  for (const [sourceCoord, targetCoord] of plan.entries()) {
    target.rows[targetCoord.rowIndex][targetCoord.colIndex] = source.rows[sourceCoord.rowIndex][sourceCoord.colIndex]
  }
}

function createCopyPlan(source: Layout, target: Layout, { range }: { range?: KeyRange }): CopyPlan {
  const plan: CopyPlan = new Map<KeyCoord, KeyCoord>()

  source.structure.rows.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const keyIndex = getKeyIndex(cell)
      if (keyIndex != null && isInRange(keyIndex, range)) {
        const sourceCoord: KeyCoord = { rowIndex, colIndex }
        const targetCoord = findCoord(target, keyIndex)
        if (targetCoord == null) {
          console.warn(`Cannot find target coordinate for key index ${keyIndex}`)
        } else {
          plan.set(sourceCoord, targetCoord)
        }
      }
    })
  })

  return plan
}

function findCoord(layout: Layout, keyIndex: number): KeyCoord | null {
  const { rows } = layout.structure
  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    const row = rows[rowIndex]
    for (let colIndex = 0; colIndex < row.length; colIndex++) {
      if (getKeyIndex(row[colIndex]) === keyIndex) {
        return { rowIndex, colIndex }
      }
    }
  }

  return null
}

function getKeyIndex(cell: StructureCell): number | undefined {
  if (cell == null || cell === "separator") return
  return cell.keyIndex
}

function isInRange(keyIndex: number, range?: KeyRange): boolean {
  if (range == null) return true
  return keyIndex >= range.start && keyIndex <= range.end
}

interface KeyCoord {
  rowIndex: number
  colIndex: number
}

function stringifyKeyCoord({ rowIndex, colIndex }: KeyCoord): string {
  return `${rowIndex},{col}`
}
