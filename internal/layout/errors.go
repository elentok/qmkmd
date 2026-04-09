package layout

import "fmt"

type LayoutError struct {
	Msg    string
	LineNr int
}

func (e *LayoutError) Error() string {
	if e == nil {
		return ""
	}
	if e.LineNr > 0 {
		return fmt.Sprintf("L%d: %s", e.LineNr, e.Msg)
	}
	return e.Msg
}

type LayerError struct {
	Msg    string
	Layer  Layer
	LineNr int
	Row    int
	Col    int
}

func (e *LayerError) Error() string {
	if e == nil {
		return ""
	}
	msg := fmt.Sprintf("Error at layer '%s'%s: %s", e.Layer.Name, rowColToText(e.Row, e.Col), e.Msg)
	if e.LineNr > 0 {
		return fmt.Sprintf("L%d: %s", e.LineNr, msg)
	}
	return msg
}

func rowColToText(row, col int) string {
	parts := make([]string, 0, 2)
	if row > 0 {
		parts = append(parts, fmt.Sprintf("row %d", row))
	}
	if col > 0 {
		parts = append(parts, fmt.Sprintf("col %d", col))
	}
	if len(parts) == 0 {
		return ""
	}
	if len(parts) == 1 {
		return fmt.Sprintf(" (%s)", parts[0])
	}
	return fmt.Sprintf(" (%s, %s)", parts[0], parts[1])
}
