figma.showUI(__html__, { themeColors: true })

const clone = (value: readonly Paint[] | typeof figma.mixed) => JSON.parse(JSON.stringify(value))

const addSetPlaceholderFill = async () => {
	try {
		const base64Image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAMAAADW3miqAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAADxQTFRFv7+/MjIyAAAAQEBAzc3N////Pj4+wcHBNDQ009PTy8vLLCwsJCQk39/f29vbICAgDg4O8/Pz8fHxDAwM/tiVjgAAABR0Uk5TgICAgICAgICAgICAgICAgICAgICsUa2NAAAAwklEQVR4nI3T4Q6DIAxGUcaGOnXg4P3fdTPG2n5tif1JTgjcQAiPCPN8JRhtBmXGgGZ6o5kXROsHTS4R0PZFU1sEtCFJdV8WaFX75IZoUueZSwQ0qHuNSwTUaUjIaEidT2Q1jIDMhoDshhI5DQXyGnLkNmTIb3ihO+8wdBpS59BpSJ0R5YLm3xlQbWj2zhJVJEdngbLa5+jMETakzgyphtT5Qp3/TshoSJ1PZDVMgMyGgOyGEjkNBfIacuQ2ZMhvSPMDijUViTKtiUEAAAAASUVORK5CYII="
		const image: Image = await figma.createImageAsync(base64Image)

		const selection = figma.currentPage.selection
		if (selection.length === 0) {
			figma.ui.postMessage({ type: "error", error: "There are no selected layers!" })
			return
		}

		for (const selectedLayer of selection) {
			if ("fills" in selectedLayer) {
				const newFill = {
					type: "IMAGE",
					imageHash: image.hash,
					scaleMode: "TILE",
					scalingFactor: 1,
					opacity: 0.1
				}
				const fills = clone(selectedLayer.fills)
				selectedLayer.fills = [...fills, newFill]
			} else figma.ui.postMessage({ type: "error", error: "Selected layer does not support fills." })
		}

		figma.closePlugin()
	} catch (error) {
		figma.ui.postMessage({ type: "error", error })
	}
}

addSetPlaceholderFill()