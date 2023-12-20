import { Command } from "npm:commander"
import { build } from "./commands/build.ts"

function main() {
  const program = new Command()

  program.command("build <input.md> [generated-layout.h]")
    .description("Generates QMK header file from Markdown layout")
    .action(build)

  program.parse()
}

if (import.meta.main) {
  main()
}
