package parser

import (
	"math"
	"regexp"
	"strconv"
	"strings"

	"github.com/elentok/qmkmd/internal/layout"
)

var structureRE = regexp.MustCompile(`^([\d ][\d ] |\|\| )*( \d|\d\d?)$`)

func ParseStructure(block layout.Block) (layout.Structure, error) {
	present := layout.FilterPresentRows(block)
	s := layout.Structure{
		Rows:       [][]layout.StructureCell{},
		Separators: []int{},
		RowToLine:  present.IndexToLineNr,
	}

	for i, line := range present.Lines {
		if !IsStructureLineValid(line) {
			return layout.Structure{}, &layout.LayoutError{
				Msg:    "Invalid structure row " + strconv.Itoa(i+1) + ": '" + line + "'",
				LineNr: present.IndexToLineNr[i],
			}
		}
	}

	columns := CountColumns(present.Lines)
	for _, line := range present.Lines {
		row := make([]layout.StructureCell, 0, columns)
		for i := 0; i < columns; i++ {
			start := i * 3
			end := start + 3
			if start > len(line) {
				row = append(row, layout.StructureCell{})
				continue
			}
			if end > len(line) {
				end = len(line)
			}
			value := strings.TrimSpace(line[start:end])
			switch {
			case value == "":
				row = append(row, layout.StructureCell{})
			case value == "||":
				row = append(row, layout.StructureCell{Kind: layout.CellSeparator, IsOccupied: true})
			default:
				keyIndex, err := strconv.Atoi(value)
				if err != nil {
					return layout.Structure{}, err
				}
				row = append(row, layout.StructureCell{KeyIndex: keyIndex, Kind: layout.CellKey, IsOccupied: true})
			}
		}
		s.Rows = append(s.Rows, row)
	}

	if len(s.Rows) == 0 {
		return s, nil
	}

	for cellIndex, cell := range s.Rows[0] {
		if cell.Kind == layout.CellSeparator {
			s.Separators = append(s.Separators, cellIndex)
		}
	}

	for rowIndex, row := range s.Rows {
		for _, separator := range s.Separators {
			if separator >= len(row) || row[separator].Kind != layout.CellSeparator {
				return layout.Structure{}, &layout.LayoutError{
					Msg: "Mismatching structure separators at row #" + strconv.Itoa(rowIndex+1),
				}
			}
		}
	}

	return s, nil
}

func IsStructureLineValid(line string) bool {
	return structureRE.MatchString(strings.TrimRight(line, " "))
}

func CountColumns(validLines []string) int {
	maxLength := 0
	for _, line := range validLines {
		if len(line) > maxLength {
			maxLength = len(line)
		}
	}
	return int(math.Ceil(float64(maxLength) / 3.0))
}
