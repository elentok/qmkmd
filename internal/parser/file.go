package parser

import (
	"os"
	"strings"

	"github.com/elentok/qmkmd/internal/layout"
)

func ParseMarkdownFile(filename string) ([]string, []layout.Block, error) {
	content, err := os.ReadFile(filename)
	if err != nil {
		return nil, nil, err
	}

	lines := strings.Split(string(content), "\n")
	return lines, FindBlocks(lines), nil
}
