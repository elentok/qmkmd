import { layerQmkName } from "./layer.ts"
import { Layer, Layout, LayoutError } from "./types.ts"

const MODS = ["gui", "ctl", "alt", "sft"]
const KEYS = [
  ..."abcdefghijklmnopqrstuvwxyz0123456789".split(""),
  "esc",
  "tab",
  "left",
  "down",
  "up",
  "right",
  "ent",
  "home",
  "end",
  "spc",
]

function isValidMod(text: string): boolean {
  if (text.charAt(0) !== "l" && text.charAt(0) !== "r") {
    return false
  }

  return MODS.includes(text.substring(1))
}

const keycodes = new Map<string, string>(
  [
    ["'", "KC_QUO"],
    ['"', "KC_DQUO"],
    [",", "KC_COMM"],
    [".", "KC_DOT"],
    [".", "KC_DOT"],
    ["bs", "KC_BSPC"],
    ["`", "KC_GRV"],
    [":", "KC_COLN"],
    [";", "KC_SCLN"],
    [",", "KC_COMM"],
    [".", "KC_DOT"],
    ["[", "KC_LBRC"],
    ["]", "KC_RBRC"],
    ["<", "KC_LABK"],
    [">", "KC_RABK"],
    ["{", "KC_LCBR"],
    ["}", "KC_RBRC"],
    ["(", "KC_LPRN"],
    [")", "KC_RPRN"],
    ["~", "KC_TILD"],
    ["=", "KC_EQL"],
    ["-", "KC_MINS"],
    ["+", "KC_PLUS"],
    ["_", "KC_UNDS"],
    ["|", "KC_PIPE"],
    ["/", "KC_SLSH"],
    ["\\", "KC_BSLS"],
    ['"', "KC_DQUO"],
    ["?", "KC_QUES"],
    ["!", "KC_EXLM"],
    ["@", "KC_AT"],
    ["#", "KC_HASH"],
    ["$", "KC_DLR"],
    ["%", "KC_PERC"],
    ["^", "KC_CIRC"],
    ["&", "KC_AMPR"],
    ["*", "KC_ASTR"],
    ["__", "_______"],
  ],
)

KEYS.forEach((key) => {
  keycodes.set(key, `KC_${key.toUpperCase()}`)
})

MODS.forEach((mod) => {
  keycodes.set(`l${mod}`, `KC_L${mod.toUpperCase()}`)
  keycodes.set(`r${mod}`, `KC_R${mod.toUpperCase()}`)
})

export function expandKey(key: string, layout: Layout): string | undefined {
  if (keycodes.has(key)) {
    return keycodes.get(key)
  }

  return expandModOrLayerTap(key, layout) || expandOneShotMod(key, layout)
}

function expandModOrLayerTap(key: string, layout: Layout): string | undefined {
  if (!key.includes("/")) return

  const [hold, tap] = key.split("/")
  const qmkTap = expandKey(tap, layout)
  if (qmkTap == null) {
    return
  }
  if (isValidMod(hold)) {
    return `${hold.toUpperCase()}_T(${qmkTap})`
  }

  const match = /^(.*)\((.*)\)$/.exec(hold)
  if (match != null) {
    const func = match[1]
    const args = match[2]

    if (func === "l") {
      const layerName = args
      if (layout.layers.find((l) => l.name === layerName)) {
        return `LT(${layerQmkName(layerName)}, ${qmkTap})`
      }
      throw new Error(`Mapping ${key} refers to a non-existing layer '${layerName}'`)
    }

    throw new Error(`Mapping '${key}' uses an invalid function '${func}'`)
  }
}

function expandOneShotMod(key: string, layout: Layout): string | undefined {
  const oneShotModMatch = /^os\((.*)\)$/.exec(key)
  if (oneShotModMatch == null) return

  const mod = oneShotModMatch[1]
  if (!isValidMod(mod)) {
    throw new Error(`OneShotMod '${key}' has invalid mod '${mod}'`)
  }

  return `OSM(MOD_${mod.toUpperCase()})`
}

export function expandLayer(layer: Layer, layout: Layout): Layer {
  return {
    ...layer,
    rows: layer.rows.map((row, rowIndex) => {
      return row.map((cell, cellIndex) => {
        if (cell == null || cell === "separator") {
          return cell
        } else {
          let mapping: string | undefined
          try {
            mapping = expandKey(cell.mapping, layout)
          } catch (e) {
            throw new LayoutError(
              `Layer ${layer.name}: row ${rowIndex + 1}, column ${cellIndex + 1}: ${e}`,
              rowIndex + 1,
            )
          }
          if (mapping == null) {
            if (/[\/(+]/.test(cell.mapping)) {
              return { mapping: "???" }
            }
            throw new LayoutError(
              `Layer ${layer.name}: unknown key '${cell.mapping}' at row ${rowIndex + 1}, column ${cellIndex + 1}`,
              rowIndex + 1,
            )
          }
          return { mapping }
        }
      })
    }),
  }
}
