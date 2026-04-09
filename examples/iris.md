# Iris Keyboard Layout

This is an example for the Iris keyboard.

- The core layout is 2x(3x5 + 3) = 36

```sh options
layoutFn = LAYOUT
```

```sh aliases
lock = c+g+q
hf = f
hj = j
hk = k
hd = d
```

```sh combos

# Left mods
x+c = lalt
s+hd = lsft
# shift in L1
up+right = lsft
e+hf = lgui
lgui+a = lctl
lgui+a+s = a+lctl

q+w = g+`

# Right mods
# ,+. = ralt
,+. = to(sel)
hk+l = rsft
hj+i = rgui
;+quot = rctl

l+; = to(num)

# Layer switchers
c+v = mo(num)
x+c+v = mo(snum)
v+b = mo(fkeys)
hd+hf = mo(f)
hj+hk = mo(jk)

# Keys
hj+l = esc
hj+o = =
w+hf = `

# Spotify play/pause
u+i+o = c+s+g+i

# Switch language
m+, = g+1
```

## Keyboard Structure

```structure
46 61 62 63 64 65    ||    66 67 68 69 70 47
40  1  2  3  4  5    ||     6  7  8  9 10 43
41 11 12 13 14 15    ||    16 17 18 19 20 44
42 21 22 23 24 25 54 || 55 26 27 28 29 30 45
            35 33 31 || 32 34 36
```

## Base layer

```layer:base
esc      1        2       3     4     5              ||     6          7        8        9        0        bs
tab      q        w       e     r     t              ||     y          u        i        o        p        \
lgui     a        s       hd    hf    g              ||     h          hj       hk       l        ;        '
lsft     z        x       c     v     b          spc || ent n          m        ,        .        /        rsft
                                lctl  mo(layer1) spc || ent mo(layer2) ralt
```

## Layer1

```layer:layer1
lock     g+s+5    vol-    play  vol+  boot           ||     boot       __       -        +        =        __
__       `        (       )     =     ~              ||     =          _        [        ]        )        __
__       lgui     -       esc   :     $              ||     left       down     up       right    rctl     __
__       lsft     {       }     lalt  >          __  || __  home       ent      bs       end      to(sel)  del
                                __    __         __  || __  __         __
```

## Layer2

```layer:layer2
~        __       __      __    __    __             ||     __         __       *        __       __       __
__       __       vol+    __    __    __             ||     +          7        8        9        =        pgup
__       c+a      lgui    play  __    __             ||     -          4        5        6        0        pgdn
__       __       lsft    __    __    __         __  || __  to(sel)    1        2        3        .        __
                                __    __         __  || __  __         ,
```

## Layer: DF (when DF are held/tapped)

```layer:f
__       __       g+s+4   g+s+5 $     boot           ||     ^          &        *        -        =        __
__       lgui     lsft    __    __    __             ||     =          -        [        ]        pgup     __
__       lalt     lsft    __    __    to(game)       ||     left       down     up       right    $        __
__       lctl     lalt    __    __    __         __  || __  home       ent      bs       __       __       __
                                __    lalt       __  || __  __         f12
```

## Layer: JK (when JK are held/tapped)

```layer:jk
esc      !        g+s+tab g+tab g+s+4 g+s+5          ||     boot       __       __       __       __       __
tab      `        (       )     =     ~              ||     __         __       __       rsft     ralt     __
__       _        -       esc   :     $              ||     __         __       __       rgui     rctl     __
s+tab    <        {       }     >     __         __  || __  __         __       __       ralt     rctl     __
                                __    lalt       __  || __  __         __
```

## Layer: Numbers (when CV is held)

```layer:num
__       __       __      __    __    __             ||     __         __       *        to(base) __       __
__       to(base) vol+    __    __    __             ||     +          7        8        9        =        __
__       c+a      lgui    play  __    __             ||     -          4        5        6        0        /
__       __       lsft    __    __    __         __  || __  0          1        2        3        .        __
                                __    __         __  || __  __         ,
```

## Layer: Shifted Numbers (when XCV is held)

```layer:snum
__       __       __      __    __    __             ||     __         __       *        __       __       __
__       __       vol+    __    __    __             ||     vol+       &        *        (        =        __
__       c+a      lgui    play  __    __             ||     vol-       $        %        ^        0        /
__       __       lsft    __    __    __         __  || __  0          !        @        #        .        __
                                __    __         __  || __  __         ,
```

## Layer: COMDOT (when comma and dot are held/tapped)

```layer:comdot
__       f1       f2      f3    f4    f5             ||     __         __       __       __       __       __
__       __       __      pgup  vol+  __             ||     __         __       __       __       __       __
__       __       __      pgdn  vol-  __             ||     __         __       __       __       __       __
__       __       __      __    play  __         __  || __  __         __       __       __       __       __
                                __    __         __  || __  __         __
```

## Layer: Gaming

```layer:game
esc      1        2       3     4     5              ||     6          7        8        9        0        bs
tab      q        w       e     r     t              ||     y          u        i        o        p        \
lgui     a        s       d     f     g              ||     h          j        k        l        ;        '
lsft     z        x       c     v     b          spc || ent n          m        ,        .        /        rsft
                                lctl  mo(layer1) spc || ent bs         to(base)
```

## FKeys Layer

```layer:fkeys
__       __       __      __    __    __             ||     __         f10      f11      f12      __       __
__       __       __      __    __    __             ||     __         f7       f8       f9       __       __
__       __       __      __    __    __             ||     __         f4       f5       f6       __       __
__       __       __      __    __    __         __  || __  __         f1       f2       f3       __       __
                                __    __         __  || __  __         __
```

## Selection layer

```layer:sel
to(base) __       __      __    __    __             ||     __         __       __       __       __       __
__       to(base) __      __    __    __             ||     g+c        g+z      to(base) __       g+v      g+=
__       lctl     lsft    lalt  lgui  __             ||     left       down     up       right    __       g+-
__       __       g+x     g+c   g+v   __         __  || __  __         ent      bs       a+right  to(base) __
                                __    __         __  || __  __         to(base)
```

```disabled:layer:sel
to(base) __       __        __    __    __             ||     __         __       __       __        __       __
__       to(base) s+a+right __    __    __             ||     g+c        __       __       __        g+v      __
__       __       __        __    __    __             ||     s+left     s+down   s+up     s+right   __       __
__       __       g+x       g+c   g+v   s+a+left   __  || __  s+a+left   __       s+a+left s+a+right to(base) __
                                  __    __         __  || __  __         to(base)
```

## Layer template

```disabled:layer
__   __     __     __      __     __            ||          __  __     __     __     __     __
__   __     __     __      __     __            ||          __  __     __     __     __     __
__   __     __     __      __     __            ||          __  __     __     __     __     __
__   __     __     __      __     __       __   || __       __  __     __     __     __     __
                           __     __       __   || __       __  __
```
