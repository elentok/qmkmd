package parser

import (
	"regexp"
	"strconv"
	"strings"

	"github.com/elentok/qmkmd/internal/layout"
)

var blockStartRE = regexp.MustCompile("^```(sh )?(aliases|options|combos|structure|layer:)")

func GetRequiredBlock(blocks []layout.Block, name string) (layout.Block, error) {
	block, err := GetOptionalBlock(blocks, name)
	if err != nil {
		return layout.Block{}, err
	}
	if block == nil {
		return layout.Block{}, &layout.LayoutError{Msg: "Missing " + name + " block"}
	}
	return *block, nil
}

func GetOptionalBlock(blocks []layout.Block, name string) (*layout.Block, error) {
	matchingBlocks := make([]layout.Block, 0, 1)
	for _, block := range blocks {
		if block.Name == name {
			matchingBlocks = append(matchingBlocks, block)
		}
	}

	if len(matchingBlocks) > 1 {
		lines := make([]string, 0, len(matchingBlocks))
		for _, block := range matchingBlocks {
			lines = append(lines, strconv.Itoa(block.StartLineNr))
		}
		return nil, &layout.LayoutError{Msg: "Found multiple " + name + " blocks at lines " + strings.Join(lines, ", ")}
	}
	if len(matchingBlocks) == 0 {
		return nil, nil
	}
	return &matchingBlocks[0], nil
}

func FindBlocks(lines []string) []layout.Block {
	blocks := []layout.Block{}
	var block *layout.Block

	for i, line := range lines {
		lineNr := i + 1
		if block == nil {
			if blockStartRE.MatchString(line) {
				name := strings.TrimSpace(strings.TrimPrefix(strings.TrimPrefix(line, "```sh "), "```"))
				block = &layout.Block{
					Name:        name,
					Lines:       []string{},
					StartLineNr: lineNr + 1,
				}
			}
			continue
		}

		if line == "```" {
			blocks = append(blocks, *block)
			block = nil
			continue
		}

		block.Lines = append(block.Lines, line)
	}

	return blocks
}
