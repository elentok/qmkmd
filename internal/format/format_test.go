package format

import (
	"path/filepath"
	"testing"

	"github.com/elentok/qmkmd/internal/layout"
	"github.com/elentok/qmkmd/internal/parser"
)

func TestRewriteLinesExampleLayerFormatting(t *testing.T) {
	t.Parallel()

	filename := filepath.Join("..", "..", "examples", "iris.md")
	lines, blocks, err := parser.ParseMarkdownFile(filename)
	if err != nil {
		t.Fatalf("ParseMarkdownFile returned error: %v", err)
	}

	parsed, err := parser.ParseBlocks(blocks)
	if err != nil {
		t.Fatalf("ParseBlocks returned error: %v", err)
	}

	if err := RewriteLines(lines, blocks, parsed); err != nil {
		t.Fatalf("RewriteLines returned error: %v", err)
	}

	expected := layout.StringifyLayer(parsed.Layers[0], parsed.Structure, layout.CalcColumnWidths(parsed.Layers))
	if lines[72] != expected[0] {
		t.Fatalf("unexpected rewritten base line: got %q want %q", lines[72], expected[0])
	}
}

func TestStringifyLayer(t *testing.T) {
	t.Parallel()

	structure, err := parser.ParseStructure(layout.Block{
		Name:        "structure",
		StartLineNr: 10,
		Lines: []string{
			"10 11 12 ||  1  2  3",
			"13    14 ||  4  5",
			"15 16    ||  6",
		},
	})
	if err != nil {
		t.Fatalf("ParseStructure returned error: %v", err)
	}

	layerData, err := parser.ParseLayer(layout.Block{
		Name:        "layer:1",
		StartLineNr: 10,
		Lines: []string{
			"a b   c || e f rctl/g",
			"d l(f)/f || h i",
			"x y || j",
		},
	}, structure)
	if err != nil {
		t.Fatalf("ParseLayer returned error: %v", err)
	}

	got := layout.StringifyLayer(layerData, structure, nil)
	want := []string{
		"a b c      || e f rctl/g",
		"d   l(f)/f || h i",
		"x y        || j",
	}
	if len(got) != len(want) {
		t.Fatalf("expected %d lines, got %d", len(want), len(got))
	}
	for i := range want {
		if got[i] != want[i] {
			t.Fatalf("line %d mismatch: got %q want %q", i, got[i], want[i])
		}
	}
}
