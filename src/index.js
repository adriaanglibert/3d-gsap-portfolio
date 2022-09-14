import {
  BoxGeometry,
  Clock,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  Vector2,
  WebGLRenderer
} from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { SampleShaderMaterial } from './materials/SampleShaderMaterial'
import { Vector3 } from 'three'
import { gltfLoader } from './loaders'
import gsap from 'gsap'

class App {
  #resizeCallback = () => this.#onResize()

  constructor(container) {
    this.container = document.querySelector(container);
    this.body = document.querySelector('body');
    this.screen = new Vector2(this.container.clientWidth, this.container.clientHeight);
    this.scene = null;
    this.mesh = null;
  }

  async init() {
    this.#createScene()
    this.#createCamera()
    this.#createRenderer()
    this.#createLight()
    this.#createClock()
    this.#addListeners()
    // this.#createControls()

    await this.#loadModel()

    if (window.location.hash.includes('#debug')) {
      const panel = await import('./Debug.js')
      new panel.Debug(this)
    }

    this.renderer.setAnimationLoop(() => {
      this.#update()
      this.#render()
    })
  }

  mouseMoveFunc(evt, that) {
    const percent = gsap.utils.normalize(0, innerWidth, evt.pageX);

    gsap.to(that.pointLight.position, {
      x: Math.floor(percent * 6) + 1,
      y: Math.floor(percent * 6) + 1,
      duration: 0.35,
      overwrite: true
    });
  }

  destroy() {
    this.renderer.dispose()
    this.#removeListeners()
  }

  #update() {
    const elapsed = this.clock.getElapsedTime()
  }

  #render() {
    this.renderer.render(this.scene, this.camera)
  }

  #createScene() {
    this.scene = new Scene()
  }

  #createCamera() {
    this.camera = new PerspectiveCamera(75, this.screen.x / this.screen.y, 0.1, 2000)
    this.camera.position.set(0, 0, 5)
  }

  #createRenderer() {
    this.renderer = new WebGLRenderer({
      alpha: false,
      antialias: window.devicePixelRatio === 1
    })

    this.container.appendChild(this.renderer.domElement)
    this.renderer.setSize(this.screen.x, this.screen.y)
    this.renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio))
    this.renderer.setClearColor(0xeaeaea)
    this.renderer.physicallyCorrectLights = true
  }

  #createLight() {
    this.pointLight = new PointLight(0xc0d6df, 100, 0, 0.5)
    this.pointLight.position.set(0, 6, 6)
    this.scene.add(this.pointLight)
  }

  /**
   * Load a 3D model and append it to the scene
   */
  async #loadModel() {
    const gltf = await gltfLoader.load('/xbox/source/controller.glb')

    this.mesh = gltf.scene.children[0];
    this.#setControllerProperties()

    this.mesh.material = SampleShaderMaterial.clone()
    this.mesh.material.wireframe = true
    this.mesh.scale.set(0,0,0);
    this.mesh.position.set(-5,-1,5);

    this.scene.add(this.mesh);

    window.addEventListener("mousemove", (e) => this.mouseMoveFunc(e, this));
  }

  #createControls() {
    this.controls = new OrbitControls(this.camera, this.body);
    this.controls.target.set(0, 0, 0 );
  }

  #createClock() {
    this.clock = new Clock()
  }

  #addListeners() {
    window.addEventListener('resize', this.#resizeCallback, { passive: true })
  }

  #removeListeners() {
    window.removeEventListener('resize', this.#resizeCallback, { passive: true })
  }

  #onResize() {
    this.screen.set(this.container.clientWidth, this.container.clientHeight)

    this.camera.aspect = this.screen.x / this.screen.y
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(this.screen.x, this.screen.y)
    this.#setControllerProperties()
  }

  #setControllerProperties() {
    const isMobile = window.matchMedia('(max-width: 1024px)');

    if (isMobile.matches) {
      gsap.to(this.mesh.scale, {
        x: 3,
        y: 3,
        z: 3,
        duration: .75
      });

      gsap.to(this.mesh.position, {
        x: -.5,
        y: -1,
        z: 0,
        duration: .75
      });

      gsap.to(this.mesh.rotation, {
        x: 0,
        y: .5,
        z: 0,
        duration: .75
      });
    } else {
      gsap.to(this.mesh.scale, {
        x: 3.5,
        y: 3.5,
        z: 3.5,
        duration: .75
      });

      gsap.to(this.mesh.position, {
        x: -3.5,
        y: 0,
        z: 0,
        duration: .75
      });

      gsap.to(this.mesh.rotation, {
        x: 0,
        y: 1,
        z: 0.75,
        duration: .75
      });
    }
  }
}

const app = new App('#app');
app.init();

gsap.from('body', {
  opacity: 0
});

const tl = gsap.timeline();

tl
.from('.logo', {
  opacity: 0,
})
.from('article', {
  opacity: 0,
  y: 5,
  ease: "power2.inOut"
})
.from('address ul li', {
  opacity: 0,
  y: 10,
  stagger: 0.1
}, '-=0.5')
