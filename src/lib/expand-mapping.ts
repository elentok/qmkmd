import { layerQmkName } from "./layer.ts"
import { Layout } from "./types.ts"

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

const SHORT_MODS = MODS.map((m) => m.charAt(0))

function expandShortMod(shortMod: string): string | undefined {
  const index = SHORT_MODS.indexOf(shortMod)
  return MODS[index]
}

function isValidMod(text: string): boolean {
  if (text.charAt(0) !== "l" && text.charAt(0) !== "r") {
    return false
  }

  return MODS.includes(text.substring(1))
}

const simpleMappings = new Map<string, string>(
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
  simpleMappings.set(key, `KC_${key.toUpperCase()}`)
})

MODS.forEach((mod) => {
  simpleMappings.set(`l${mod}`, `KC_L${mod.toUpperCase()}`)
  simpleMappings.set(`r${mod}`, `KC_R${mod.toUpperCase()}`)
})

export function expandMapping(mapping: string, layout: Layout): string | undefined {
  return expandSimpleMapping(mapping) || expandModOrLayerTap(mapping, layout) || expandOneShotMod(mapping) ||
    expandCombo(mapping)
}

function expandSimpleMapping(mapping: string): string | undefined {
  return simpleMappings.get(mapping)
}

function expandModOrLayerTap(mapping: string, layout: Layout): string | undefined {
  if (!mapping.includes("/")) return

  const [hold, tap] = mapping.split("/")
  const qmkTap = expandMapping(tap, layout)
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
      throw new Error(`Mapping ${mapping} refers to a non-existing layer '${layerName}'`)
    }

    throw new Error(`Mapping '${mapping}' uses an invalid function '${func}'`)
  }
}

function expandOneShotMod(mapping: string): string | undefined {
  const oneShotModMatch = /^os\((.*)\)$/.exec(mapping)
  if (oneShotModMatch == null) return

  const mod = oneShotModMatch[1]
  if (!isValidMod(mod)) {
    throw new Error(`OneShotMod '${mapping}' has invalid mod '${mod}'`)
  }

  return `OSM(MOD_${mod.toUpperCase()})`
}

function expandCombo(mapping: string): string | undefined {
  if (!mapping.includes("+")) return

  const parts = mapping.split("+").map((part) => {
    const fullMod = expandShortMod(part)
    if (fullMod != null) {
      return `L${fullMod.toUpperCase()}`
    }

    const expanded = expandSimpleMapping(part)
    if (expanded == null) {
      throw new Error("Unable to expand '${part}'")
    }
    return expanded
  })
  return wrapInParens(parts)
}

function wrapInParens(parts: string[], index = 0): string {
  const isLastPart = index >= (parts.length - 1)
  const next = isLastPart ? "" : `(${wrapInParens(parts, index + 1)})`
  return `${parts[index]}${next}`
}
