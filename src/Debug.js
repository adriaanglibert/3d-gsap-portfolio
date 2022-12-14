import { Color } from 'three'
import { Pane } from 'tweakpane'

export class Debug {
  constructor(app) {
    this.app = app

    this.#createPanel()
    this.#createSceneConfig()
    this.#createLightConfig()
  }

  refresh() {
    this.pane.refresh()
  }

  #createPanel() {
    this.pane = new Pane({
      container: document.querySelector('#debug')
    })
  }

  #createSceneConfig() {
    const folder = this.pane.addFolder({ title: 'Scene' })

    const params = {
      background: { r: 18, g: 18, b: 18 }
    }

    folder.addInput(params, 'background', { label: 'Background Color' }).on('change', e => {
      this.app.renderer.setClearColor(new Color(e.value.r / 255, e.value.g / 255, e.value.b / 255))
    })
  }

  #createBoxConfig() {
    const folder = this.pane.addFolder({ title: 'Box' })
    const mesh = this.app.box

    this.#createColorControl(mesh.material, folder)

    folder.addInput(mesh.scale, 'x', { label: 'Width', min: 0.1, max: 4 })
    folder.addInput(mesh.scale, 'y', { label: 'Height', min: 0.1, max: 4 })
    folder.addInput(mesh.scale, 'z', { label: 'Depth', min: 0.1, max: 4 })

    folder.addInput(mesh.material, 'metalness', { label: 'Metallic', min: 0, max: 1 })
    folder.addInput(mesh.material, 'roughness', { label: 'Roughness', min: 0, max: 1 })
  }

  #createShadedBoxConfig() {
    const folder = this.pane.addFolder({ title: 'Shaded Box' })
    const mesh = this.app.shadedBox

    folder.addInput(mesh.scale, 'x', { label: 'Width', min: 0.1, max: 4 })
    folder.addInput(mesh.scale, 'y', { label: 'Height', min: 0.1, max: 4 })
    folder.addInput(mesh.scale, 'z', { label: 'Depth', min: 0.1, max: 4 })
  }

  #createLightConfig() {
    const folder = this.pane.addFolder({ title: 'Light' })

    this.#createColorControl(this.app.pointLight, folder)

    folder.addInput(this.app.pointLight, 'intensity', { label: 'Intensity', min: 0, max: 1000 })
  }

  /**
   * Adds a color control for the given object to the given folder.
   *
   * @param {*} obj Any THREE object with a color property
   * @param {*} folder The folder to add the control to
   */
  #createColorControl(obj, folder) {
    const baseColor255 = obj.color.clone().multiplyScalar(255)
    const params = { color: { r: baseColor255.r, g: baseColor255.g, b: baseColor255.b } }

    folder.addInput(params, 'color', { label: 'Color' }).on('change', e => {
      obj.color.setRGB(e.value.r, e.value.g, e.value.b).multiplyScalar(1 / 255)
    })
  }
}
