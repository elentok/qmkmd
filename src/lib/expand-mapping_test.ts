import { assertEquals } from "https://deno.land/std@0.204.0/assert/assert_equals.ts"
import { assertThrows } from "https://deno.land/std@0.204.0/assert/assert_throws.ts"
import { expandMapping } from "./expand-mapping.ts"
import { Alias, Layout } from "./types.ts"

const layout: Layout = {
  options: { layoutFn: "LAYOUT" },
  structure: { separators: [], rows: [], rowToLineNr: [] },
  aliases: new Map<string, Alias>([["lock", { value: "c+g+q", lineNr: 3 }]]),
  layers: [
    {
      name: "f",
      rows: [],
      rowToLineNr: [],
    },
    {
      name: "base",
      rows: [],
      rowToLineNr: [],
    },
  ],
}

Deno.test(function testExpandMapping_SimpleKey() {
  assertEquals(expandMapping("c", layout), "KC_C")
  assertEquals(expandMapping("esc", layout), "KC_ESC")
  assertEquals(expandMapping(",", layout), "KC_COMM")
  assertEquals(expandMapping("lsft", layout), "KC_LSFT")
})

Deno.test(function testExpandMapping_ModTap() {
  assertEquals(expandMapping("lsft/f", layout), "LSFT_T(KC_F)")
  assertEquals(expandMapping("rgui/,", layout), "RGUI_T(KC_COMM)")
})

Deno.test(function testExpandMapping_LayerTap_ValidLayer() {
  assertEquals(
    expandMapping("l(f)/f", layout),
    "LT(LF, KC_F)",
  )
})

Deno.test(function testExpandMapping_LayerTap_NonExistingLayer() {
  assertThrows(() => {
    expandMapping("l(badlayer)/f", layout)
  })
})

Deno.test(function testExpandMapping_OneShotMod_ValidMod() {
  assertEquals(
    expandMapping("osm(lsft)", layout),
    "OSM(MOD_LSFT)",
  )
})

Deno.test(function testExpandMapping_OneShotMod_InvalidMod() {
  assertThrows(() => {
    expandMapping("osm(invalid)", layout)
  })
})

Deno.test(function testExpandMapping_LayerCommands() {
  assertEquals(expandMapping("df(base)", layout), "DF(LBASE)")
  assertEquals(expandMapping("mo(base)", layout), "MO(LBASE)")
  assertEquals(expandMapping("osl(base)", layout), "OSL(LBASE)")
  assertEquals(expandMapping("tg(base)", layout), "TG(LBASE)")
  assertEquals(expandMapping("to(base)", layout), "TO(LBASE)")
  assertEquals(expandMapping("tt(base)", layout), "TT(LBASE)")

  assertThrows(() => {
    expandMapping("to(invalid)", layout)
  })
})

Deno.test(function testExpandMapping_RawKeycodes() {
  assertEquals(expandMapping("raw(MY_MACRO)", layout), "MY_MACRO")
})

Deno.test(function testExpandMapping_Combo() {
  assertEquals(expandMapping("s+tab", layout), "LSFT(KC_TAB)")
  assertEquals(expandMapping("s+g+tab", layout), "LSFT(LGUI(KC_TAB))")
  assertEquals(expandMapping("c+a", layout), "LCTL(KC_A)")
})

Deno.test(function testExpandMapping_Alias() {
  assertEquals(expandMapping("lock", layout), "LCTL(LGUI(KC_Q))")
})
