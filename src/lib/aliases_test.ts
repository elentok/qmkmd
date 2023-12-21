import { assertEquals } from "https://deno.land/std@0.204.0/assert/assert_equals.ts"
import { parseAliases } from "./aliases.ts"

Deno.test(function testParseAliases() {
  assertEquals(
    parseAliases({
      name: "aliases",
      lines: ["#comment", "key = value", "lock = c+g+q"],
      startLineNr: 10,
    }),
    new Map([
      ["key", { value: "value", lineNr: 11 }],
      ["lock", { value: "c+g+q", lineNr: 12 }],
    ]),
  )
})
