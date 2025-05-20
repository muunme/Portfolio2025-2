/*!
 * Parallax
 * @version: 0.1.4
 * @date   : 2023-09-7
 * @license: Copyright (c) 2023 m
 *
 **/
import { Pane } from 'tweakpane';
export default class KoalaPanels {
  constructor(opts) {}

  onInit(data) {
    this._callbacks = {};
    const PARAMS = {
      dotSize: {
        value: 20.0,
        min: 0.1,
        max: 100.0,
        step: 0.1,
      },
      dotSize: { value: _w / 100, min: 10, max: _w, step: 0.1 },
      maxPoints: { value: _w / 4, min: 1, max: 9999, step: 1 },
      space: { value: _w / 50, min: 5, max: _w, step: 1 },
      pattern: {
        value: '0',
        options: {
          0: '0',
          1: '1',
          2: '2',
          3: '3',
          4: '4',
          5: '5',
          6: '6',
          7: '7',
          8: '8',
          9: '9',
          10: '10',
          11: '11',
          12: '12',
          13: '13',
          14: '14',
          15: '15',
          16: '16',
          17: '17',
          18: '18',
          19: '19',
        },
      },
      // overlay: {
      //   value: { r: 1, g: 0, b: 0.33 },
      //   type: 'color', // 色
      //   colorType: 'float', // float or int
      // },
    };
    const pane = new Pane();
    for (const key in PARAMS) {
      const param = PARAMS[key];
      const options = {
        label: key.charAt(0).toUpperCase() + key.slice(1),
      };

      if ('min' in param) options.min = param.min;
      if ('max' in param) options.max = param.max;
      if ('step' in param) options.step = param.step;
      if ('options' in param) options.options = param.options;
      if (param.type === 'color') options.color = { type: param.colorType || 'float' };

      const binding = pane.addBinding(param, 'value', options);

      binding.on('change', (ev) => {
        const callback = this._callbacks[key];
        if (callback) callback(ev.value);
      });
    }
  }

  setParamCallback(paramName, callback) {
    if (!this._callbacks) this._callbacks = {};
    this._callbacks[paramName] = callback;
  }
}
