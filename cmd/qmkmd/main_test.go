package main

import (
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"testing"
)

func TestBuildCommand(t *testing.T) {
	t.Parallel()

	tmpDir := t.TempDir()
	output := filepath.Join(tmpDir, "generated-layout.h")

	cmd := exec.Command("go", "run", "./cmd/qmkmd", "build", "examples/iris.md", "--output", output)
	cmd.Dir = repoRoot(t)
	out, err := cmd.CombinedOutput()
	if err != nil {
		t.Fatalf("build command failed: %v\n%s", err, out)
	}

	content, err := os.ReadFile(output)
	if err != nil {
		t.Fatalf("reading generated file failed: %v", err)
	}
	if !strings.Contains(string(content), "const uint16_t PROGMEM keymaps") {
		t.Fatalf("generated file missing keymaps block:\n%s", content)
	}
}

func TestFormatCommandStdout(t *testing.T) {
	t.Parallel()

	tmpDir := t.TempDir()
	input := filepath.Join(tmpDir, "layout.md")
	content := strings.Join([]string{
		"```structure",
		"1  2  3",
		"```",
		"",
		"```layer:base",
		"a bb c",
		"```",
		"",
	}, "\n")
	if err := os.WriteFile(input, []byte(content), 0o644); err != nil {
		t.Fatal(err)
	}

	cmd := exec.Command("go", "run", "./cmd/qmkmd", "format", input)
	cmd.Dir = repoRoot(t)
	out, err := cmd.CombinedOutput()
	if err != nil {
		t.Fatalf("format command failed: %v\n%s", err, out)
	}

	if !strings.Contains(string(out), "```layer:base") || !strings.Contains(string(out), "a bb c") {
		t.Fatalf("expected formatted markdown on stdout, got:\n%s", out)
	}

	original, err := os.ReadFile(input)
	if err != nil {
		t.Fatal(err)
	}
	if string(original) != content {
		t.Fatalf("expected input file to remain unchanged")
	}
}

func TestCopyCommandWriteRange(t *testing.T) {
	t.Parallel()

	tmpDir := t.TempDir()
	source := filepath.Join(tmpDir, "source.md")
	target := filepath.Join(tmpDir, "target.md")

	sourceContent := strings.Join([]string{
		"```structure",
		"1  2  3",
		"```",
		"",
		"```layer:base",
		"a b c",
		"```",
		"",
	}, "\n")
	targetContent := strings.Join([]string{
		"```structure",
		"1  2  3",
		"```",
		"",
		"```layer:base",
		"x y z",
		"```",
		"",
	}, "\n")
	if err := os.WriteFile(source, []byte(sourceContent), 0o644); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(target, []byte(targetContent), 0o644); err != nil {
		t.Fatal(err)
	}

	writeCmd := exec.Command("go", "run", "./cmd/qmkmd", "copy", source, target, "--range", "2-3", "--write")
	writeCmd.Dir = repoRoot(t)
	out, err := writeCmd.CombinedOutput()
	if err != nil {
		t.Fatalf("copy command failed: %v\n%s", err, out)
	}

	updated, err := os.ReadFile(target)
	if err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(string(updated), "x b c") {
		t.Fatalf("expected ranged copy result, got:\n%s", updated)
	}
}

func repoRoot(t *testing.T) string {
	t.Helper()
	root, err := filepath.Abs(filepath.Join("..", ".."))
	if err != nil {
		t.Fatal(err)
	}
	return root
}
