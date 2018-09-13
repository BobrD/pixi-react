import * as PIXI from 'pixi.js';
import * as Yoga from 'yoga-layout';
import BaseElement from './BaseElement';

export default class Sprite<T> extends BaseElement<T> {

  sizeData = { width: 0, height: 0 };

  constructor () {
    super();
    // @ts-ignore
    this.layoutNode.setMeasureFunc((width, widthMode, height, heightMode) => this.measure(width, widthMode, height, heightMode));
  }

  createDisplayObject () {
    return new PIXI.Sprite();
  }

  applyProps (oldProps, newProps) {
    super.applyProps(oldProps, newProps);

    if (oldProps.texture !== newProps.texture) {
      const texture = newProps.texture ? PIXI.Texture.fromImage(newProps.texture) : null;
      this.updateTexture(texture);
    }
  }

  updateTexture (texture) {
    if (texture && !texture.baseTexture.hasLoaded) {
      // @ts-ignore
      texture.once('update', () => this.updateTexture(this.displayObject.texture));
    }

    // @ts-ignore
    this.displayObject.texture = texture;
    // @ts-ignore
    this.displayObject.pivot.x = texture ? texture.orig.width * this.anchorX : 0;
    // @ts-ignore
    this.displayObject.pivot.y = texture ? texture.orig.height * this.anchorY : 0;

    // Due to custom measure function, we have to manually flag
    // dirty when we update the texture
    // @ts-ignore
    this.layoutNode.markDirty();

    // @ts-ignore
    this.layoutDirty = true;
  }

  measure (width, widthMode, height, heightMode) {
    // @ts-ignore
    const texture = this.displayObject.texture;

    if (!texture || !texture.baseTexture.hasLoaded) {
      this.sizeData.width = this.sizeData.height = 0;
      return this.sizeData;
    }

    let calculatedWidth = texture.orig.width;
    let calculatedHeight = texture.orig.height;

    const scale = calculatedWidth / calculatedHeight;

    /* eslint-disable */
    if (width !== width && height === height || widthMode == Yoga.MEASURE_MODE_AT_MOST) {
      calculatedWidth = height * scale;
      calculatedHeight = height;
    } else if (width === width && height !== height || heightMode == Yoga.MEASURE_MODE_AT_MOST) {
      calculatedWidth = width;
      calculatedHeight = width / scale;
    }
    /* eslint-enable */

    this.sizeData.width = calculatedWidth;
    this.sizeData.height = calculatedHeight;

    return this.sizeData;
  }

  onLayout (x, y, width, height) {
    // @ts-ignore
    if (this.displayObject.texture) {
      // @ts-ignore
      this.displayObject.width = width * this.scaleX;
      // @ts-ignore
      this.displayObject.height = height * this.scaleY;
      // @ts-ignore
      if (this.displayObject.scale.x < 0 !== this.scaleX < 0) {
        // @ts-ignore
        this.displayObject.scale.x *= -1;
      }
      // @ts-ignore
      if (this.displayObject.scale.y < 0 !== this.scaleY < 0) {
        // @ts-ignore
        this.displayObject.scale.y *= -1;
      }
    }
  }

};
