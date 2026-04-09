package parser

import (
	"testing"

	"github.com/elentok/qmkmd/internal/layout"
)

func TestParseAliases(t *testing.T) {
	t.Parallel()

	got := ParseAliases(layout.Block{
		Name:        "aliases",
		Lines:       []string{"#comment", "key = value", "lock = c+g+q"},
		StartLineNr: 10,
	})

	if len(got) != 2 {
		t.Fatalf("expected 2 aliases, got %d", len(got))
	}
	if got["key"] != (layout.Alias{Value: "value", LineNr: 11}) {
		t.Fatalf("unexpected key alias: %+v", got["key"])
	}
	if got["lock"] != (layout.Alias{Value: "c+g+q", LineNr: 12}) {
		t.Fatalf("unexpected lock alias: %+v", got["lock"])
	}
}
