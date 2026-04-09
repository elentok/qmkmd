package parser

import (
	"testing"

	"github.com/elentok/qmkmd/internal/layout"
)

func TestParseCombos(t *testing.T) {
	t.Parallel()

	got := ParseCombos(layout.Block{
		Name:        "combos",
		Lines:       []string{"#comment", "x+c = lalt", "q+w = esc"},
		StartLineNr: 20,
	})

	if len(got) != 2 {
		t.Fatalf("expected 2 combos, got %d", len(got))
	}
	if got[0] != (layout.Combo{Keys: "x+c", Action: "lalt", LineNr: 21}) {
		t.Fatalf("unexpected combo[0]: %+v", got[0])
	}
	if got[1] != (layout.Combo{Keys: "q+w", Action: "esc", LineNr: 22}) {
		t.Fatalf("unexpected combo[1]: %+v", got[1])
	}
}
