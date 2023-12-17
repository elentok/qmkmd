import { assertEquals } from "https://deno.land/std@0.204.0/assert/assert_equals.ts"
import { countColumns, isStructureLineValid, parseStructure } from "./structure.ts"

Deno.test(function testParseStructure_SingleStructure() {
  assertEquals(
    parseStructure([
      "11 12 13 14 15",
      "16     1  2  3",
      "17  4  5  6  7",
      "",
    ]),
    {
      rows: [
        [
          { keyIndex: 11 },
          { keyIndex: 12 },
          { keyIndex: 13 },
          { keyIndex: 14 },
          { keyIndex: 15 },
        ],
        [
          { keyIndex: 16 },
          null,
          { keyIndex: 1 },
          { keyIndex: 2 },
          { keyIndex: 3 },
        ],
        [
          { keyIndex: 17 },
          { keyIndex: 4 },
          { keyIndex: 5 },
          { keyIndex: 6 },
          { keyIndex: 7 },
        ],
      ],
    },
  )
})

Deno.test(function testParseStructure_SplitStructure() {
  assertEquals(
    parseStructure([
      "11 12 13 || 16 17 18",
      "19     1 ||  2  3",
      "",
    ]),
    {
      left: {
        rows: [
          [{ keyIndex: 11 }, { keyIndex: 12 }, { keyIndex: 13 }],
          [{ keyIndex: 19 }, null, { keyIndex: 1 }],
        ],
      },
      right: {
        rows: [
          [{ keyIndex: 16 }, { keyIndex: 17 }, { keyIndex: 18 }],
          [{ keyIndex: 2 }, { keyIndex: 3 }, null],
        ],
      },
    },
  )
})

Deno.test(function testIsStructureLineValid() {
  function shouldBeValid(line: string) {
    assertEquals(isStructureLineValid(line), true, `Line '${line}' should be valid`)
  }
  function shouldNotBeValid(line: string) {
    assertEquals(isStructureLineValid(line), false, `Line '${line}' should not be valid`)
  }

  shouldBeValid("11 12 13")
  shouldBeValid("1  2  3")
  shouldBeValid(" 1  2  3")
  shouldBeValid(" 1     2")
  shouldBeValid("01     2   ")
  shouldBeValid("01     2 ")
  shouldNotBeValid("hello")
  shouldNotBeValid("11 12 1x")
})

Deno.test(function testCountColumns() {
  assertEquals(countColumns(["11 12 13"]), 3)
  assertEquals(countColumns(["11 12 13", "1"]), 3)
  assertEquals(countColumns([" 1  2 3"]), 3)
})
