import { assertEquals } from "https://deno.land/std@0.204.0/assert/assert_equals.ts"
import { createLayerRows, parseLayer } from "./layer.ts"
import { createStructure } from "../test-helpers.ts"
import { stringifyLayer } from "../layer-helpers.ts"

Deno.test(function testParseLayer_NoSeparators() {
  const structure = createStructure([
    "10 11 12",
    "13    14",
    "15 16",
  ])

  const block = {
    name: "layer:layer1",
    lines: [
      "a b   c",
      "#comment",
      "d l(f)/f",
      "x y",
    ],
    startLineNr: 10,
  }
  assertEquals(parseLayer(block, structure), {
    name: "layer1",
    rows: [
      [{ mapping: "a" }, { mapping: "b" }, { mapping: "c" }],
      [{ mapping: "d" }, null, { mapping: "l(f)/f" }],
      [{ mapping: "x" }, { mapping: "y" }, null],
    ],
    rowToLineNr: [10, 12, 13],
  })
})

Deno.test(function testParseLayer_WithSeparators() {
  const structure = createStructure([
    "10 11 12 ||  1  2  3",
    "13    14 ||  4  5",
    "15 16    ||  6",
  ])

  const block = {
    name: "layer:layer1",
    startLineNr: 10,
    lines: [
      "#comment",
      "a b   c || e f rctl/g",
      "d l(f)/f || h i",
      "x y || j",
    ],
  }
  assertEquals(parseLayer(block, structure), {
    name: "layer1",
    rows: [
      [{ mapping: "a" }, { mapping: "b" }, { mapping: "c" }, "separator", { mapping: "e" }, { mapping: "f" }, {
        mapping: "rctl/g",
      }],
      [{ mapping: "d" }, null, { mapping: "l(f)/f" }, "separator", { mapping: "h" }, { mapping: "i" }, null],
      [{ mapping: "x" }, { mapping: "y" }, null, "separator", { mapping: "j" }, null, null],
    ],
    rowToLineNr: [11, 12, 13],
  })
})

Deno.test(function testStringifyLayer_NoSeparators() {
  const structure = createStructure([
    "10 11 12",
    "13    14",
    "15 16",
  ])

  const block = {
    name: "layer:1",
    startLineNr: 10,
    lines: [
      "a b   c   ",
      "d l(f)/f",
      "x y",
    ],
  }

  const layer = parseLayer(block, structure)

  assertEquals(stringifyLayer(layer, structure), [
    "a b c",
    "d   l(f)/f",
    "x y",
  ])
})

Deno.test(function testStringifyLayer_WithSeparators() {
  const structure = createStructure([
    "10 11 12 ||  1  2  3",
    "13    14 ||  4  5",
    "15 16    ||  6",
  ])

  const block = {
    name: "layer:1",
    startLineNr: 10,
    lines: [
      "a b   c || e f rctl/g",
      "d l(f)/f || h i",
      "x y || j",
    ],
  }

  const layer = parseLayer(block, structure)

  assertEquals(stringifyLayer(layer, structure), [
    "a b c      || e f rctl/g",
    "d   l(f)/f || h i",
    "x y        || j",
  ])
})

Deno.test(function testCreateLayer() {
  const structure = createStructure([
    "10 11 12",
    "13    14",
    "15 16",
  ])

  assertEquals(createLayerRows(structure), [
    [{ mapping: "__" }, { mapping: "__" }, { mapping: "__" }],
    [{ mapping: "__" }, null, { mapping: "__" }],
    [{ mapping: "__" }, { mapping: "__" }, null],
  ])
})

Deno.test(function testParseLayer_WithSeparators() {
  const structure = createStructure([
    "10 11 12 ||  1  2  3",
    "13    14 ||  4  5",
    "15 16    ||  6",
  ])

  const block = {
    name: "layer:layer1",
    startLineNr: 10,
    lines: [
      "#comment",
      "a b   c || e f rctl/g",
      "d l(f)/f || h i",
      "x y || j",
    ],
  }
  assertEquals(parseLayer(block, structure), {
    name: "layer1",
    rows: [
      [{ mapping: "a" }, { mapping: "b" }, { mapping: "c" }, "separator", { mapping: "e" }, { mapping: "f" }, {
        mapping: "rctl/g",
      }],
      [{ mapping: "d" }, null, { mapping: "l(f)/f" }, "separator", { mapping: "h" }, { mapping: "i" }, null],
      [{ mapping: "x" }, { mapping: "y" }, null, "separator", { mapping: "j" }, null, null],
    ],
    rowToLineNr: [11, 12, 13],
  })
})
