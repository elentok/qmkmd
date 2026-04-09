package format

import (
	"fmt"
	"strings"

	"github.com/elentok/qmkmd/internal/layout"
)

func RewriteLines(lines []string, blocks []layout.Block, parsed layout.Layout) error {
	columnWidths := layout.CalcColumnWidths(parsed.Layers)

	for _, layerBlock := range blocks {
		if !strings.HasPrefix(layerBlock.Name, "layer:") {
			continue
		}

		layerName := strings.TrimSpace(strings.TrimPrefix(layerBlock.Name, "layer:"))
		var current *layout.Layer
		for i := range parsed.Layers {
			if parsed.Layers[i].Name == layerName {
				current = &parsed.Layers[i]
				break
			}
		}
		if current == nil {
			return &layout.LayoutError{Msg: fmt.Sprintf("This is weird, can't find a layer named '%s'", layerName)}
		}

		formattedLines := layout.StringifyLayer(*current, parsed.Structure, columnWidths)
		j := 0
		for i := layerBlock.StartLineNr - 1; i < layerBlock.StartLineNr+len(layerBlock.Lines)-1; i++ {
			if layout.IsNotCommentOrBlank(lines[i]) {
				lines[i] = formattedLines[j]
				j++
			}
		}
	}

	return nil
}
