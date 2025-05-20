/*!
 * Koala-image-loader
 *
 * @version: v0.2.0
 * @date   : 2025-03-27
 * @license: Copyright (c) 2024 KOALA
 * @description
 * 画像を遅延ロードするシステム
 * webp対応との振り分け対応
 **/

export default class KoalaImageLoader {
  constructor(opts) {
    this.opts = opts || {};
    this.flagWebp = opts.flagWebp ?? false;
    this.flagRetina = opts.flagRetina ?? false;
  }
  onInit(data) {
    this.data = data || document;
    this.imageElem = this.data.querySelectorAll(this.opts.imageElem);

    this.imageBg = this.opts.imageBg;
    this.add = this.opts.imageAdd;

    /* init */
    if (!this.imageElem || this.imageElem.length === 0) return;
    console.log('%c Init %c %c KoalaImageLoader %c', 'color:white; background-color:#2870ed; padding:0px 1px; margin:2px; border-radius:100vw;', '', 'color:#91e5ff;', '');
    this.observerOptions = { root: null, threshold: 0, rootMargin: '0px' };
    if (this.imageElem.length) this.initObserver();
  }
  initObserver() {
    this.observer = new IntersectionObserver(this.onObserver.bind(this), this.observerOptions);
    for (let index = 0; index < this.imageElem.length; index++) {
      const target = this.imageElem[index];
      this.observer.observe(target);
    }
  }
  onObserver(entries) {
    entries.forEach((entry) => {
      const el = entry.target;
      if (entry.isIntersecting && !el.hasAttribute('data-complete')) {
        this.onChange(el);
      }
    });
  }
  onDestroy() {
    if (this.observer) {
      for (let index = 0; this.imageElem.length > index; index++) {
        const target = this.imageElem[index];
        this.observer.unobserve(target);
      }
      this.imageElem = [];
      this.observer = undefined;
      console.log('🌑DSTROY: %o', this);
    }
  }
  onChange(element) {
    var dp1x = element.dataset.dp1x;
    var dp2x = element.dataset.dp2x;
    var mob = element.dataset.mob;
    var src = this.getSrc(dp1x, dp2x, mob);
    var img = new Image();

    if (element.tagName === 'IMG') {
      img.src = src;
      element.src = src;
    } else if (element.classList.contains(this.imageBg)) {
      img.src = src;
      element.style.backgroundImage = `url(${src})`;
    }

    img.onload = () => {
      element.classList.add(this.add);
      element.dataset.complete = 'true';
    };
  }

  getSrc(dp1x, dp2x, mob) {
    let src = dp1x;

    if (device.mobile() && mob) {
      src = mob;
    } else if (this.flagRetina && dp2x) {
      src = dp2x;
    }

    if (this.flagWebp) {
      const strFoot = src.slice(-5);
      if (strFoot === '.webp') return src;
      return `${src}.webp`;
    } else {
      return src;
    }
  }
}
