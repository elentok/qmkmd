import { describe, it } from "jsr:@std/testing/bdd"
import { join } from "jsr:@std/path"
import { expect } from "jsr:@std/expect"
import { parseBlocks } from "./parser.ts"
import { findBlocks } from "./blocks.ts"

const __dirname = new URL(".", import.meta.url).pathname
const exampleLayoutFilename = join(__dirname, "..", "..", "..", "examples", "iris.md")
const exampleLayout = Deno.readTextFileSync(exampleLayoutFilename)

describe(parseBlocks.name, () => {
  const blocks = findBlocks(exampleLayout.split("\n"))
  const layout = parseBlocks(blocks)

  it("parses the options block", () => {
    expect(layout.options).toEqual({
      layoutFn: "LAYOUT",
    })
  })

  it("parses the aliases block", () => {
    const aliases = Array.from(layout.aliases!.entries())
    expect(aliases).toEqual([["lock", { value: "c+g+q", lineNr: 12 }]])
  })

  it("parses the combos block", () => {
    expect(layout.combos).toEqual([{ keys: "q+w", action: "esc", lineNr: 16 }])
  })
})
