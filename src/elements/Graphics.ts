import * as PIXI from 'pixi.js';
import AbstractContainer from './AbstractContainer';

export default class Graphics<T extends PIXI.Graphics = PIXI.Graphics> extends AbstractContainer<T> {

  createDisplayObject(): T {
    return new PIXI.Graphics() as T;
  }
}
