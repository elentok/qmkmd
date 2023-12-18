import { stringifyLayer } from "./lib/layer.ts"
import { readLayout } from "./lib/reader.ts"

const layout = readLayout("examples/iris.md")
for (const layer of layout.layers) {
  console.info()
  console.info("Layer")
  console.info(stringifyLayer(layer, layout.structure).join("\n"))
}
