import { assertEquals } from "https://deno.land/std@0.204.0/assert/assert_equals.ts"
import { filterPresentRows } from "./helpers.ts"

Deno.test(function testFilterPresentRows() {
  assertEquals(
    filterPresentRows({
      name: "theName",
      lines: [
        "one",
        "",
        "#comment",
        "three",
        "four",
        "#comment2",
        "five",
      ],
      startLineNr: 10,
    }),
    {
      lines: ["one", "three", "four", "five"],
      indexToLineNr: [10, 13, 14, 16],
    },
  )
})
