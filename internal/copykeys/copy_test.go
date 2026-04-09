package copykeys

import (
	"testing"

	"github.com/elentok/qmkmd/internal/layout"
	"github.com/elentok/qmkmd/internal/parser"
)

func TestParseRange(t *testing.T) {
	t.Parallel()

	got, err := ParseRange("12-34")
	if err != nil {
		t.Fatalf("ParseRange returned error: %v", err)
	}
	if got.Start != 12 || got.End != 34 {
		t.Fatalf("unexpected range: %+v", got)
	}
}

func TestCopyKeys(t *testing.T) {
	t.Parallel()

	source := mustParseLayout(t, []layout.Block{
		{
			Name:        "structure",
			StartLineNr: 1,
			Lines:       []string{"1  2  3", "4  5  6"},
		},
		{
			Name:        "layer:base",
			StartLineNr: 5,
			Lines:       []string{"a b c", "d e f"},
		},
	})
	target := mustParseLayout(t, []layout.Block{
		{
			Name:        "structure",
			StartLineNr: 1,
			Lines:       []string{"3  2  1", "6  5  4"},
		},
		{
			Name:        "layer:base",
			StartLineNr: 5,
			Lines:       []string{"x y z", "u v w"},
		},
	})

	warnings := CopyKeys(&source, &target, nil)
	if len(warnings) != 0 {
		t.Fatalf("expected no warnings, got %v", warnings)
	}

	assertMapping(t, target.Layers[0].Rows[0][0], "c")
	assertMapping(t, target.Layers[0].Rows[0][1], "b")
	assertMapping(t, target.Layers[0].Rows[0][2], "a")
	assertMapping(t, target.Layers[0].Rows[1][0], "f")
	assertMapping(t, target.Layers[0].Rows[1][2], "d")
}

func TestCopyKeysWithRange(t *testing.T) {
	t.Parallel()

	source := mustParseLayout(t, []layout.Block{
		{
			Name:        "structure",
			StartLineNr: 1,
			Lines:       []string{"1  2  3", "4  5  6"},
		},
		{
			Name:        "layer:base",
			StartLineNr: 5,
			Lines:       []string{"a b c", "d e f"},
		},
	})
	target := mustParseLayout(t, []layout.Block{
		{
			Name:        "structure",
			StartLineNr: 1,
			Lines:       []string{"1  2  3", "4  5  6"},
		},
		{
			Name:        "layer:base",
			StartLineNr: 5,
			Lines:       []string{"x y z", "u v w"},
		},
	})

	warnings := CopyKeys(&source, &target, &layout.KeyRange{Start: 2, End: 4})
	if len(warnings) != 0 {
		t.Fatalf("expected no warnings, got %v", warnings)
	}

	assertMapping(t, target.Layers[0].Rows[0][0], "x")
	assertMapping(t, target.Layers[0].Rows[0][1], "b")
	assertMapping(t, target.Layers[0].Rows[0][2], "c")
	assertMapping(t, target.Layers[0].Rows[1][0], "d")
	assertMapping(t, target.Layers[0].Rows[1][1], "v")
	assertMapping(t, target.Layers[0].Rows[1][2], "w")
}

func mustParseLayout(t *testing.T, blocks []layout.Block) layout.Layout {
	t.Helper()
	parsed, err := parser.ParseBlocks(blocks)
	if err != nil {
		t.Fatalf("ParseBlocks returned error: %v", err)
	}
	return parsed
}

func assertMapping(t *testing.T, cell layout.LayerCell, want string) {
	t.Helper()
	if cell.Mapping != want {
		t.Fatalf("expected mapping %q, got %+v", want, cell)
	}
}
