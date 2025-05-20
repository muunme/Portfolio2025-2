/*!
 * Koala-guide
 *
 * @version  v0.2.2
 * @author   MuramotoMeguru
 * @date     2025-03-25
 * @license  MIT
 * @description
 * グリッド／スクロール量可視化のための開発補助ツール。
 * ページに自動でガイドHTMLを挿入し、キーボードで制御可能。
 */

export default class KoalaGuide {
  constructor({ visible = true } = {}) {
    this.visible = visible;
    this.v = 0;
  }
  onInit() {
    console.log('%c Init %c %c KoalaGuide %c', 'color:white; background-color:#2870ed; padding:0px 1px; margin:2px; border-radius:100vw;', '', 'color:#91e5ff;', '');
    this.v = 0;
    this.onSet();
    document.addEventListener('keydown', this.onKeyEvent.bind(this));
  }
  onSet() {
    document.body.insertAdjacentHTML(
      'beforeend',
      `

      <!--Guide-->
      <div class="guide">
        <div class="guide-s is-hidden">
          <div class="guide-s__inner">
            <p>Scroll : <span class="nm-scroll"></span></p>
            <p>ScrollPow : <span class="nm-scrollPow"></span></p>
          </div>
        </div>
        <div class="guide-v">
          <div class="guide-v-1 is-hidden"> <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>
          <div class="guide-v-2 is-hidden"></div>
          <div class="guide-v-3 is-hidden"><span></span><span></span></div>
        </div>
      </div>
      <!-- /.guide -->
  `
    );
  }
  onKeyEvent(e) {
    if (!this.visible) return;

    const keyName = e.key;
    const v1 = document.querySelector('.guide-v-1');
    const v2 = document.querySelector('.guide-v-2');
    const v3 = document.querySelector('.guide-v-3');

    if (keyName === 'v') {
      this.v += 1;
      if (this.v === 1) {
        v1.classList.remove('is-hidden');
        v2.classList.add('is-hidden');
        v3.classList.add('is-hidden');
      } else if (this.v === 2) {
        v2.classList.remove('is-hidden');
      } else if (this.v === 3) {
        v3.classList.remove('is-hidden');
      } else {
        this.v = 0;
        v1.classList.add('is-hidden');
        v2.classList.add('is-hidden');
        v3.classList.add('is-hidden');
      }
    }

    if (keyName === 's') {
      document.querySelector('.guide-s')?.classList.toggle('is-hidden');
    }

    if (keyName === 'i') {
      if (typeof _DETECT !== 'undefined') {
        this._DETECT = {
          '_DETECT.webp': _DETECT.webp,
          '_DETECT.retina': _DETECT.retina,
          '_DETECT.touch': _DETECT.touch,
          '_DETECT.ua': _DETECT.ua,
          '_DETECT.page': _DETECT.page,
          '_DETECT.guide': _DETECT.guide,
          '_DETECT.isTransit': _DETECT.isTransition,
          '_DETECT.isScrolled': _DETECT.isScrolled,
          'device.type': device.type,
          'device.device': device.os,
        };
        console.table(this._DETECT);
      }
    }
  }
}
