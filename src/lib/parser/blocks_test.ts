import { describe, it } from "jsr:@std/testing/bdd"
import { expect } from "npm:chai"
import { findBlocks } from "./blocks.ts"

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

describe(findBlocks.name, () => {
  it("identifies the blocks", () => {
    expect(findBlocks(lines)).to.eql([
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
})
