import { assertEquals } from "https://deno.land/std@0.204.0/assert/assert_equals.ts"
import { assertThrows } from "https://deno.land/std@0.204.0/assert/assert_throws.ts"
import { expandMapping } from "./expand-mapping.ts"
import { Layout } from "./types.ts"

const layout: Layout = {
  options: { layoutFn: "LAYOUT" },
  structure: { separators: [], rows: [] },
  layers: [
    {
      name: "f",
      rows: [],
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
    expandMapping("os(lsft)", layout),
    "OSM(MOD_LSFT)",
  )
})

Deno.test(function testExpandMapping_OneShotMod_InvalidMod() {
  assertThrows(() => {
    expandMapping("os(invalid)", layout)
  })
})

Deno.test(function testExpandMapping_Combo() {
  assertEquals(expandMapping("s+tab", layout), "LSFT(KC_TAB)")
  assertEquals(expandMapping("s+g+tab", layout), "LSFT(LGUI(KC_TAB))")
})