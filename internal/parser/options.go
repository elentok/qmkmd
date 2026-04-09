package parser

import (
	"strings"

	"github.com/elentok/qmkmd/internal/layout"
)

func ParseOptions(lines []string) layout.Options {
	options := map[string]string{}

	for _, line := range lines {
		name, value, ok := layout.ParseVariable(line)
		if !ok {
			continue
		}
		options[name] = value
	}

	parsed := layout.Options{
		LayoutFn: "LAYOUT",
	}
	if layoutFn, ok := options["layoutFn"]; ok {
		parsed.LayoutFn = layoutFn
	}
	if imports, ok := options["imports"]; ok {
		parts := strings.Split(imports, ",")
		parsed.Imports = make([]string, 0, len(parts))
		for _, part := range parts {
			parsed.Imports = append(parsed.Imports, strings.TrimSpace(part))
		}
	}

	return parsed
}
