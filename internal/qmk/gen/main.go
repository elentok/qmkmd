//go:build ignore

// Command gen regenerates the simple-key mapping table in the qmkmd skill docs
// from qmk.MappingGroups, the single source of truth. Run via `go generate ./...`
// from the repository root.
//
// It replaces only the span between the BEGIN/END GENERATED markers in
// skill/reference/mappings.md; the surrounding narrative is hand-written.
package main

import (
	"fmt"
	"os"
	"strings"

	"github.com/elentok/qmkmd/internal/qmk"
)

const (
	docPath     = "skill/reference/mappings.md"
	beginMarker = "<!-- BEGIN GENERATED: simple-keys (run `go generate ./...`) -->"
	endMarker   = "<!-- END GENERATED: simple-keys -->"
)

func main() {
	if err := run(); err != nil {
		fmt.Fprintln(os.Stderr, "gen:", err)
		os.Exit(1)
	}
}

func run() error {
	existing, err := os.ReadFile(docPath)
	if err != nil {
		return err
	}

	content := string(existing)
	start := strings.Index(content, beginMarker)
	end := strings.Index(content, endMarker)
	if start < 0 || end < 0 || end < start {
		return fmt.Errorf("could not find generation markers in %s", docPath)
	}

	var b strings.Builder
	b.WriteString(content[:start])
	b.WriteString(beginMarker)
	b.WriteString("\n\n")
	b.WriteString(renderGroups(qmk.MappingGroups))
	b.WriteString(endMarker)
	b.WriteString(content[end+len(endMarker):])

	return os.WriteFile(docPath, []byte(b.String()), 0o644)
}

func renderGroups(groups []qmk.MappingGroup) string {
	var b strings.Builder
	for _, group := range groups {
		fmt.Fprintf(&b, "**%s**", group.Title)
		if group.Lead != "" {
			fmt.Fprintf(&b, " — %s\n\n", group.Lead)
			continue
		}
		b.WriteString("\n\n")

		hasNote := false
		for _, e := range group.Entries {
			if e.Note != "" {
				hasNote = true
				break
			}
		}

		if hasNote {
			b.WriteString("| Shorthand | QMK | Meaning |\n| --- | --- | --- |\n")
			for _, e := range group.Entries {
				fmt.Fprintf(&b, "| %s | %s | %s |\n", mdCode(e.Short), mdCode(e.QMK), e.Note)
			}
		} else {
			b.WriteString("| Shorthand | QMK |\n| --- | --- |\n")
			for _, e := range group.Entries {
				fmt.Fprintf(&b, "| %s | %s |\n", mdCode(e.Short), mdCode(e.QMK))
			}
		}
		b.WriteString("\n")
	}
	return b.String()
}

// mdCode wraps a value in a Markdown code span safe for a table cell: pipes are
// escaped, and values containing a backtick use a double-backtick fence.
func mdCode(s string) string {
	s = strings.ReplaceAll(s, "|", "\\|")
	if strings.Contains(s, "`") {
		return "`` " + s + " ``"
	}
	return "`" + s + "`"
}
