package parser

import (
	"path/filepath"
	"testing"
)

func TestParseBlocksFromExample(t *testing.T) {
	t.Parallel()

	filename := filepath.Join("..", "..", "examples", "iris.md")
	_, blocks, err := ParseMarkdownFile(filename)
	if err != nil {
		t.Fatalf("ParseMarkdownFile returned error: %v", err)
	}

	parsed, err := ParseBlocks(blocks)
	if err != nil {
		t.Fatalf("ParseBlocks returned error: %v", err)
	}

	if parsed.Options.LayoutFn != "LAYOUT" {
		t.Fatalf("expected layout fn LAYOUT, got %q", parsed.Options.LayoutFn)
	}
	if len(parsed.Aliases) == 0 {
		t.Fatalf("expected aliases to be parsed")
	}
	lock, ok := parsed.Aliases["lock"]
	if !ok {
		t.Fatalf("expected lock alias to exist")
	}
	if lock.Value != "c+g+q" || lock.LineNr != 12 {
		t.Fatalf("unexpected lock alias: %+v", lock)
	}
	if len(parsed.Combos) == 0 {
		t.Fatalf("expected combos to be parsed")
	}
	if parsed.Combos[0].Keys != "x+c" || parsed.Combos[0].Action != "lalt" || parsed.Combos[0].LineNr != 22 {
		t.Fatalf("unexpected first combo: %+v", parsed.Combos[0])
	}
	if len(parsed.Layers) == 0 {
		t.Fatalf("expected layers to be parsed")
	}
	if parsed.Layers[0].Name != "base" {
		t.Fatalf("expected first layer to be base, got %q", parsed.Layers[0].Name)
	}
}
