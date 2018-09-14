import * as PIXI from 'pixi.js';
import AbstractContainer from './AbstractContainer';

export default class Sprite<T extends PIXI.mesh.NineSlicePlane = PIXI.mesh.NineSlicePlane> extends AbstractContainer<T> {
  createDisplayObject () {
    return new PIXI.mesh.NineSlicePlane(PIXI.Texture.EMPTY) as T;
  }

  applyProps (oldProps, newProps) {
    super.applyProps(oldProps, newProps);

    this.displayObject.texture = newProps.texture ? PIXI.Texture.fromImage(newProps.texture) : PIXI.Texture.EMPTY;
    
    this.displayObject.bottomHeight = newProps.bottomHeight || 0;
    
    this.displayObject.rightWidth = newProps.rightWidth || 0;
    
    this.displayObject.topHeight = newProps.topHeight || 0;
    
    this.displayObject.leftWidth = newProps.leftWidth || 0;
  }

  onLayout (x, y, width, height) {
    super.onLayout(x, y, width, height);
    
    if (this.displayObject.texture) {
      
      this.displayObject.width = width;
      
      this.displayObject.height = height;
    }
  }
}
