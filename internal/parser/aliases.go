package parser

import "github.com/elentok/qmkmd/internal/layout"

func ParseAliases(block layout.Block) map[string]layout.Alias {
	present := layout.FilterPresentRows(block)
	aliases := map[string]layout.Alias{}

	for i, line := range present.Lines {
		name, value, ok := layout.ParseVariable(line)
		if !ok {
			continue
		}
		aliases[name] = layout.Alias{
			Value:  value,
			LineNr: present.IndexToLineNr[i],
		}
	}

	return aliases
}
