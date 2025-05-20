/*

init

--------------------------------------------------------------------*/

console.log('%c Set %c %c init.js %c', 'color:white; background-color:#56b2e3; padding:0px 1px; margin:2px; border-radius:100vw;', '', 'color:#91e5ff;', '');

//global
window._w = window.innerWidth;
window._h = window.innerHeight;
window._scroll = 0;
window._velocity = 0;

//Load
window.addEventListener('load', (e) => {
  onLoad();
});
//Resize
window.addEventListener('resize', (e) => {
  onResize();
});
//mousemove
window.addEventListener('mousemove', (e) => {
  //   console.log(getMouse(e).x);
});
