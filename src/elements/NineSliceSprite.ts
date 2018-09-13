import * as PIXI from 'pixi.js';
import Container from './Container';

export default class Sprite<T> extends Container<T> {

  createDisplayObject () {
    return new PIXI.mesh.NineSlicePlane(PIXI.Texture.EMPTY);
  }

  applyProps (oldProps, newProps) {
    super.applyProps(oldProps, newProps);
    // @ts-ignore
    const texture = newProps.texture ? PIXI.Texture.fromImage(newProps.texture) : PIXI.Texture.Empty;
    // @ts-ignore
    this.displayObject.texture = texture;
    // @ts-ignore
    this.displayObject.bottomHeight = newProps.bottomHeight || 0;
    // @ts-ignore
    this.displayObject.rightWidth = newProps.rightWidth || 0;
    // @ts-ignore
    this.displayObject.topHeight = newProps.topHeight || 0;
    // @ts-ignore
    this.displayObject.leftWidth = newProps.leftWidth || 0;
  }

  onLayout (x, y, width, height) {
    super.onLayout(x, y, width, height);
    // @ts-ignore
    if (this.displayObject.texture) {
      // @ts-ignore
      this.displayObject.width = width;
      // @ts-ignore
      this.displayObject.height = height;
    }
  }

};
