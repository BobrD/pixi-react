import * as PIXI from 'pixi.js';
import BaseElement from './BaseElement';

export default class Text extends BaseElement {

  constructor () {
    super();
    // @ts-ignore
    this.layoutNode.setMeasureFunc((width, widthMode, height, heightMode) => this.measure(width, widthMode, height, heightMode));
    // @ts-ignore
    this.sizeData = { width: 0, height: 0 };
    // @ts-ignore
    this.textStyle = new PIXI.TextStyle();
  }

  createDisplayObject () {
    return new PIXI.Text();
  }

  applyProps (oldProps, newProps) {
    super.applyProps(oldProps, newProps);
    // @ts-ignore
    this.displayObject.text = newProps.text || '';

    // @ts-ignore
    this.textStyle.reset();

    // @ts-ignore
    for (var key in this.style) {
      // @ts-ignore
      this.textStyle[key] = this.style[key];
    }

    // @ts-ignore
    this.displayObject.style = this.textStyle;
  }

  measure (width, widthMode, height, heightMode) {
    // @ts-ignore
    const { text, style } = this.displayObject;

    const previousWordWrapWidth = style.wordWrapWidth;
    style.wordWrapWidth = width;
    const metrics = PIXI.TextMetrics.measureText(text, style);
    style.wordWrapWidth = previousWordWrapWidth;

    let calculatedWidth = metrics.width;
    let calculatedHeight = metrics.height;
    const scale = calculatedWidth / calculatedHeight;

    /* eslint-disable */
    if (width !== width && height === height) {
      calculatedWidth = height * scale;
      calculatedHeight = height;
    } else if (width === width && height !== height) {
      calculatedWidth = width;
      calculatedHeight = width / scale;
    }
    /* eslint-enable */

    // @ts-ignore
    this.sizeData.width = calculatedWidth;
    // @ts-ignore
    this.sizeData.height = calculatedHeight;

    // @ts-ignore
    return this.sizeData;
  }

  onLayout (x, y, width, height) {
    this.displayObject.pivot.x = this.anchorX * width;
    this.displayObject.pivot.y = this.anchorY * height;
    // @ts-ignore
    this.displayObject.style.wordWrapWidth = width;
    // @ts-ignore
    this.displayObject.dirty = true;
  }

};
