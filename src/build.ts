import { stringifyLayer } from "./layer.ts"
import { readLayout } from "./reader.ts"

const layout = readLayout("iris.md")
for (const layer of layout.layers) {
  console.info()
  console.info("Layer")
  console.info(stringifyLayer(layer, layout.structure).join("\n"))
}
