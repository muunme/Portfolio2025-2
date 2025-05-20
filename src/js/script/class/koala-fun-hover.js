/*!
 * KoalaFunHover
 *
 * @version: v0.1.2
 * @date   : 2025-04-11
 * @license: Copyright (c) 2025 KOALA
 **/

export default class KoalaFunHover {
  constructor(opts) {
    this.opts = {
      triggerWrap       : document.querySelector(opts?.triggerWrap ?? 'body'),
      targetWrap        : document.querySelector(opts?.targetWrap ?? 'body'),
      modeTrigger       : document.querySelector(opts?.modeTrigger ?? '.c'),
      modeArray         : opts?.modeTrigger ?? ['normal', 'shape', 'dot'],
      useImageBackground: opts?.useImageBackground ?? false,

      lag      : opts?.lag ?? (_DETECT.touch ? 10 : 50),
      maxLength: opts?.maxLength ?? 55,
      boxWidth : opts?.boxWidth ?? 8,
      boxHeight: opts?.boxHeight ?? 8,

      addWrapClass: opts?.addWrapClass ?? 'js-box__wrap',
      addDotClass : opts?.addDotClass ?? 'js-box__dot',
      addBoxClass : opts?.addBoxClass ?? 'js-box__box',
      addTextClass: opts?.addTextClass ?? 'js-box__text',

      textArray: opts?.textArray ?? ['De', 'Dev', 'Web'],
    };
  }
  onInit() {
    if (!this.opts.targetWrap || this.opts.targetWrap.length === 0) return;

    console.log('%c Init %c %c KoalaFunHover %c', 'color:white; background-color:#2870ed; padding:0px 1px; margin:2px; border-radius:100vw;', '', 'color:#91e5ff;', '');
    this.boxArray = Array.from(this.opts.targetWrap.querySelectorAll(`.${this.opts.addWrapClass}`));
    
    this.down                = false
    this.previousMouseX      = null;
    this.previousMouseY      = null;
    this.accumulatedDistance = 0;
    this.textIndex           = 0;
    this.imageFrameIndex     = 0;
    this.animaFlag           = false
    this.onEvent();

    // 初期状態で maxLength を超えていたら削除する
    while (this.boxArray.length > this.opts.maxLength) {
      const excess = this.boxArray.shift();
      this.opts.targetWrap.removeChild(excess);
    }

    //imageChange
    // this.wrap = document.querySelector('.hoge');
    // this.imageIndex = 1; // 初期値
    // this.maxImages = 3; // 最大画像数（必要なら変更可）
    document.querySelector('body').addEventListener('mousedown', (e) => { this.down = true; });
    document.querySelector('body').addEventListener('mouseup', (e) => { this.down = false;});

    this.enableFloatAnimation();
  }
  onEvent() {
    this.onMove = this.onMove.bind(this);
    this.opts.triggerWrap.addEventListener('mousemove', this.onMove);
    this.opts.triggerWrap.addEventListener('touchmove', this.onMove, { passive: true });

    for (let index = 0; index < document.querySelectorAll('.mode-trigger li').length; index++) {
      const element = document.querySelectorAll('.mode-trigger li')[index];
      element.addEventListener('mouseenter', () => {
        this.opts.modeArray.forEach((mode) => {
          this.opts.targetWrap.classList.remove(`mode--${mode}`);
        });
        this.opts.targetWrap.classList.add(`mode--shape`);
        // document.querySelector('.hoge').classList.add(`on`);
      });
      element.addEventListener('mouseleave', () => {
        this.opts.modeArray.forEach((mode) => {
          this.opts.targetWrap.classList.remove(`mode--${mode}`);
        });
        this.opts.targetWrap.classList.add(`mode--normal`);
        // document.querySelector('.hoge').classList.remove(`on`);
      });
    }
  }
  onMove(e) {
    // if(!this.down)return
    if (e.touches && e.touches.length > 0) {
      this.mouseX = e.touches[0].clientX;
      this.mouseY = e.touches[0].clientY;
    } else {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    }

    if (this._isEnoughLagMoved()) {
      this.accumulatedDistance += this._calcDistance();
      this.createBox(this.mouseX, this.mouseY);
      this.previousMouseX = this.mouseX;
      this.previousMouseY = this.mouseY;
    }
    if (this.accumulatedDistance >= 300) {
      this.imageChange();
      // this.createText(this.mouseX, this.mouseY);
      this.accumulatedDistance = 0; // リセット
    }
    if (this.accumulatedDistance >= 200) {
      // this.imageChange();
      // this.createText(this.mouseX, this.mouseY);
      this.accumulatedDistance = 0; // リセット
    }
  }
  _calcDistance() {
    const dx = this.mouseX - this.previousMouseX;
    const dy = this.mouseY - this.previousMouseY;
    return Math.sqrt(dx * dx + dy * dy);
  }
  _isEnoughLagMoved() {
    if (this.previousMouseX === null || this.previousMouseY === null) return true;

    const dx = this.mouseX - this.previousMouseX;
    const dy = this.mouseY - this.previousMouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance >= this.opts.lag;
  }
  imageChange() {
    // this.imageIndex++;
    // if (this.imageIndex > this.maxImages) this.imageIndex = 1;
    // const newSrc = `./assets/img/${this.imageIndex}.png`;
    // this.wrap.src = newSrc;
  }
  createBox(x, y) {



    const leftVw = this.pxToVw(x) - this.opts.boxWidth / 2;
    const topVh = this.pxToVh(y) - this.opts.boxHeight / 2;

    const newDiv = document.createElement('div');
    const newBoxDiv = document.createElement('div');

    newDiv.style.left = `${leftVw}vw`;
    newDiv.style.top = `${topVh}vh`;
    newDiv.style.width = `${this.opts.boxWidth}vw`;
    newDiv.style.height = `${this.opts.boxHeight}vw`;
    // newDiv.style.transform = `rotate(${Math.random() * 180}deg)`;
    if (this.opts.useImageBackground) {
      const frame = this.imageFrameIndex;
      newBoxDiv.style.backgroundImage = `url("./assets/img/test/${frame}.png")`;
      newBoxDiv.style.backgroundSize = 'cover';
      newBoxDiv.style.backgroundRepeat = 'no-repeat';
      this.imageFrameIndex = (this.imageFrameIndex + 1) % 101;
    }
    // 次の番号へ（101でリセット）
    this.imageFrameIndex = (this.imageFrameIndex + 1) % 101;


    const dx = x - this.previousMouseX;
    const dy = y - this.previousMouseY;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI); // ← ここがポイント！

    newDiv.style.transform = `rotate(${angle}deg)`;

    newDiv.classList.add(this.opts.addWrapClass);
    newBoxDiv.classList.add(this.opts.addBoxClass);

    newDiv.appendChild(newBoxDiv);
    this.opts.targetWrap.appendChild(newDiv);

    this.boxArray.push(newDiv);
    if (this.boxArray.length > this.opts.maxLength) {
      const oldestDiv = this.boxArray.shift();
      this.opts.targetWrap.removeChild(oldestDiv);
    }
    // 新しく追加された要素にもアニメーションを適用する
    if (this.animationEnabled && this.animaFlag) {
      const offset = Math.random() * 6 - 3; // -3 ~ 3
      const duration = 3 + Math.random() * 3;

      gsap.to(newDiv, {
        y: `${offset}vh`,
        x: `${offset}vw`,
        duration,
        ease: 'linear',
        ease: 'steps(5)',
        _repeat: -1,
        get repeat() {
          return this._repeat;
        },
        set repeat(value) {
          this._repeat = value;
        },
        yoyo: true,
      });
    }
  }
  createText(x, y) {
    const leftVw = this.pxToVw(x) - this.opts.boxWidth / 2;
    const topVh = this.pxToVh(y) - this.opts.boxHeight / 2;

    const textDiv = document.createElement('div');
    textDiv.style.left = `${leftVw}vw`;
    textDiv.style.top = `${topVh}vh`;
    textDiv.innerHTML = this.opts.textArray[this.textIndex];
    textDiv.classList.add(this.opts.addTextClass);
    this.opts.targetWrap.appendChild(textDiv);
    const textElements = document.querySelectorAll(`.${this.opts.addTextClass}`);
    if (textElements.length > 5) {
      textElements[0].remove();
    }
    // this.boxArray.push(textDiv);
    this.textIndex = (this.textIndex + 1) % this.opts.textArray.length;
  }
  enableFloatAnimation() {
    if (!this.animaFlag)return
    if (this.animationEnable) return;
    this.animationEnabled = true;
    this.boxArray.forEach((box) => {
      const offset = Math.random() * 6 - 3; // -3 ~ 3
      const duration = 3 + Math.random() * 3;

      gsap.to(box, {
        y: `${offset}vh`,
        x: `${offset}vw`,
        duration,
        ease: 'linear',
        ease: 'steps(5)',
        repeat: -1,
        yoyo: true,
      });
    });
  }

  disableFloatAnimation() {
    this.animationEnabled = false;
    this.boxArray.forEach((box) => {
      const clone = box.cloneNode(true);
      box.parentNode.replaceChild(clone, box);
    });
  }
  pxToVh(px, viewportHeight = window.innerHeight) {
    return (px / viewportHeight) * 100;
  }
  pxToVw(px, viewportWidth = window.innerWidth) {
    return (px / viewportWidth) * 100;
  }
}
