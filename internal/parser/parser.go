package parser

import (
	"strings"

	"github.com/elentok/qmkmd/internal/layout"
)

func ParseLayoutFile(filename string) (layout.Layout, error) {
	_, blocks, err := ParseMarkdownFile(filename)
	if err != nil {
		return layout.Layout{}, err
	}
	return ParseBlocks(blocks)
}

func ParseBlocks(blocks []layout.Block) (layout.Layout, error) {
	var optionsLines []string
	optionsBlock, err := GetOptionalBlock(blocks, "options")
	if err != nil {
		return layout.Layout{}, err
	}
	if optionsBlock != nil {
		optionsLines = optionsBlock.Lines
	}
	options := ParseOptions(optionsLines)

	structureBlock, err := GetRequiredBlock(blocks, "structure")
	if err != nil {
		return layout.Layout{}, err
	}
	structure, err := ParseStructure(structureBlock)
	if err != nil {
		return layout.Layout{}, err
	}

	layers := make([]layout.Layer, 0)
	for _, block := range blocks {
		if !strings.HasPrefix(block.Name, "layer:") {
			continue
		}
		layer, err := ParseLayer(block, structure)
		if err != nil {
			return layout.Layout{}, err
		}
		layers = append(layers, layer)
	}

	var aliases map[string]layout.Alias
	aliasesBlock, err := GetOptionalBlock(blocks, "aliases")
	if err != nil {
		return layout.Layout{}, err
	}
	if aliasesBlock != nil {
		aliases = ParseAliases(*aliasesBlock)
	}

	var combos []layout.Combo
	combosBlock, err := GetOptionalBlock(blocks, "combos")
	if err != nil {
		return layout.Layout{}, err
	}
	if combosBlock != nil {
		combos = ParseCombos(*combosBlock)
	}

	return layout.Layout{
		Options:   options,
		Structure: structure,
		Layers:    layers,
		Aliases:   aliases,
		Combos:    combos,
	}, nil
}
