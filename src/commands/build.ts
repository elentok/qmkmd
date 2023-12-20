import { writeQmkCode } from "../lib/qmk-writer.ts"
import { readLayout } from "../lib/reader.ts"

export function build(input: string, output = "generated-layout.h") {
  const layout = readLayout(input)
  const outputContents = writeQmkCode(layout).join("\n")
  Deno.writeTextFileSync(output, outputContents)

  console.info(`Generated ${output}`)
}
