package qmk

import (
	"strings"
	"testing"

	"github.com/elentok/qmkmd/internal/layout"
)

func TestExpandMapping(t *testing.T) {
	t.Parallel()

	parsed := layout.Layout{
		Options:   layout.Options{LayoutFn: "LAYOUT"},
		Structure: layout.Structure{},
		Aliases: map[string]layout.Alias{
			"lock": {Value: "c+g+q", LineNr: 3},
		},
		Layers: []layout.Layer{
			{Name: "f"},
			{Name: "base"},
		},
	}

	cases := []struct {
		input string
		want  string
	}{
		{"c", "KC_C"},
		{"esc", "KC_ESC"},
		{",", "KC_COMM"},
		{"lsft", "KC_LSFT"},
		{"lsft/f", "LSFT_T(KC_F)"},
		{"rgui/,", "RGUI_T(KC_COMM)"},
		{"l(f)/f", "LT(LF, KC_F)"},
		{"osm(lsft)", "OSM(MOD_LSFT)"},
		{"df(base)", "DF(LBASE)"},
		{"mo(base)", "MO(LBASE)"},
		{"osl(base)", "OSL(LBASE)"},
		{"tg(base)", "TG(LBASE)"},
		{"to(base)", "TO(LBASE)"},
		{"tt(base)", "TT(LBASE)"},
		{"raw(MY_MACRO)", "MY_MACRO"},
		{"s+tab", "LSFT(KC_TAB)"},
		{"s+g+tab", "LSFT(LGUI(KC_TAB))"},
		{"c+a", "LCTL(KC_A)"},
		{"lock", "LCTL(LGUI(KC_Q))"},
	}

	for _, tc := range cases {
		got, err := ExpandMapping(tc.input, parsed)
		if err != nil {
			t.Fatalf("ExpandMapping(%q) returned error: %v", tc.input, err)
		}
		if got != tc.want {
			t.Fatalf("ExpandMapping(%q) = %q, want %q", tc.input, got, tc.want)
		}
	}
}

func TestExpandMappingErrors(t *testing.T) {
	t.Parallel()

	parsed := layout.Layout{
		Options: layout.Options{LayoutFn: "LAYOUT"},
		Layers:  []layout.Layer{{Name: "base"}},
	}

	inputs := []string{
		"l(badlayer)/f",
		"osm(invalid)",
		"to(invalid)",
	}

	for _, input := range inputs {
		if _, err := ExpandMapping(input, parsed); err == nil {
			t.Fatalf("expected error for %q", input)
		}
	}
}

func TestWriteQMKCode(t *testing.T) {
	t.Parallel()

	parsed := layout.Layout{
		Options: layout.Options{LayoutFn: "LAYOUT", Imports: []string{"foo.h"}},
		Structure: layout.Structure{
			Rows: [][]layout.StructureCell{
				{{KeyIndex: 1, Kind: layout.CellKey, IsOccupied: true}, {Kind: layout.CellSeparator, IsOccupied: true}, {KeyIndex: 2, Kind: layout.CellKey, IsOccupied: true}},
			},
		},
		Layers: []layout.Layer{
			{
				Name: "base",
				Rows: [][]layout.LayerCell{
					{{Mapping: "a", Kind: layout.CellKey, IsOccupied: true}, {Kind: layout.CellSeparator, IsOccupied: true}, {Mapping: "b", Kind: layout.CellKey, IsOccupied: true}},
				},
				RowToLine: []int{1},
			},
		},
		Combos: []layout.Combo{{Keys: "a+b", Action: "esc"}},
	}

	lines, err := WriteQMKCode(parsed)
	if err != nil {
		t.Fatalf("WriteQMKCode returned error: %v", err)
	}

	joined := strings.Join(lines, "\n")
	for _, expected := range []string{
		"#import \"foo.h\"",
		"enum layers {",
		"  LBASE = 0,",
		"const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {",
		"[LBASE] = LAYOUT(",
		"KC_A,  /* || */  KC_B",
		"combo_t key_combos[1] = {",
		"COMBO(combo0, KC_ESC)",
	} {
		if !strings.Contains(joined, expected) {
			t.Fatalf("expected output to contain %q\n%s", expected, joined)
		}
	}
}
