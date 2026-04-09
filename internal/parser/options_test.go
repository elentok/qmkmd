package parser

import "testing"

func TestParseOptionsNoOptions(t *testing.T) {
	t.Parallel()

	got := ParseOptions(nil)
	if got.LayoutFn != "LAYOUT" {
		t.Fatalf("expected default layout fn, got %q", got.LayoutFn)
	}
	if got.Imports != nil {
		t.Fatalf("expected nil imports, got %v", got.Imports)
	}

	got = ParseOptions([]string{})
	if got.LayoutFn != "LAYOUT" {
		t.Fatalf("expected default layout fn, got %q", got.LayoutFn)
	}
}

func TestParseOptionsWithOptions(t *testing.T) {
	t.Parallel()

	got := ParseOptions([]string{"", "layoutFn = LAYOUT_80_with_macro ", "imports = one, two, three"})
	if got.LayoutFn != "LAYOUT_80_with_macro" {
		t.Fatalf("expected custom layout fn, got %q", got.LayoutFn)
	}

	wantImports := []string{"one", "two", "three"}
	if len(got.Imports) != len(wantImports) {
		t.Fatalf("expected %d imports, got %d", len(wantImports), len(got.Imports))
	}
	for i := range wantImports {
		if got.Imports[i] != wantImports[i] {
			t.Fatalf("import %d mismatch: got %q want %q", i, got.Imports[i], wantImports[i])
		}
	}
}
