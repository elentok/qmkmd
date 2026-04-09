package layout

import "testing"

func TestFilterPresentRows(t *testing.T) {
	t.Parallel()

	got := FilterPresentRows(Block{
		Name: "theName",
		Lines: []string{
			"one",
			"",
			"#comment",
			"three",
			"four",
			"#comment2",
			"five",
		},
		StartLineNr: 10,
	})

	want := PresentLines{
		Lines:         []string{"one", "three", "four", "five"},
		IndexToLineNr: []int{10, 13, 14, 16},
	}

	if len(got.Lines) != len(want.Lines) {
		t.Fatalf("expected %d lines, got %d", len(want.Lines), len(got.Lines))
	}
	for i := range want.Lines {
		if got.Lines[i] != want.Lines[i] {
			t.Fatalf("line %d: expected %q, got %q", i, want.Lines[i], got.Lines[i])
		}
	}
	for i := range want.IndexToLineNr {
		if got.IndexToLineNr[i] != want.IndexToLineNr[i] {
			t.Fatalf("line number %d: expected %d, got %d", i, want.IndexToLineNr[i], got.IndexToLineNr[i])
		}
	}
}
