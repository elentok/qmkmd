package layout

import "strings"

func IsCommentOrBlank(line string) bool {
	trimmed := strings.TrimSpace(line)
	return trimmed == "" || strings.HasPrefix(line, "#")
}

func IsNotCommentOrBlank(line string) bool {
	return !IsCommentOrBlank(line)
}

type PresentLines struct {
	Lines         []string
	IndexToLineNr []int
}

func FilterPresentRows(block Block) PresentLines {
	indexToLineNr := make([]int, 0, len(block.Lines))
	presentLines := make([]string, 0, len(block.Lines))

	for i, line := range block.Lines {
		if IsCommentOrBlank(line) {
			continue
		}
		presentLines = append(presentLines, line)
		indexToLineNr = append(indexToLineNr, block.StartLineNr+i)
	}

	return PresentLines{
		Lines:         presentLines,
		IndexToLineNr: indexToLineNr,
	}
}

func ParseVariable(line string) (name string, value string, ok bool) {
	index := strings.Index(line, "=")
	if index < 0 {
		return "", "", false
	}

	name = strings.TrimSpace(line[:index])
	value = strings.TrimSpace(line[index+1:])
	return name, value, true
}

func CalcColumnWidths(layers []Layer) []int {
	if len(layers) == 0 {
		return nil
	}

	maxColumnWidths := calcColumnWidthsForLayer(layers[0])
	for i := 1; i < len(layers); i++ {
		columnWidths := calcColumnWidthsForLayer(layers[i])
		for col := 0; col < len(columnWidths); col++ {
			if columnWidths[col] > maxColumnWidths[col] {
				maxColumnWidths[col] = columnWidths[col]
			}
		}
	}
	return maxColumnWidths
}

func StringifyLayer(layer Layer, structure Structure, columnWidths []int) []string {
	lines := make([]string, 0, len(structure.Rows))
	if columnWidths == nil {
		columnWidths = calcColumnWidthsForLayer(layer)
	}

	for rowIndex, row := range structure.Rows {
		rowParts := make([]string, 0, len(row))
		for colIndex := range row {
			cell := layer.Rows[rowIndex][colIndex]
			switch {
			case cell.Kind == CellSeparator:
				rowParts = append(rowParts, "||")
			default:
				rowParts = append(rowParts, padEnd(cell.Mapping, columnWidths[colIndex]))
			}
		}
		lines = append(lines, strings.TrimRight(strings.Join(rowParts, " "), " "))
	}

	return lines
}

func calcColumnWidthsForLayer(layer Layer) []int {
	if len(layer.Rows) == 0 {
		return nil
	}

	maxColumnWidths := make([]int, len(layer.Rows[0]))
	for _, row := range layer.Rows {
		for cellIndex, cell := range row {
			if cell.Kind == CellKey && len(cell.Mapping) > maxColumnWidths[cellIndex] {
				maxColumnWidths[cellIndex] = len(cell.Mapping)
			}
		}
	}

	return maxColumnWidths
}

func padEnd(value string, width int) string {
	if len(value) >= width {
		return value
	}
	return value + strings.Repeat(" ", width-len(value))
}
