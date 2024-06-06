import { assertEquals } from "https://deno.land/std@0.204.0/assert/assert_equals.ts"
import { parseOptions } from "./options.ts"

Deno.test(function testParseOptions_NoOptions() {
  assertEquals(parseOptions(), { layoutFn: "LAYOUT" })
  assertEquals(parseOptions([]), { layoutFn: "LAYOUT" })
})

Deno.test(function testParseOptions_WithOptions() {
  assertEquals(parseOptions(["", "layoutFn = LAYOUT_80_with_macro "]), {
    layoutFn: "LAYOUT_80_with_macro",
  })
})
