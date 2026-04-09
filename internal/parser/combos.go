package parser

import "github.com/elentok/qmkmd/internal/layout"

func ParseCombos(block layout.Block) []layout.Combo {
	present := layout.FilterPresentRows(block)
	combos := make([]layout.Combo, 0, len(present.Lines))

	for i, line := range present.Lines {
		name, value, ok := layout.ParseVariable(line)
		if !ok {
			continue
		}
		combos = append(combos, layout.Combo{
			Keys:   name,
			Action: value,
			LineNr: present.IndexToLineNr[i],
		})
	}

	return combos
}
