import { layerQmkName } from "./layer.ts"
import { Layout } from "./types.ts"

const mods = ["gui", "ctl", "alt", "sft"]
const keys = [
  ..."abcdefghijklmnopqrstuvwxyz0123456789".split(""),
  "esc",
  "tab",
  "left",
  "down",
  "up",
  "right",
  "ent",
  "home",
  "pgup",
  "pgdn",
  "end",
  "spc",
  "wbak", // Web Back
  "wfwd", // Web Forward
  "pscr", // Print Screen
]

for (let i = 1; i < 13; i++) {
  keys.push(`f${i}`)
}

const shortMods = mods.map((m) => m.charAt(0))

function expandShortMod(shortMod: string): string | undefined {
  const index = shortMods.indexOf(shortMod)
  return mods[index]
}

function isValidMod(text: string): boolean {
  if (text.charAt(0) !== "l" && text.charAt(0) !== "r") {
    return false
  }

  return mods.includes(text.substring(1))
}

const simpleMappings = new Map<string, string>(
  [
    ["'", "KC_QUOT"],
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
    ["}", "KC_RCBR"],
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
    ["boot", "QK_BOOT"],
    ["play", "KC_MPLY"],
    ["vol+", "KC_VOLU"],
    ["vol-", "KC_VOLD"],
    ["__", "_______"],
  ],
)

keys.forEach((key) => {
  simpleMappings.set(key, `KC_${key.toUpperCase()}`)
})

mods.forEach((mod) => {
  simpleMappings.set(`l${mod}`, `KC_L${mod.toUpperCase()}`)
  simpleMappings.set(`r${mod}`, `KC_R${mod.toUpperCase()}`)
})

export function expandMapping(mapping: string, layout: Layout): string | undefined {
  return expandRaw(mapping) || expandSimpleMapping(mapping) || expandModOrLayerTap(mapping, layout) ||
    expandOneShotMod(mapping) ||
    expandCombo(mapping) || expandLayerCommand(mapping, layout) || expandAlias(mapping, layout)
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
  const oneShotModMatch = /^osm\((.*)\)$/.exec(mapping)
  if (oneShotModMatch == null) return

  const mod = oneShotModMatch[1]
  if (!isValidMod(mod)) {
    throw new Error(`OneShotMod '${mapping}' has invalid mod '${mod}'`)
  }

  return `OSM(MOD_${mod.toUpperCase()})`
}

const LAYER_COMMANDS = ["df", "mo", "osl", "tg", "to", "tt"]

function expandLayerCommand(mapping: string, layout: Layout): string | undefined {
  const match = /^(.*)\((.*)\)$/.exec(mapping)
  if (match == null) return

  const command = match[1]
  const layerName = match[2]

  if (!LAYER_COMMANDS.includes(command)) {
    throw new Error(`Invalid layer command '${command}'`)
  }

  if (!hasLayer(layout, layerName)) {
    throw new Error(`Layer command '${mapping}' refers to non-existing layer '${layerName}'`)
  }

  return `${command.toUpperCase()}(${layerQmkName(layerName)})`
}

function expandCombo(mapping: string): string | undefined {
  if (!mapping.includes("+")) return

  const rawParts = mapping.split("+")
  const parts = rawParts.map((part, index) => {
    const isLast = index >= (rawParts.length - 1)

    if (!isLast) {
      const fullMod = expandShortMod(part)
      if (fullMod != null) {
        return `L${fullMod.toUpperCase()}`
      }
    }

    const expanded = expandSimpleMapping(part)
    if (expanded == null) {
      throw new Error(`Unable to expand '${part}'`)
    }
    return expanded
  })
  return wrapInParens(parts)
}

function expandAlias(mapping: string, layout: Layout): string | undefined {
  if (layout.aliases == null) return

  const alias = layout.aliases.get(mapping)
  if (alias == null) return

  return expandMapping(alias.value, layout)
}

function wrapInParens(parts: string[], index = 0): string {
  const isLastPart = index >= (parts.length - 1)
  const next = isLastPart ? "" : `(${wrapInParens(parts, index + 1)})`
  return `${parts[index]}${next}`
}

function hasLayer(layout: Layout, name: string): boolean {
  return layout.layers.find((l) => l.name === name) != null
}

function expandRaw(mapping: string): string | undefined {
  const match = /^raw\((.*)\)$/.exec(mapping)
  if (match == null) return

  return match[1]
}
