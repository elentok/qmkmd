package layout

import "strings"

func IsCommentOrBlank(line string) bool {
	trimmed := strings.TrimSpace(line)
	return trimmed == "" || strings.HasPrefix(line, "#")
}

func IsNotCommentOrBlank(line string) bool {
	return !IsCommentOrBlank(line)
}

type PresentLines struct {
	Lines         []string
	IndexToLineNr []int
}

func FilterPresentRows(block Block) PresentLines {
	indexToLineNr := make([]int, 0, len(block.Lines))
	presentLines := make([]string, 0, len(block.Lines))

	for i, line := range block.Lines {
		if IsCommentOrBlank(line) {
			continue
		}
		presentLines = append(presentLines, line)
		indexToLineNr = append(indexToLineNr, block.StartLineNr+i)
	}

	return PresentLines{
		Lines:         presentLines,
		IndexToLineNr: indexToLineNr,
	}
}

func ParseVariable(line string) (name string, value string, ok bool) {
	index := strings.Index(line, "=")
	if index < 0 {
		return "", "", false
	}

	name = strings.TrimSpace(line[:index])
	value = strings.TrimSpace(line[index+1:])
	return name, value, true
}
