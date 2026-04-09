package parser

import (
	"testing"

	"github.com/elentok/qmkmd/internal/layout"
)

func TestFindBlocks(t *testing.T) {
	t.Parallel()

	lines := []string{
		"",
		"```structure",
		"hello",
		"world",
		"```",
		"",
		"```layer:abc",
		"hello1",
		"world1",
		"",
		"```",
		"",
	}

	got := FindBlocks(lines)
	want := []layout.Block{
		{
			Name:        "structure",
			Lines:       []string{"hello", "world"},
			StartLineNr: 3,
		},
		{
			Name:        "layer:abc",
			Lines:       []string{"hello1", "world1", ""},
			StartLineNr: 8,
		},
	}

	if len(got) != len(want) {
		t.Fatalf("expected %d blocks, got %d", len(want), len(got))
	}
	for i := range want {
		if got[i].Name != want[i].Name || got[i].StartLineNr != want[i].StartLineNr {
			t.Fatalf("block %d metadata mismatch: got %+v want %+v", i, got[i], want[i])
		}
		if len(got[i].Lines) != len(want[i].Lines) {
			t.Fatalf("block %d line count mismatch: got %d want %d", i, len(got[i].Lines), len(want[i].Lines))
		}
		for j := range want[i].Lines {
			if got[i].Lines[j] != want[i].Lines[j] {
				t.Fatalf("block %d line %d mismatch: got %q want %q", i, j, got[i].Lines[j], want[i].Lines[j])
			}
		}
	}
}
