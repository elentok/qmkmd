package layout

type Layout struct {
	Structure Structure
	Layers    []Layer
	Options   Options
	Aliases   map[string]Alias
	Combos    []Combo
}

type Options struct {
	LayoutFn string
	Imports  []string
}

type Alias struct {
	Value  string
	LineNr int
}

type Structure struct {
	Separators []int
	Rows       [][]StructureCell
	RowToLine  []int
}

type StructureCell struct {
	KeyIndex   int
	Kind       CellKind
	IsOccupied bool
}

type CellKind string

const (
	CellEmpty     CellKind = ""
	CellSeparator CellKind = "separator"
	CellKey       CellKind = "key"
)

type Layer struct {
	Name      string
	Rows      [][]LayerCell
	RowToLine []int
}

type LayerCell struct {
	Mapping    string
	Kind       CellKind
	IsOccupied bool
}

type Block struct {
	Name        string
	Lines       []string
	StartLineNr int
}

type KeyRange struct {
	Start int
	End   int
}

type Combo struct {
	Keys   string
	Action string
	LineNr int
}
