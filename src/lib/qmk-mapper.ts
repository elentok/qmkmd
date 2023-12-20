import { Layer, LayoutError } from "./types.ts"

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

export function expandKey(key: string): string | undefined {
  if (keycodes.has(key)) {
    return keycodes.get(key)
  }

  if (key.includes("/")) {
    const [hold, tap] = key.split("/")
    const qmkTap = expandKey(tap)
    if (qmkTap == null || !isValidMod(hold)) {
      return
    }

    return `${hold.toUpperCase()}_T(${qmkTap})`
  }
}

export function expandLayer(layer: Layer): Layer {
  return {
    ...layer,
    rows: layer.rows.map((row, rowIndex) => {
      return row.map((cell, cellIndex) => {
        if (cell == null || cell === "separator") {
          return cell
        } else {
          const mapping = expandKey(cell.mapping)
          if (mapping == null) {
            if (/[\/(+]/.test(cell.mapping)) {
              return { mapping: "???" }
            }
            throw new LayoutError(
              `Unknown key '${cell.mapping}' at row ${rowIndex + 1}, column ${cellIndex + 1}`,
              rowIndex + 1,
            )
          }
          return { mapping }
        }
      })
    }),
  }
}
