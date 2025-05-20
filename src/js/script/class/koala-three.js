import { APP } from '../init';
import * as THREE from 'three';

//Effect
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import drawVertex from './shader/drawVertex.glsl';
import drawFragment from './shader/drawFragment.glsl';
import singleVertex from './shader/singleVertex.glsl';
import singleFragment from './shader/singleFragment.glsl';
import allVertex from './shader/allVertex.glsl';
import allFragment from './shader/allFragment.glsl';

export default class KoalaThreeImage {
  constructor(opts) {}
  onInit(data) {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.res = window.devicePixelRatio;

    //
    console.log('%c Init %c %c KoalaThree %c', 'color:white; background-color:#2870ed; padding:0px 1px; margin:2px; border-radius:100vw;', '', 'color:#91e5ff;', '');
    this.data = data || document;
    this.onSet(this.data);

    //ここから
    this.createDrawPanel();
    this.updatePanels(); // Register panel callbacks here
    this.effects();

    //RUN
    this.loop = this.tick.bind(this);
    gsap.ticker.add(this.loop);
    window.addEventListener('resize', this.onResize);
  }
  onSet(data) {
    this.data = data || document;

    //INIT
    this.res = Math.min(window.devicePixelRatio, 2);
    this.scene = new THREE.Scene();
    this.canvas = document.createElement('canvas');
    document.querySelector('.js-canvas__wrap').appendChild(this.canvas);
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
    this.mouse = new THREE.Vector2();
  }
  createDrawPanel() {
    this.mousePoints = [];
    this.maxPoints = 50;
    this.limit = 50;
    this.space = _w / 50;

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.maxPoints * 3);
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    // geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    //ランダム
    const patternList = [0, 6, 10, 11, 18, 19];
    const patternIds = new Float32Array(this.maxPoints); // 各点にパターンIDを割り当てる用
    geometry.setAttribute('patternId', new THREE.BufferAttribute(patternIds, 1));

    
    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        u_color: { value: new THREE.Color(0xffffff) },
        u_size: { value: 20 },
        u_patternId: { value: 0 }, // intとして扱えるように！
      },
      vertexShader: drawVertex,
      fragmentShader: drawFragment,
    });
    this.drawLine = new THREE.Points(geometry, material);
    this.scene.add(this.drawLine);
    this.mouse = new THREE.Vector2();
    window.addEventListener('mousemove', (event) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      this.mouse.set(x, y);
      const now = performance.now();
      if (now - this.lastAddTime < this.space) return;
      this.lastAddTime = now;

      const px = event.clientX - window.innerWidth / 2;
      const py = -(event.clientY - window.innerHeight / 2);
      this.mousePoints.push(new THREE.Vector3(px, py, 1));

      if (this.mousePoints.length > this.limit) {
        this.mousePoints.shift();
      }

      const positions = this.drawLine.geometry.attributes.position.array;

      // for (let i = 0; i < this.mousePoints.length; i++) {
      //   // positions[i * 3] = this.mousePoints[i].x;
      //   // positions[i * 3 + 1] = this.mousePoints[i].y;
      //   // positions[i * 3 + 2] = this.mousePoints[i].z;

      //   geometry.attributes.patternId.needsUpdate = true;
      // }
      //ランダム
      for (let i = 0; i < this.mousePoints.length; i++) {
        positions[i * 3] = this.mousePoints[i].x;
        positions[i * 3 + 1] = this.mousePoints[i].y;
        positions[i * 3 + 2] = this.mousePoints[i].z;

        // パターンIDをランダムに割り当て
        patternIds[i] = patternList[Math.floor(Math.random() * patternList.length)];
      }
      geometry.attributes.patternId.needsUpdate = true;
      this.drawLine.geometry.setDrawRange(0, this.mousePoints.length);
      this.drawLine.geometry.attributes.position.needsUpdate = true;
    });
  }
  updatePanels() {
    APP.koalaPanel.setParamCallback('dotSize', (size) => {
      this.drawLine.material.uniforms.u_size.value = size;
    });
    // APP.koalaPanel.setParamCallback('pattern', (size) => {
    //   this.drawLine.material.uniforms.u_patternId.value = size;
    //   console.log(size);
      
    // });
    APP.koalaPanel.setParamCallback('maxPoints', (size) => {
      this.limit = size;

      const newPositions = new Float32Array(this.limit * 3);
      this.drawLine.geometry.setAttribute('position', new THREE.BufferAttribute(newPositions, 3));
      this.drawLine.geometry.attributes.position.needsUpdate = true;

      // mousePoints の最大長も変更（古い点が残るのを防ぐ）
      if (this.mousePoints.length > this.limit) {
        this.mousePoints = this.mousePoints.slice(-this.limit);
      }
    });
    APP.koalaPanel.setParamCallback('space', (size) => {
      this.space = size;
    });
  }
  effects() {
    // return
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
  }

  /*--------------------------------------
    RUN STOP DESTROY
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
    console.log('%c DES %c %c KoalaThree %c', 'color:white; background-color:#2a3354; padding:0px 1px; margin:2px; border-radius:100vw;', '', 'color:#91e5ff;', '');
  }
}
