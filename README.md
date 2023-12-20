# qmkmd

QMK keyboard layouts written in Markdown, see [example](examples/iris.md).

This is a work-in-progress prototype I'm experimenting with to find an easier
way to represent QMK keyboard layout.

## Concept

A keyboard layout will be represented by a markdown file with multiple types of
code blocks:

1. **Structure** - defines the structure of the grid (the way it is structured
   in the keymap.c file). e.g.

   ````markdown
   ```structure
   37 38 39 40 41 42    ||    43 44 45 46 47 48
   49  1  2  3  4  5    ||     6  7  8  9 10 50
   51 11 12 13 14 15    ||    16 17 18 19 20 52
   53 21 22 23 24 25 54 || 55 26 27 28 29 30 56
               31 32 33 || 34 35 36
   ```
   ````

   This block has to be perfectly indented, each cell is exactly 3 characters (2
   for the key index + space). For split keyboards we add `||` between the
   halfs.

2. **Layout** - defines each layout in the keyboard, basically a shorter,
   easier-to-read representation of a call to `LAYOUT()` in QMK. e.g.

   ````md
   ```layer:base
   esc  1      2      3       4      5             ||           6    7      8      9      0      bs
   tab  q      w      e       r      t             ||           y    u      i      o      p      \
   lgui lctl/a lalt/s lgui/d  l(f)/f g             ||           h    l(j)/j rgui/k ralt/l rctl/; '
   lsft z      x      c       l(v)/v b        home || end       n    m      ,      .      /      rsft
                              lctl   osm(lgui) spc || osm(rsft) ent  bs
   ```
   ````

3. **Aliases** - to keep the layer short you can create aliases, e.g.

   ````md
   ```aliases
   # Previous tab
   tabp = lgui + lsft + [
   # Next tab
   tabn = lgui + lsft + ]
   ```
   ````

   You can also enter QMK strings directly:

   ````md
   ```aliases
   # Previous tab
   tabp = LGUI(S(KC_LBRC))
   # Next tab
   tabn = LGUI(S(KC_RBRC))
   ```
   ````

Instead of using QMK KC\_\* we use a shorter format (haven't decided on all of
them yet).

## Installation

For now the easiest way to install it is to clone the repo and add the `bin`
subdirectory to your path, e.g.

```sh
git clone https://github.com/elentok/qmkmd ~/.qmkmd
echo 'PATH=$PATH:~/.qmkmd' >> ~/.zshrc
```

(change to `.bashrc` if you're using bash)

## Usage

To build a markdown file into a header file you can import in keymap.c run:

```sh
qmkmd build layout.md
```

It will create `generated-layout.h` which you can then import into your keymap.c
using:

```c
#include "generated-layout.h"
```

If your keyboard layout uses another function other than `LAYOUT` you can
override it in the `options` block:

````md
```options
layoutFn = MY_LAYOUT
```
````

## TODO

- [ ] Aliases
- [ ] Linter
- [ ] Formatter
