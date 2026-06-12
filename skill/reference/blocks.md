# qmkmd block reference

A layout file is parsed into blocks by matching fences against:

```
^```(sh )?(aliases|options|combos|structure|layer:)
```

The optional `sh ` prefix only affects editor highlighting. A block ends at the
next line that is exactly ` ``` `. Inside any block, **blank lines and lines
starting with `#` are ignored** (comments), except inside `structure` where they
are also skipped before the grid is measured.

---

## `structure` (required, exactly one)

Defines the physical key grid in the order keys appear in the QMK `LAYOUT()`
macro. Each number is a key's position; the numbers are arbitrary labels you
choose (they drive `qmkmd copy` ranges), not QMK keycodes.

Rules:

- Each cell is **2 characters wide + 1 trailing space** (3 columns total).
  Single-digit indices are right-aligned: ` 1 `, ` 9 `. Two-digit: `42 `.
- The split separator is `||` (occupies one 3-char cell as `|| `).
- The **last** cell on a line has no trailing space (1 or 2 digits).
- Separators must appear in the **same columns on every row** or parsing fails.
- Empty cells (3 spaces) are allowed for non-rectangular grids (e.g. thumb rows).

A valid line matches: `^([\d ][\d ] |\|\| )*( \d|\d\d?)$` (after trailing spaces
are trimmed).

Example (split keyboard, thumb row partly empty):

````md
```structure
46 61 62 63 64 65    ||    66 67 68 69 70 47
40  1  2  3  4  5    ||     6  7  8  9 10 43
41 11 12 13 14 15    ||    16 17 18 19 20 44
42 21 22 23 24 25 54 || 55 26 27 28 29 30 45
            35 33 31 || 32 34 36
```
````

---

## `layer:NAME` (one or more)

Each block defines one layer; `NAME` becomes `L<NAME-UPPERCASED>` in the
generated `enum layers`. File order = layer index; the first block is layer 0
(the default layer).

Rules:

- The block must have the **same number of present rows** (after ignoring blank/
  comment lines) as the `structure` block.
- Each row must have **exactly as many whitespace-separated tokens as that
  structure row has occupied cells**, including `||` separators. The separator
  token's text is ignored but its slot must be filled — use `||` by convention.
- Tokens are **mappings** (see [mappings.md](mappings.md)). Use `__` for a
  transparent/pass-through key (`_______`).
- Columns need not be hand-aligned — `qmkmd format` aligns them. Token *count*
  is what matters.

Example:

````md
```layer:base
esc  q      w      e       r      t        ||        y    u      i      o      p      bs
tab  a      s      d       f      g        ||        h    j      k      l      ;      '
__   z      x      c       v      b        ||        n    m      ,      .      /      __
                          lctl   mo(nav) spc || ent  bs   ralt
```
````

---

## `aliases` (optional)

Reusable shorthands, one per line: `name = value`. The `value` is itself a
mapping and is expanded recursively, so an alias can resolve to a simple key, a
chord, another alias, or `raw(...)`. Use the `name` anywhere a mapping is
expected.

````md
```aliases
# semantic names for home-row keys
hf = f
hj = j
# tab navigation via chords
tabp = g+s+[
tabn = g+s+]
# drop straight to QMK
meh = raw(KC_MEH)
```
````

---

## `combos` (optional)

Chords that fire an action when pressed together, one per line:
`keys = action`. `keys` is a `+`-joined list; **each key and the action are full
mappings** (expanded recursively, unlike the in-cell chord syntax). Combos are
emitted in definition order as `COMBO(...)` entries.

````md
```combos
# press x and c together → left alt
x+c = lalt
# home-row j and l → escape
hj+l = esc
# switch to a layer
c+v = mo(num)
```
````

---

## `options` (optional)

Build settings as `key = value`; unknown keys are ignored.

| Key        | Effect                                                                 |
| ---------- | --------------------------------------------------------------------- |
| `layoutFn` | Name of the QMK macro to wrap each layer. Default `LAYOUT`.            |
| `imports`  | Comma-separated paths emitted as `#import "..."` at the top of output. |

````md
```options
layoutFn = LAYOUT_split_3x6_3
imports = features/my_feature.h
```
````
