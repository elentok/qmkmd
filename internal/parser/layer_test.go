package parser

import (
	"testing"

	"github.com/elentok/qmkmd/internal/layout"
)

func TestParseLayerNoSeparators(t *testing.T) {
	t.Parallel()

	structure := mustCreateStructure(t, []string{
		"10 11 12",
		"13    14",
		"15 16",
	})

	layer, err := ParseLayer(layout.Block{
		Name: "layer:layer1",
		Lines: []string{
			"a b   c",
			"#comment",
			"d l(f)/f",
			"x y",
		},
		StartLineNr: 10,
	}, structure)
	if err != nil {
		t.Fatalf("ParseLayer returned error: %v", err)
	}

	if layer.Name != "layer1" {
		t.Fatalf("expected layer1, got %q", layer.Name)
	}
	wantLines := []int{10, 12, 13}
	for i := range wantLines {
		if layer.RowToLine[i] != wantLines[i] {
			t.Fatalf("row line %d mismatch: got %d want %d", i, layer.RowToLine[i], wantLines[i])
		}
	}
	assertLayerMapping(t, layer.Rows[0][0], "a")
	assertLayerMapping(t, layer.Rows[0][1], "b")
	assertLayerMapping(t, layer.Rows[0][2], "c")
	assertLayerMapping(t, layer.Rows[1][0], "d")
	assertLayerEmpty(t, layer.Rows[1][1])
	assertLayerMapping(t, layer.Rows[1][2], "l(f)/f")
	assertLayerMapping(t, layer.Rows[2][0], "x")
	assertLayerMapping(t, layer.Rows[2][1], "y")
	assertLayerEmpty(t, layer.Rows[2][2])
}

func TestParseLayerWithSeparators(t *testing.T) {
	t.Parallel()

	structure := mustCreateStructure(t, []string{
		"10 11 12 ||  1  2  3",
		"13    14 ||  4  5",
		"15 16    ||  6",
	})

	layer, err := ParseLayer(layout.Block{
		Name:        "layer:layer1",
		StartLineNr: 10,
		Lines: []string{
			"#comment",
			"a b   c || e f rctl/g",
			"d l(f)/f || h i",
			"x y || j",
		},
	}, structure)
	if err != nil {
		t.Fatalf("ParseLayer returned error: %v", err)
	}

	wantLines := []int{11, 12, 13}
	for i := range wantLines {
		if layer.RowToLine[i] != wantLines[i] {
			t.Fatalf("row line %d mismatch: got %d want %d", i, layer.RowToLine[i], wantLines[i])
		}
	}
	assertLayerMapping(t, layer.Rows[0][0], "a")
	assertLayerMapping(t, layer.Rows[0][2], "c")
	assertLayerSeparator(t, layer.Rows[0][3])
	assertLayerMapping(t, layer.Rows[0][6], "rctl/g")
	assertLayerMapping(t, layer.Rows[1][0], "d")
	assertLayerEmpty(t, layer.Rows[1][1])
	assertLayerSeparator(t, layer.Rows[1][3])
	assertLayerMapping(t, layer.Rows[1][5], "i")
	assertLayerMapping(t, layer.Rows[2][0], "x")
	assertLayerSeparator(t, layer.Rows[2][3])
	assertLayerMapping(t, layer.Rows[2][4], "j")
	assertLayerEmpty(t, layer.Rows[2][6])
}

func TestCreateLayerRows(t *testing.T) {
	t.Parallel()

	structure := mustCreateStructure(t, []string{
		"10 11 12 ||  1  2  3",
		"13    14 ||  4  5",
	})

	rows := CreateLayerRows(structure)
	assertLayerMapping(t, rows[0][0], "__")
	assertLayerSeparator(t, rows[0][3])
	assertLayerMapping(t, rows[1][0], "__")
	assertLayerEmpty(t, rows[1][1])
	assertLayerMapping(t, rows[1][2], "__")
}

func mustCreateStructure(t *testing.T, lines []string) layout.Structure {
	t.Helper()
	structure, err := ParseStructure(layout.Block{
		Name:        "structure",
		StartLineNr: 10,
		Lines:       lines,
	})
	if err != nil {
		t.Fatalf("ParseStructure returned error: %v", err)
	}
	return structure
}

func assertLayerMapping(t *testing.T, cell layout.LayerCell, want string) {
	t.Helper()
	if cell.Kind != layout.CellKey || !cell.IsOccupied || cell.Mapping != want {
		t.Fatalf("expected mapping %q, got %+v", want, cell)
	}
}

func assertLayerSeparator(t *testing.T, cell layout.LayerCell) {
	t.Helper()
	if cell.Kind != layout.CellSeparator || !cell.IsOccupied {
		t.Fatalf("expected separator, got %+v", cell)
	}
}

func assertLayerEmpty(t *testing.T, cell layout.LayerCell) {
	t.Helper()
	if cell.IsOccupied || cell.Kind != layout.CellEmpty || cell.Mapping != "" {
		t.Fatalf("expected empty cell, got %+v", cell)
	}
}
