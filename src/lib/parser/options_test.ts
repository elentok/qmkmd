import { assertEquals } from "https://deno.land/std@0.204.0/assert/assert_equals.ts"
import { expect } from "jsr:@std/expect"
import { parseOptions } from "./options.ts"

Deno.test(function testParseOptions_NoOptions() {
  expect(parseOptions()).toEqual({ layoutFn: "LAYOUT" })
  expect(parseOptions([])).toEqual({ layoutFn: "LAYOUT" })
})

Deno.test(function testParseOptions_WithOptions() {
  assertEquals(parseOptions(["", "layoutFn = LAYOUT_80_with_macro ", "imports = one, two, three"]), {
    layoutFn: "LAYOUT_80_with_macro",
    imports: ["one", "two", "three"],
  })
})
