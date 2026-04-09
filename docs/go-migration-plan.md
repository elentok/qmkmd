# Go Migration Plan

## Summary

Convert `qmkmd` from a Deno-driven TypeScript CLI into a Go-native CLI and library while preserving the current Markdown layout format and core features: `build`, `format`, and `copy`.

The migration should:

- remove the Deno runtime from normal development and usage
- keep the feature set intact while allowing targeted CLI cleanup
- fix clear defects during the port, including the broken `copy --range` end parsing
- replace network-fetched Deno test dependencies with offline Go tests

## Target Architecture

- `cmd/qmkmd`: CLI entrypoint and exit handling
- `internal/layout`: domain types and structured errors
- `internal/parser`: block discovery and layout parsing
- `internal/format`: in-place and stdout formatting flows
- `internal/copykeys`: copy planning and mapping transfer
- `internal/qmk`: mapping expansion and generated header output

The Go code should keep pure parsing and transformation logic separate from file I/O so unit tests can exercise behavior without shelling out.

## CLI End State

The final Go CLI should keep the three current verbs but move to clearer flags:

- `qmkmd build <input.md> --output <path>`
- `qmkmd format <input.md> [--write]`
- `qmkmd copy <source.md> <target.md> [--range start-end] [--write]`

Behavior defaults:

- `build` writes `generated-layout.h` when `--output` is omitted
- `format` and `copy` print the result to stdout unless `--write` is set
- validation and usage errors exit with code `1`

## Migration Sequence

1. Initialize the Go module and port core types, errors, helpers, block parsing, and structure parsing.
2. Port the remaining parser logic for options, aliases, combos, layers, and full layout parsing.
3. Port formatting, copy planning, and QMK header generation.
4. Add the Go CLI, wire file I/O and exit codes, and introduce CLI integration tests.
5. Update the README and install/run instructions to point at the Go binary.
6. Remove Deno-specific files once Go behavior is covered by tests.

## Testing

- Port existing parser and writer tests to table-driven Go tests.
- Add golden tests for formatting and generated headers using `examples/iris.md`.
- Add CLI integration tests for `build`, `format`, `copy`, range parsing, and user-facing errors.
- Keep the Go test suite offline and runnable with `go test ./...`.

## Assumptions

- The Markdown layout language stays unchanged during the migration.
- The final repo should not require Deno to build or run the tool.
- Small, established Go libraries are acceptable for CLI ergonomics, but core parsing logic stays repository-owned.
