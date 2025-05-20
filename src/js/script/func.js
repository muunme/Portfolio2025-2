/*

Func

--------------------------------------------------------------------*/

console.log('%c Set %c %c func.js %c', 'color:white; background-color:#56b2e3; padding:0px 1px; margin:2px; border-radius:100vw;', '', 'color:#91e5ff;', '');

//2-1.onLoad
window.onLoad = () => {
  this.vh = window.innerHeight * 0.01;
};

//2-2-0.onResize
//2-2-1.リロードFUNC - デバイスのUAが変わった時に(コンソール対策)
window.onResize = () => {
  this.vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${this.vh}px`);
  if (_w == window.innerWidth && device.mobile()) return;
  _w = window.innerWidth;
  _h = window.innerHeight;
  //2-2-1
  if (_DETECT.ua !== window.navigator.userAgent) {
    console.log('🌕INIT  : %o', 'uaChange');
    document.location.reload();
    return;
  }
};

//2-3.getPxByVw
// console.log(getPxByVw(19.2));
window.getPxByVw = (px = 0, width = _w) => {
  const fvw = px / (width / 100);
  return fvw;
};

//2-4.マウス座標PC
window.getMouse = (e) => {
  let mouse = { x: e.clientX, y: e.clientY };
  return mouse;
};

//3-1.scroll
window.onScrollEvent = (e) => {
  //
  if (e > 100 && !_DETECT.isScrolled) {
    _DETECT.isScrolled = true;
    document.querySelector('html').classList.add('is-scrolled');
  } else if (e < 100 && _DETECT.isScrolled) {
    _DETECT.isScrolled = false;
    document.querySelector('html').classList.remove('is-scrolled');
  }
  //
};

//3-2.小数点
window.financial = (x) => {
  return Number.parseFloat(x).toFixed(2);
};
