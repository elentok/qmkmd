import { describe, it } from "jsr:@std/testing/bdd"
import { join } from "jsr:@std/path"
import { expect } from "npm:chai"
import { findBlocks, parseBlocks } from "./reader.ts"

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

const __dirname = new URL(".", import.meta.url).pathname
const exampleLayoutFilename = join(__dirname, "..", "..", "..", "examples", "iris.md")
const exampleLayout = Deno.readTextFileSync(exampleLayoutFilename)

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

describe(parseBlocks.name, () => {
  const blocks = findBlocks(exampleLayout.split("\n"))
  const layout = parseBlocks(blocks)

  it("parses the options block", () => {
    expect(layout.options).to.eql({
      layoutFn: "LAYOUT",
    })
  })

  it("parses the aliases block", () => {
    const aliases = Array.from(layout.aliases!.entries())
    expect(aliases).to.eql([["lock", { value: "c+g+q", lineNr: 12 }]])
  })

  it("parses the combos block", () => {
    expect(layout.combos).to.eql([{ keys: "q+w", action: "esc", lineNr: 16 }])
  })
})
