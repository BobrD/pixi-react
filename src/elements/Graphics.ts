import * as PIXI from 'pixi.js';
import Container from './Container';

export default class Graphics<T> extends Container<T> {

  createDisplayObject () {
    return new PIXI.Graphics();
  }
};
