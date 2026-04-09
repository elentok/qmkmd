package main

import (
	"errors"
	"flag"
	"fmt"
	"io"
	"os"
	"strings"

	"github.com/elentok/qmkmd/internal/copykeys"
	formatter "github.com/elentok/qmkmd/internal/format"
	"github.com/elentok/qmkmd/internal/parser"
	"github.com/elentok/qmkmd/internal/qmk"
)

func main() {
	if err := run(os.Args[1:], os.Stdout, os.Stderr); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}

func run(args []string, stdout, stderr io.Writer) error {
	if len(args) == 0 {
		writeUsage(stderr)
		return errors.New("missing command")
	}

	switch args[0] {
	case "build":
		return runBuild(args[1:], stdout)
	case "format":
		return runFormat(args[1:], stdout)
	case "copy":
		return runCopy(args[1:], stdout, stderr)
	case "help", "-h", "--help":
		writeUsage(stdout)
		return nil
	default:
		writeUsage(stderr)
		return fmt.Errorf("unknown command: %s", args[0])
	}
}

func runBuild(args []string, stdout io.Writer) error {
	fs := flag.NewFlagSet("build", flag.ContinueOnError)
	fs.SetOutput(io.Discard)
	output := fs.String("output", "generated-layout.h", "output header path")
	if err := fs.Parse(reorderArgs(args, map[string]bool{"--output": true})); err != nil {
		return err
	}
	if fs.NArg() != 1 {
		return errors.New("usage: qmkmd build <input.md> [--output path]")
	}

	parsed, err := parser.ParseLayoutFile(fs.Arg(0))
	if err != nil {
		return err
	}
	lines, err := qmk.WriteQMKCode(parsed)
	if err != nil {
		return err
	}
	if err := os.WriteFile(*output, []byte(strings.Join(lines, "\n")), 0o644); err != nil {
		return err
	}
	_, err = fmt.Fprintf(stdout, "Generated %s\n", *output)
	return err
}

func runFormat(args []string, stdout io.Writer) error {
	fs := flag.NewFlagSet("format", flag.ContinueOnError)
	fs.SetOutput(io.Discard)
	write := fs.Bool("write", false, "write changes to the input file")
	if err := fs.Parse(reorderArgs(args, map[string]bool{"--write": false})); err != nil {
		return err
	}
	if fs.NArg() != 1 {
		return errors.New("usage: qmkmd format <input.md> [--write]")
	}

	filename := fs.Arg(0)
	lines, blocks, err := parser.ParseMarkdownFile(filename)
	if err != nil {
		return err
	}
	parsed, err := parser.ParseBlocks(blocks)
	if err != nil {
		return err
	}
	if err := formatter.RewriteLines(lines, blocks, parsed); err != nil {
		return err
	}

	output := strings.Join(lines, "\n")
	if *write {
		return os.WriteFile(filename, []byte(output), 0o644)
	}
	_, err = fmt.Fprint(stdout, output)
	return err
}

func runCopy(args []string, stdout, stderr io.Writer) error {
	fs := flag.NewFlagSet("copy", flag.ContinueOnError)
	fs.SetOutput(io.Discard)
	rangeValue := fs.String("range", "", "copy only the inclusive key range start-end")
	write := fs.Bool("write", false, "write changes to the target file")
	if err := fs.Parse(reorderArgs(args, map[string]bool{"--range": true, "--write": false})); err != nil {
		return err
	}
	if fs.NArg() != 2 {
		return errors.New("usage: qmkmd copy <source.md> <target.md> [--range start-end] [--write]")
	}

	keyRange, err := copykeys.ParseRange(*rangeValue)
	if err != nil {
		return err
	}

	_, sourceBlocks, err := parser.ParseMarkdownFile(fs.Arg(0))
	if err != nil {
		return err
	}
	sourceLayout, err := parser.ParseBlocks(sourceBlocks)
	if err != nil {
		return err
	}

	targetFilename := fs.Arg(1)
	targetLines, targetBlocks, err := parser.ParseMarkdownFile(targetFilename)
	if err != nil {
		return err
	}
	targetLayout, err := parser.ParseBlocks(targetBlocks)
	if err != nil {
		return err
	}

	for _, warning := range copykeys.CopyKeys(&sourceLayout, &targetLayout, keyRange) {
		fmt.Fprintln(stderr, warning)
	}
	if err := formatter.RewriteLines(targetLines, targetBlocks, targetLayout); err != nil {
		return err
	}

	output := strings.Join(targetLines, "\n")
	if *write {
		return os.WriteFile(targetFilename, []byte(output), 0o644)
	}
	_, err = fmt.Fprint(stdout, output)
	return err
}

func writeUsage(w io.Writer) {
	fmt.Fprintln(w, "Usage:")
	fmt.Fprintln(w, "  qmkmd build <input.md> [--output path]")
	fmt.Fprintln(w, "  qmkmd format <input.md> [--write]")
	fmt.Fprintln(w, "  qmkmd copy <source.md> <target.md> [--range start-end] [--write]")
	fmt.Fprintln(w, "")
}

func reorderArgs(args []string, flags map[string]bool) []string {
	if len(args) == 0 {
		return args
	}

	flagArgs := make([]string, 0)
	positional := make([]string, 0)

	for i := 0; i < len(args); i++ {
		arg := args[i]
		takesValue, isFlag := flags[arg]
		if !isFlag {
			positional = append(positional, arg)
			continue
		}

		flagArgs = append(flagArgs, arg)
		if takesValue && i+1 < len(args) {
			i++
			flagArgs = append(flagArgs, args[i])
		}
	}

	return append(flagArgs, positional...)
}
