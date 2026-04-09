package parser

import (
	"fmt"
	"strings"

	"github.com/elentok/qmkmd/internal/layout"
)

func ParseLayer(block layout.Block, structure layout.Structure) (layout.Layer, error) {
	name := strings.TrimPrefix(block.Name, "layer:")
	present := layout.FilterPresentRows(block)

	if len(present.Lines) != len(structure.Rows) {
		return layout.Layer{}, &layout.LayoutError{
			Msg:    fmt.Sprintf("Layer '%s' has %d rows while the structure has %d rows", name, len(present.Lines), len(structure.Rows)),
			LineNr: block.StartLineNr,
		}
	}

	layerRows := make([][]layout.LayerCell, 0, len(structure.Rows))
	for rowIndex, structureRow := range structure.Rows {
		line := present.Lines[rowIndex]
		mappings := strings.Fields(strings.TrimSpace(line))

		nonEmptyCells := 0
		for _, cell := range structureRow {
			if cell.IsOccupied {
				nonEmptyCells++
			}
		}
		if len(mappings) != nonEmptyCells {
			return layout.Layer{}, &layout.LayoutError{
				Msg:    fmt.Sprintf("Layer %s row %d has %d mappings but the structure specifies %d", name, rowIndex+1, len(mappings), nonEmptyCells),
				LineNr: present.IndexToLineNr[rowIndex],
			}
		}

		nextMappingIndex := 0
		layerRow := make([]layout.LayerCell, 0, len(structureRow))
		for _, cell := range structureRow {
			switch {
			case !cell.IsOccupied:
				layerRow = append(layerRow, layout.LayerCell{})
			case cell.Kind == layout.CellSeparator:
				layerRow = append(layerRow, layout.LayerCell{Kind: layout.CellSeparator, IsOccupied: true})
				nextMappingIndex++
			default:
				layerRow = append(layerRow, layout.LayerCell{
					Mapping:    mappings[nextMappingIndex],
					Kind:       layout.CellKey,
					IsOccupied: true,
				})
				nextMappingIndex++
			}
		}
		layerRows = append(layerRows, layerRow)
	}

	return layout.Layer{
		Name:      name,
		Rows:      layerRows,
		RowToLine: present.IndexToLineNr,
	}, nil
}

func CreateLayerRows(structure layout.Structure) [][]layout.LayerCell {
	rows := make([][]layout.LayerCell, 0, len(structure.Rows))
	for _, row := range structure.Rows {
		layerRow := make([]layout.LayerCell, 0, len(row))
		for _, cell := range row {
			switch {
			case !cell.IsOccupied:
				layerRow = append(layerRow, layout.LayerCell{})
			case cell.Kind == layout.CellSeparator:
				layerRow = append(layerRow, layout.LayerCell{Kind: layout.CellSeparator, IsOccupied: true})
			default:
				layerRow = append(layerRow, layout.LayerCell{
					Mapping:    "__",
					Kind:       layout.CellKey,
					IsOccupied: true,
				})
			}
		}
		rows = append(rows, layerRow)
	}
	return rows
}
