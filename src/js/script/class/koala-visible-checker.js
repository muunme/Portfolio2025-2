/*!
 * Koala-visible-checker
 *
 * @version: v0.2.0
 * @date   : 2025-03-31
 * @license: Copyright (c) 2024 KOALA
 * @description
 * シンプルな画面判定チェック
 *
 **/

export default class KoalaScrollChecker {
  constructor(opts) {
    this.opts = {
      target   : opts?.target ?? '.js-visible',
      delayItem: opts?.delayItem ?? '.js-visible__d',
      delayMode: opts?.delayMode ?? true,
      delayTime: opts?.delayTime ?? 0.05,
    };
  }

  onInit(data) {
    //SET
    this.data = data || document;
    this.target = this.data.querySelectorAll(this.opts.target);
    this.delayMode = this.opts.delayMode;
    this.delayTime = this.opts.delayTime;
    if (!this.target || this.target.length === 0) return;
    console.log('%c Init %c %c KoalaVisibleChecker %c', 'color:white; background-color:#2870ed; padding:0px 1px; margin:2px; border-radius:100vw;', '', 'color:#91e5ff;', '');
    this.delayItem = this.data.querySelectorAll(this.opts.delayItem);
    this.initObserver();
    if (this.delayMode) this.addDelay();
  }
  initObserver() {
    this.observerOptions = { root: null, threshold: 0.1 };
    if (this.observer !== undefined) return;
    this.observer = new IntersectionObserver(this.onObserver.bind(this), this.observerOptions);
    Array.from(this.target).forEach((target) => {
      target.dataset.shown = 0;
      this.observer.observe(target);
    });
  }
  addDelay() {
    for (let index = 0; index < this.target.length; index++) {
      const element = this.target[index];
      if (element.dataset.delayTime) {
        element.style.transitionDelay = `${element.dataset.delayTime}s`;
      } 
      
      for (let i = 0; i < element.querySelectorAll(this.opts.delayItem).length; i++) {
        const elm = element.querySelectorAll(this.opts.delayItem)[i];
        if(elm.dataset.delayTime){
           elm.style.transitionDelay = `${elm.dataset.delayTime}s`;
        }else{
           elm.style.transitionDelay = `${i * this.delayTime}s`;
        }
      }
    }
  }
  onObserver(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.dataset.visible = 1;
        entry.target.dataset.shown = 1;
      } else {
        entry.target.dataset.visible = 0;
      }
    });
  }
  onDestroy() {
    if (this.observer) {
      Array.from(this.target).forEach((target) => {
        // target.dataset.shown = 0;
        // target.dataset.visible = 0;
        this.observer.unobserve(target);
      });
      this.target = [];
      this.observer = undefined;
      console.log('%c DES %c %c KoalaVisibleChecker %c', 'color:white; background-color:#2a3354; padding:0px 1px; margin:2px; border-radius:100vw;', '', 'color:#91e5ff;', '');

    }
  }
}
