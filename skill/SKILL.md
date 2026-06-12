---
name: qmkmd
description: >-
  Author and edit qmkmd keyboard-layout files — QMK keymaps written in Markdown.
  Use when editing a *.layout.md file, or any Markdown file that contains qmkmd
  code blocks (```structure, ```layer:NAME, ```aliases, ```combos, ```options).
  Covers the block structure, the shorthand mapping syntax (simple keys, mod-tap,
  layer-tap, one-shot mods, chords, layer commands, aliases, raw), and the build/
  format/copy CLI workflow. Do NOT use merely because a doc quotes qmkmd syntax;
  use it when actually creating or modifying a layout.
---

# qmkmd — QMK layouts in Markdown

qmkmd compiles a Markdown file into a `generated-layout.h` header that you
`#include` into `keymap.c`. The file is a set of fenced code blocks; the `qmkmd`
CLI parses them and emits the `LAYOUT(...)` calls, combos, and layer enum.

## Mental model

A layout file has these blocks (fenced with ` ``` `):

| Block          | Required | Purpose                                                          |
| -------------- | -------- | ---------------------------------------------------------------- |
| `structure`    | **yes**  | The physical key grid: numeric positions in `LAYOUT()` order.    |
| `layer:NAME`   | 1+       | One block per layer; each cell holds a shorthand **mapping**.    |
| `aliases`      | no       | `name = value` shortcuts you can use as mappings.                |
| `combos`       | no       | `keys = action` chords that fire when keys are pressed together. |
| `options`      | no       | `layoutFn`, `imports`.                                           |

The block fence may carry an optional `sh ` prefix purely for editor syntax
highlighting — ` ```sh aliases ` and ` ```aliases ` are equivalent. The closing
fence must be exactly three backticks on their own line.

Layers compile in file order. The **first** `layer:` block is the default layer
(index 0). A layer named `base` becomes `LBASE` in the generated enum.

## The #1 gotcha: alignment and cell counts

The `structure` block is column-sensitive: **each cell is exactly 2 characters
(the key index) plus a trailing space**, single-digit indices are right-padded
(` 1 `), and the split separator is `||`. Every row's separators must line up in
the same columns.

Each `layer:NAME` row must contain **exactly as many whitespace-separated tokens
as that structure row has occupied cells** — and the `||` separators count as
tokens too (their text is ignored, but the position must be filled, by
convention with `||`). A miscount is the most common error.

You do **not** need to hand-align layer columns — `qmkmd format` does that. You
**do** need the right number of tokens per row.

## Workflow when editing a layout

After any edit, validate with the CLI (it is the source of truth — the
shorthand grammar lives in the compiler, not in this reference):

```sh
qmkmd build <file>            # compiles to generated-layout.h; fails loudly on
                              # bad cell counts, unknown mappings, missing layers
qmkmd format <file> --write   # re-aligns all grids in place
```

Run `build` first to catch errors, then `format --write` to tidy. If `qmkmd`
isn't on PATH, install it (`go install github.com/elentok/qmkmd@latest`) or fall
back to careful hand-editing using the references below.

`qmkmd copy <source> <target> [--range A-B] [--write]` copies mappings from one
layout into another, optionally limited to an inclusive key-index range.

## References

- **[reference/blocks.md](reference/blocks.md)** — exact grammar and rules for
  every block type (structure, layer, aliases, combos, options).
- **[reference/mappings.md](reference/mappings.md)** — the full shorthand
  mapping language: the key table, mod-tap, layer-tap, one-shot mods, chords,
  layer commands, aliases, and `raw()`, plus the resolution order.

Read the relevant reference before writing mappings you're unsure of, rather
than guessing at QMK keycodes.
