import * as PIXI from 'pixi.js';
import Container from './Container';

export default class TilingSprite<T extends PIXI.extras.TilingSprite = PIXI.extras.TilingSprite> extends Container<T> {

  createDisplayObject () {
    return new PIXI.extras.TilingSprite(PIXI.Texture.EMPTY) as T;
  }

  applyProps (oldProps, newProps) {
    super.applyProps(oldProps, newProps);
    
    this.displayObject.texture = newProps.texture ? PIXI.Texture.fromImage(newProps.texture) : PIXI.Texture.EMPTY;
  }

  onLayout (x, y, width, height) {
    super.onLayout(x, y, width, height);
    
    if (this.displayObject.texture) {
      this.displayObject.width = width * this.scaleX;
      this.displayObject.height = height * this.scaleY;
    }
  }
}
