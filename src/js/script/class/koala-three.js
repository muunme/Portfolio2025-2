import * as THREE from 'three';

//Effect
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import singleVertex from './shader/singleVertex.glsl';
import singleFragment from './shader/singleFragment.glsl';

import allVertex from './shader/allVertex.glsl';
import allFragment from './shader/allFragment.glsl';
import { log } from 'three/src/nodes/TSL.js';

export default class KoalaThreeImage {
  constructor(opts) {
    this.syncItems = []; // ← ここに移動すべき！
    this.wheelPow = 0;
  }
  onInit(data) {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.res = window.devicePixelRatio;

    //
    console.log('%c Init %c %c KoalaThree %c', 'color:white; background-color:#2870ed; padding:0px 1px; margin:2px; border-radius:100vw;', '', 'color:#91e5ff;', '');
    this.data = data || document;
    this.onSet(this.data);

    //ココから
    this.createImage();
    this.effects();
   
    //追加
    this.handleWheel = this.handleWheel.bind(this);
    window.addEventListener('wheel', this.handleWheel);

    //RUN
    this.loop = this.tick.bind(this);
    gsap.ticker.add(this.loop);
    window.addEventListener('resize', this.onResize);
  }
  handleWheel(e) {
    const delta = e.deltaY || e.wheelDeltaY || -e.wheelDelta;
    const direction = delta > 0 ? -1 : 1;
    this.wheelPow = direction - delta;
  }
  onSet(data) {
    this.data = data || document;

    //INIT
    this.res = Math.min(window.devicePixelRatio, 2);
    this.scene = new THREE.Scene();
    this.canvas = document.createElement('canvas');
    this.data.querySelector('.js-canvas__wrap').appendChild(this.canvas);
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: false, alpha: true });
    this.renderer.setClearColor(0xffffff, 0);
    this.renderer.setPixelRatio(this.res);
    this.renderer.setSize(window._w, window._h);
    this.renderer.shadowMap.enabled = true;
    this.renderer.physicallyCorrectLights = true;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;

    //CAMERA
    this.fov = 50;
    this.far = -(window._h / 2) / Math.tan((this.fov * Math.PI) / 180 / 2);
    this.aspect = this.width / this.height;
    this.o_camera = new THREE.OrthographicCamera((-this.height * this.aspect) / 2, (this.height * this.aspect) / 2, this.height / 2, -this.height / 2, -this.height / 2, this.height / 2);
    this.o_camera.position.z = 1;
  }

  initGlobals() {
    this.pm = 1;
    window._w = window.innerWidth;
    window._h = window.innerHeight;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
  }
  createImage() {
    const loader = new THREE.TextureLoader();
    this.glImages = Array.from(this.data.querySelectorAll('.gl-i'));

    this.glImages.forEach((img, index) => {
      const rect = img.getBoundingClientRect();
      const texture = loader.load(img.src);
      const opacity = parseFloat(getComputedStyle(img).opacity) || 1;
      const geometry = new THREE.PlaneGeometry(img.clientWidth, img.clientHeight);
      const material = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false, // ← これ追加
        uniforms: {
          wheelPow: { value: 0 },
          u_texture: { value: texture },
          u_opacity: { value: opacity },
          u_resolution: { value: new THREE.Vector2(rect.width, rect.height) },
          u_time: { value: 0.0 },
          // u_position: { value: new THREE.Vector2(rect.left + rect.width / 2, rect.top + rect.height / 2) },
        },
        vertexShader: singleVertex,
        fragmentShader: singleFragment,
      });

      const mesh = new THREE.Mesh(geometry, material);

      // DOM位置 → Three.js座標へ（画面中央基準）
      mesh.position.x = rect.left + img.clientWidth / 2 - window.innerWidth / 2;
      mesh.position.y = -(rect.top + img.clientHeight / 2 - window.innerHeight / 2);
      mesh.position.z = 1 - index;

      this.scene.add(mesh);

      this.syncItems.push({ mesh, img, material });
    });
  }
  effects() {
    // return
    // const textureLoader = new THREE.TextureLoader();
    // const birdMaskTexture = textureLoader.load('/assets/img/_w.png');
    this.composer = new EffectComposer(this.renderer);
    this.renderPass = new RenderPass(this.scene, this.o_camera);
    this.composer.addPass(this.renderPass);

    this.allShader = new ShaderPass(
      new THREE.ShaderMaterial({
        uniforms: {
          tDiffuse: { value: null }, // シーンのテクスチャ
          u_time: { value: 0.0 },
          u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        },
        vertexShader: allVertex,
        fragmentShader: allFragment,
      })
    );

    this.composer.addPass(this.allShader);
  }
  tick() {
    
    this.renderer.setRenderTarget(null);
    this.renderer.render(this.scene, this.o_camera);
    if (!this.time) this.time = 0;
    this.time += 0.001;
    if (this.composer) this.composer.render();
    if (this.allShader.uniforms.u_time) this.allShader.uniforms.u_time.value = this.time;
    

    this.syncItems.forEach(({ mesh, img, material }) => {
      const rect = img.getBoundingClientRect();
      mesh.position.x = rect.left + rect.width / 2 - window.innerWidth / 2;
      mesh.position.y = -(rect.top + rect.height / 2 - window.innerHeight / 2);
      // mesh.rotation.y = this.time*5
      if (material.uniforms.u_time) {
        material.uniforms.u_time.value = this.time;
        if (material.uniforms.wheelPow) {
          material.uniforms.wheelPow.value = this.wheelPow;
        }
      }
      const opacity = parseFloat(getComputedStyle(img).opacity) || 1;
      if (material.uniforms.u_opacity) {
        material.uniforms.u_opacity.value = opacity;
      }
    });
  }

  /*--------------------------------------
    RUN
  --------------------------------------*/
  onResize = () => {
    console.log('%c Event %c %c onResize %c  %c KoalaAccordion %c', 'color:white; background-color:#439160; padding:0px 1px; margin:2px; border-radius:100vw;', '', 'color:#439160; border:1px solid #439160; padding:0px 1px;  border-radius:4px;', '', 'color:#91e5ff;', '');

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.aspect = this.width / this.height;

    window._w = this.width;
    window._h = this.height;

    this.far = -(this.height / 2) / Math.tan((this.fov * Math.PI) / 180 / 2);

    this.o_camera.left = (-this.height * this.aspect) / 2;
    this.o_camera.right = (this.height * this.aspect) / 2;
    this.o_camera.top = this.height / 2;
    this.o_camera.bottom = -this.height / 2;
    this.o_camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(this.res);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    if (this.composer) this.composer.setSize(this.width, this.height);
  };
  onStop() {
    this.tickStopFlag = true;
  }
  onDestroy() {
    gsap.ticker.remove(this.loop);
    window.removeEventListener('resize', this.onResize);

    // Dispose of all syncItems
    this.syncItems.forEach(({ mesh, material }) => {
      if (mesh) {
        this.scene.remove(mesh);
        mesh.geometry.dispose();
      }
      if (material) {
        for (const key in material.uniforms) {
          if (material.uniforms[key].value instanceof THREE.Texture) {
            material.uniforms[key].value.dispose();
          }
        }
        material.dispose();
      }
    });

    this.syncItems = [];

    // Dispose of the renderer and canvas
    if (this.renderer) {
      this.renderer.dispose();
    }
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }

    // Dispose postprocessing composer
    if (this.composer) {
      this.composer.passes.forEach((pass) => {
        if (pass.dispose) pass.dispose();
      });
      this.composer = null;
    }
    console.log('%c DES %c %c KoalaThree %c', 'color:white; background-color:#2a3354; padding:0px 1px; margin:2px; border-radius:100vw;', '', 'color:#91e5ff;', '');
  }
}
