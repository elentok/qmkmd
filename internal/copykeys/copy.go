package copykeys

import (
	"fmt"
	"strconv"
	"strings"

	"github.com/elentok/qmkmd/internal/layout"
)

type keyCoord struct {
	rowIndex int
	colIndex int
}

type copyPair struct {
	source keyCoord
	target keyCoord
}

func CopyKeys(source, target *layout.Layout, keyRange *layout.KeyRange) []string {
	plan, warnings := createCopyPlan(*source, *target, keyRange)

	for _, sourceLayer := range source.Layers {
		targetLayer := findLayer(target.Layers, sourceLayer.Name)
		if targetLayer == nil {
			warnings = append(warnings, fmt.Sprintf("Cannot find target layer %s, skipping", sourceLayer.Name))
			continue
		}
		copyKeysBetweenLayers(sourceLayer, targetLayer, plan)
	}

	return warnings
}

func ParseRange(value string) (*layout.KeyRange, error) {
	if value == "" {
		return nil, nil
	}

	parts := strings.Split(value, "-")
	if len(parts) != 2 {
		return nil, fmt.Errorf("invalid range: %s", value)
	}

	start, err := strconv.Atoi(parts[0])
	if err != nil {
		return nil, fmt.Errorf("invalid range: %s", value)
	}
	end, err := strconv.Atoi(parts[1])
	if err != nil {
		return nil, fmt.Errorf("invalid range: %s", value)
	}

	return &layout.KeyRange{Start: start, End: end}, nil
}

func copyKeysBetweenLayers(source layout.Layer, target *layout.Layer, plan []copyPair) {
	for _, pair := range plan {
		target.Rows[pair.target.rowIndex][pair.target.colIndex] = source.Rows[pair.source.rowIndex][pair.source.colIndex]
	}
}

func createCopyPlan(source, target layout.Layout, keyRange *layout.KeyRange) ([]copyPair, []string) {
	plan := make([]copyPair, 0)
	warnings := make([]string, 0)

	for rowIndex, row := range source.Structure.Rows {
		for colIndex, cell := range row {
			keyIndex, ok := getKeyIndex(cell)
			if !ok || !isInRange(keyIndex, keyRange) {
				continue
			}
			targetCoord, found := findCoord(target, keyIndex)
			if !found {
				warnings = append(warnings, fmt.Sprintf("Cannot find target coordinate for key index %d", keyIndex))
				continue
			}
			plan = append(plan, copyPair{
				source: keyCoord{rowIndex: rowIndex, colIndex: colIndex},
				target: targetCoord,
			})
		}
	}

	return plan, warnings
}

func findCoord(parsed layout.Layout, keyIndex int) (keyCoord, bool) {
	for rowIndex, row := range parsed.Structure.Rows {
		for colIndex, cell := range row {
			currentKeyIndex, ok := getKeyIndex(cell)
			if ok && currentKeyIndex == keyIndex {
				return keyCoord{rowIndex: rowIndex, colIndex: colIndex}, true
			}
		}
	}
	return keyCoord{}, false
}

func getKeyIndex(cell layout.StructureCell) (int, bool) {
	if cell.Kind != layout.CellKey || !cell.IsOccupied {
		return 0, false
	}
	return cell.KeyIndex, true
}

func isInRange(keyIndex int, keyRange *layout.KeyRange) bool {
	if keyRange == nil {
		return true
	}
	return keyIndex >= keyRange.Start && keyIndex <= keyRange.End
}

func findLayer(layers []layout.Layer, name string) *layout.Layer {
	for i := range layers {
		if layers[i].Name == name {
			return &layers[i]
		}
	}
	return nil
}
