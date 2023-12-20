import { assertEquals } from "https://deno.land/std@0.204.0/assert/assert_equals.ts"
import { assertThrows } from "https://deno.land/std@0.204.0/assert/assert_throws.ts"
import { expandKey } from "./qmk-mapper.ts"
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

Deno.test(function testExpandKey_SimpleKey() {
  assertEquals(expandKey("c", layout), "KC_C")
  assertEquals(expandKey("esc", layout), "KC_ESC")
  assertEquals(expandKey(",", layout), "KC_COMM")
  assertEquals(expandKey("lsft", layout), "KC_LSFT")
})

Deno.test(function testExpandKey_ModTap() {
  assertEquals(expandKey("lsft/f", layout), "LSFT_T(KC_F)")
  assertEquals(expandKey("rgui/,", layout), "RGUI_T(KC_COMM)")
})

Deno.test(function testExpandKey_LayerTap_ValidLayer() {
  assertEquals(
    expandKey("l(f)/f", layout),
    "LT(LF, KC_F)",
  )
})

Deno.test(function testExpandKey_LayerTap_NonExistingLayer() {
  assertThrows(() => {
    expandKey("l(badlayer)/f", layout)
  })
})

Deno.test(function testExpandKey_OneShotMod_ValidMod() {
  assertEquals(
    expandKey("os(lsft)", layout),
    "OSM(MOD_LSFT)",
  )
})

Deno.test(function testExpandKey_OneShotMod_InvalidMod() {
  assertThrows(() => {
    expandKey("os(invalid)", layout)
  })
})
