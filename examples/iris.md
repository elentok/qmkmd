# Iris Keyboard Layout

This is an example for the Iris keyboard.

- The core layout is 2x(3x5 + 3) = 36

## Keyboard Structure

```structure
37 38 39 40 41 42    ||    43 44 45 46 47 48
49  1  2  3  4  5    ||     6  7  8  9 10 50
51 11 12 13 14 15    ||    16 17 18 19 20 52
53 21 22 23 24 25 54 || 55 26 27 28 29 30 56
            31 32 33 || 34 35 36
```

## Base layer

```layer:base
esc  1      2      3       4      5             ||          6    7      8      9      0      bs
tab  q      w      e       r      t             ||          y    u      i      o      p      \
lgui lctl/a lalt/s lgui/d  l(f)/f g             ||          h    l(j)/j rgui/k ralt/l rctl/; '
lsft z      x      c       l(v)/v b        home || end      n    m      ,      .      /      rsft
                           lctl   osm(lgui) spc || osm(rsft) ent  bs
```

## F layer

```layer:f
__   __     __     __      __     __            ||          __   __     __     __     __     __
__   esc    :      __      __     __            ||          ~    s+tab  tab    =      _      __
__   __     __     __      __     __            ||          left down   up     right  __     __
__   __     __     __      __     __       __   || __       bs   ent    home   end    /      __
                           __     __       __   || __       __   __
```

## J layer

```layer:j
__   __     __     __      __     __            ||          __  __     __     __     __     __
__   esc    :      (       )      __            ||          __  __     __     __     __     __
__   _      -      [       ]      $             ||          __  __     __     __     __     __
__   |      <      {       }      >        __   || __       __  __     __     __     __     __
                           __     __       __   || __       __  __
```

## layer: v

```layer:v
__   __     __     __      __     __            ||          __  __     __     __     __     __
__   __     __     __      __     __            ||          __   7      8      9     __     __
__   __     __     __      __     __            ||          __   4      5      6     __     __
__   __     __     __      __     __       __   || __        0   1      2      3      .     __
                           __     __       __   || __       __  __
```

## layer: ?

```layer
__   __     __     __      __     __            ||          __  __     __     __     __     __
__   __     __     __      __     __            ||          __  __     __     __     __     __
__   __     __     __      __     __            ||          __  __     __     __     __     __
__   __     __     __      __     __       __   || __       __  __     __     __     __     __
                           __     __       __   || __       __  __
```
