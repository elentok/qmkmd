# qmkmd mapping reference

A **mapping** is the shorthand in each `layer:` cell (and in alias values, combo
keys, and combo actions). The compiler tries to expand each mapping in a fixed
order; the **first** form that matches wins:

1. `raw(...)` — literal QMK passthrough
2. Simple key from the table below
3. Mod-tap / layer-tap (`hold/tap`)
4. One-shot mod (`osm(mod)`)
5. In-cell chord (`a+b+c`)
6. Layer command (`mo(layer)`, `to(layer)`, …)
7. Alias lookup

If nothing matches, the build fails with "Invalid mapping".

> The grammar lives in `internal/qmk/writer.go` (`ExpandMapping` +
> `buildSimpleMappings`). When in doubt, `qmkmd build` is the source of truth;
> this file mirrors the compiler as of its writing and may drift.

---

## 1. `raw(...)` — escape hatch

Anything inside `raw(...)` is passed through verbatim to QMK. Use it for
keycodes qmkmd doesn't have shorthand for.

| Mapping        | Output     |
| -------------- | ---------- |
| `raw(KC_MEH)`  | `KC_MEH`   |
| `raw(QK_LEAD)` | `QK_LEAD`  |

---

## 2. Simple keys

Bare names expand to a single `KC_*` (or special) keycode.

**Letters & digits:** `a`–`z`, `0`–`9` → `KC_A` … `KC_9`.

**Function keys:** `f1`–`f12` → `KC_F1` … `KC_F12`.

**Named keys:**

| Shorthand | QMK         | Shorthand | QMK        |
| --------- | ----------- | --------- | ---------- |
| `esc`     | `KC_ESC`    | `spc`     | `KC_SPC`   |
| `tab`     | `KC_TAB`    | `ent`     | `KC_ENT`   |
| `bs`      | `KC_BSPC`   | `del`     | `KC_DEL`   |
| `left`    | `KC_LEFT`   | `right`   | `KC_RIGHT` |
| `up`      | `KC_UP`     | `down`    | `KC_DOWN`  |
| `home`    | `KC_HOME`   | `end`     | `KC_END`   |
| `pgup`    | `KC_PGUP`   | `pgdn`    | `KC_PGDN`  |
| `wbak`    | `KC_WBAK`   | `wfwd`    | `KC_WFWD`  |
| `pscr`    | `KC_PSCR`   |           |            |

**Media / system:**

| Shorthand | QMK        | Shorthand | QMK        |
| --------- | ---------- | --------- | ---------- |
| `play`    | `KC_MPLY`  | `boot`    | `QK_BOOT`  |
| `vol+`    | `KC_VOLU`  | `vol-`    | `KC_VOLD`  |
| `copy`    | `KC_COPY`  | `paste`   | `KC_PSTE`  |

**Modifiers:** `lgui rgui lctl rctl lalt ralt lsft rsft` → `KC_LGUI` … `KC_RSFT`.

**Punctuation & symbols:**

| Sh   | QMK        | Sh   | QMK        | Sh   | QMK        |
| ---- | ---------- | ---- | ---------- | ---- | ---------- |
| `'`  | `KC_QUOT`  | `"`  | `KC_DQUO`  | `quot` | `KC_QUOT` |
| `,`  | `KC_COMM`  | `.`  | `KC_DOT`   | `;`  | `KC_SCLN`  |
| `:`  | `KC_COLN`  | `` ` `` | `KC_GRV` | `~`  | `KC_TILD`  |
| `[`  | `KC_LBRC`  | `]`  | `KC_RBRC`  | `{`  | `KC_LCBR`  |
| `}`  | `KC_RCBR`  | `(`  | `KC_LPRN`  | `)`  | `KC_RPRN`  |
| `<`  | `KC_LABK`  | `>`  | `KC_RABK`  | `=`  | `KC_EQL`   |
| `-`  | `KC_MINS`  | `+`  | `KC_PLUS`  | `_`  | `KC_UNDS`  |
| `\|` | `KC_PIPE`  | `/`  | `KC_SLSH`  | `\`  | `KC_BSLS`  |
| `?`  | `KC_QUES`  | `!`  | `KC_EXLM`  | `@`  | `KC_AT`    |
| `#`  | `KC_HASH`  | `$`  | `KC_DLR`   | `%`  | `KC_PERC`  |
| `^`  | `KC_CIRC`  | `&`  | `KC_AMPR`  | `*`  | `KC_ASTR`  |

**Special:**

| Shorthand     | QMK        | Meaning                          |
| ------------- | ---------- | -------------------------------- |
| `__`          | `_______`  | Transparent / fall through       |
| `no` / `noop` | `KC_NO`    | Does nothing                     |

---

## 3. Mod-tap & layer-tap — `hold/tap`

`hold/tap` produces a key that acts as `hold` when held and `tap` when tapped.
The `tap` side is itself expanded as a mapping (recursively).

- **Mod-tap** — `hold` is a modifier (`lgui rgui lctl rctl lalt ralt lsft rsft`):

  | Mapping  | Output            |
  | -------- | ----------------- |
  | `lctl/a` | `LCTL_T(KC_A)`    |
  | `rsft/;` | `RSFT_T(KC_SCLN)` |

- **Layer-tap** — `hold` is `l(LAYER)`, where `LAYER` must be an existing
  `layer:` block:

  | Mapping   | Output           |
  | --------- | ---------------- |
  | `l(nav)/f`| `LT(LNAV, KC_F)` |

A non-existent layer or an unknown function in the hold slot is a build error.

---

## 4. One-shot mod — `osm(mod)`

Applies the modifier to the next keypress only. `mod` must be a valid modifier.

| Mapping       | Output            |
| ------------- | ----------------- |
| `osm(lsft)`   | `OSM(MOD_LSFT)`   |
| `osm(lgui)`   | `OSM(MOD_LGUI)`   |

---

## 5. In-cell chord — `a+b+c`

A `+`-joined mapping inside a single cell. Every part **except the last** may be
a **short modifier** that wraps the rest; the remaining parts expand via the
simple-key table only (no nested layer commands or mod-taps here).

Short mods: `g`=GUI, `c`=CTRL, `a`=ALT, `s`=SHIFT.

| Mapping  | Output                  | Meaning              |
| -------- | ----------------------- | -------------------- |
| `g+s+[`  | `LGUI(LSFT(KC_LBRC))`   | Gui+Shift+`[`        |
| `c+c`    | `LCTL(KC_C)`            | Ctrl+C               |
| `g+1`    | `LGUI(KC_1)`            | Gui+1                |

> Note: this is different from the `combos` block. In `combos`, the `+`-joined
> keys are *separate physical keys* pressed together, and each is expanded as a
> full mapping. Here, `+` builds a single modified keycode for one cell.

---

## 6. Layer commands — `cmd(layer)`

Switch/toggle layers. `layer` must be an existing `layer:` block; it becomes
`L<NAME>`.

| Command | Output    | Meaning                                  |
| ------- | --------- | ---------------------------------------- |
| `mo`    | `MO(L…)`  | Momentary — active while held            |
| `to`    | `TO(L…)`  | Switch to layer (turn others off)        |
| `tg`    | `TG(L…)`  | Toggle layer on/off                      |
| `tt`    | `TT(L…)`  | Tap-toggle                               |
| `df`    | `DF(L…)`  | Set default layer                        |
| `osl`   | `OSL(L…)` | One-shot layer                           |

Example: `mo(num)` → `MO(LNUM)`, `to(base)` → `TO(LBASE)`.

---

## 7. Aliases

If a token matches a name defined in the `aliases` block, it is replaced by that
alias's value (expanded recursively). Aliases are tried last, so they can't
shadow built-in keys or commands. See [blocks.md](blocks.md#aliases-optional).
