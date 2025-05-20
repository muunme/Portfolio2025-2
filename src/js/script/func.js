/*

Func

--------------------------------------------------------------------*/
console.log('%c Set %c %c func.js %c', 'color:white; background-color:#56b2e3; padding:0px 1px; margin:2px; border-radius:100vw;', '', 'color:#91e5ff;', '');


window.getPxByVw = (px = 0, width = _w) => { const fvw = px / (width / 100); return fvw;};
window.getMouse = (e) => { let mouse = { x: e.clientX, y: e.clientY }; return mouse;};
window.financial = (x) => {return Number.parseFloat(x).toFixed(2);};
