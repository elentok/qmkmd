import { assertEquals } from "https://deno.land/std@0.204.0/assert/assert_equals.ts"
import { expandKey } from "./qmk-mapper.ts"

Deno.test(function testExpandKey_SimpleKey() {
  assertEquals(expandKey("c"), "KC_C")
  assertEquals(expandKey("esc"), "KC_ESC")
  assertEquals(expandKey(","), "KC_COMM")
  assertEquals(expandKey("lsft"), "KC_LSFT")
})

Deno.test(function testExpandKey_ModTap() {
  assertEquals(expandKey("lsft/f"), "LSFT_T(KC_F)")
  assertEquals(expandKey("rgui/,"), "RGUI_T(KC_COMM)")
})
