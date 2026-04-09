package parser

import (
	"testing"

	"github.com/elentok/qmkmd/internal/layout"
)

func TestParseStructureNoSeparators(t *testing.T) {
	t.Parallel()

	got, err := ParseStructure(layout.Block{
		Name:        "structure",
		StartLineNr: 100,
		Lines: []string{
			"",
			"",
			"11 12 13 14 15",
			"16     1  2  3",
			"17  4  5  6  7",
			"",
		},
	})
	if err != nil {
		t.Fatalf("ParseStructure returned error: %v", err)
	}

	if len(got.Separators) != 0 {
		t.Fatalf("expected no separators, got %v", got.Separators)
	}
	wantLines := []int{102, 103, 104}
	for i := range wantLines {
		if got.RowToLine[i] != wantLines[i] {
			t.Fatalf("row line %d mismatch: got %d want %d", i, got.RowToLine[i], wantLines[i])
		}
	}

	assertKey(t, got.Rows[0][0], 11)
	assertKey(t, got.Rows[0][4], 15)
	assertKey(t, got.Rows[1][0], 16)
	assertEmpty(t, got.Rows[1][1])
	assertKey(t, got.Rows[1][2], 1)
	assertKey(t, got.Rows[2][4], 7)
}

func TestParseStructureWithSeparators(t *testing.T) {
	t.Parallel()

	got, err := ParseStructure(layout.Block{
		Name:        "structure",
		StartLineNr: 10,
		Lines: []string{
			"11 12 13 || 16 17 18",
			"# comment",
			"19     1 ||  2  3",
			"",
		},
	})
	if err != nil {
		t.Fatalf("ParseStructure returned error: %v", err)
	}

	if len(got.Separators) != 1 || got.Separators[0] != 3 {
		t.Fatalf("unexpected separators: %v", got.Separators)
	}
	wantLines := []int{10, 12}
	for i := range wantLines {
		if got.RowToLine[i] != wantLines[i] {
			t.Fatalf("row line %d mismatch: got %d want %d", i, got.RowToLine[i], wantLines[i])
		}
	}

	assertKey(t, got.Rows[0][0], 11)
	assertSeparator(t, got.Rows[0][3])
	assertKey(t, got.Rows[0][6], 18)
	assertKey(t, got.Rows[1][0], 19)
	assertEmpty(t, got.Rows[1][1])
	assertKey(t, got.Rows[1][2], 1)
	assertSeparator(t, got.Rows[1][3])
	assertEmpty(t, got.Rows[1][6])
}

func TestIsStructureLineValid(t *testing.T) {
	t.Parallel()

	validLines := []string{
		"11 12 13",
		"1  2  3",
		" 1  2  3",
		" 1     2",
		"01     2   ",
		"01     2 ",
	}
	for _, line := range validLines {
		if !IsStructureLineValid(line) {
			t.Fatalf("expected line to be valid: %q", line)
		}
	}

	invalidLines := []string{
		"hello",
		"11 12 1x",
	}
	for _, line := range invalidLines {
		if IsStructureLineValid(line) {
			t.Fatalf("expected line to be invalid: %q", line)
		}
	}
}

func TestCountColumns(t *testing.T) {
	t.Parallel()

	if got := CountColumns([]string{"11 12 13"}); got != 3 {
		t.Fatalf("expected 3 columns, got %d", got)
	}
	if got := CountColumns([]string{"11 12 13", "1"}); got != 3 {
		t.Fatalf("expected 3 columns, got %d", got)
	}
	if got := CountColumns([]string{" 1  2 3"}); got != 3 {
		t.Fatalf("expected 3 columns, got %d", got)
	}
}

func assertKey(t *testing.T, cell layout.StructureCell, want int) {
	t.Helper()
	if cell.Kind != layout.CellKey || !cell.IsOccupied || cell.KeyIndex != want {
		t.Fatalf("expected key %d, got %+v", want, cell)
	}
}

func assertSeparator(t *testing.T, cell layout.StructureCell) {
	t.Helper()
	if cell.Kind != layout.CellSeparator || !cell.IsOccupied {
		t.Fatalf("expected separator, got %+v", cell)
	}
}

func assertEmpty(t *testing.T, cell layout.StructureCell) {
	t.Helper()
	if cell.IsOccupied || cell.Kind != layout.CellEmpty || cell.KeyIndex != 0 {
		t.Fatalf("expected empty cell, got %+v", cell)
	}
}
