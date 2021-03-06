import * as PIXI from 'pixi.js';
import Container from './Container';

export default class Graphics<T extends PIXI.Graphics = PIXI.Graphics> extends Container<T> {

  createDisplayObject(): T {
    return new PIXI.Graphics() as T;
  }
}
