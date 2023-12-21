import { assertEquals } from "https://deno.land/std@0.204.0/assert/assert_equals.ts"
import { findBlocks } from "./reader.ts"

const lines = [
  "",
  "```structure",
  "hello",
  "world",
  "```",
  "",
  "```layer:abc",
  "hello1",
  "world1",
  "",
  "```",
  "",
]

Deno.test(function testFindBlocks() {
  assertEquals(findBlocks(lines), [
    {
      name: "structure",
      lines: ["hello", "world"],
      startLineNr: 3,
    },
    {
      name: "layer:abc",
      lines: ["hello1", "world1", ""],
      startLineNr: 8,
    },
  ])
})
