import * as PIXI from 'pixi.js';
import AbstractContainer from "./AbstractContainer";

export default class Text extends AbstractContainer<PIXI.Text> {

  sizeData = { width: 0, height: 0 };

  textStyle = new PIXI.TextStyle({});

  constructor () {
    super();

    this.layoutNode.setMeasureFunc(this.measure as any);
  }

  createDisplayObject () {
    return new PIXI.Text();
  }

  applyProps (oldProps, newProps) {
    super.applyProps(oldProps, newProps);
    
    this.displayObject.text = newProps.text || '';

    this.textStyle.reset();

    for (var key in this.style) {
      this.textStyle[key] = this.style[key];
    }

    this.displayObject.style = this.textStyle;
  }

  private measure = (width, widthMode, height, heightMode) => {
    
    const { text, style } = this.displayObject;

    const previousWordWrapWidth = style.wordWrapWidth;
    style.wordWrapWidth = width;
    const metrics = PIXI.TextMetrics.measureText(text, style);
    style.wordWrapWidth = previousWordWrapWidth;

    let calculatedWidth = metrics.width;
    let calculatedHeight = metrics.height;

    const scale = calculatedWidth / calculatedHeight;

    if (width !== width && height === height) {
      calculatedWidth = height * scale;
      calculatedHeight = height;
    } else if (width === width && height !== height) {
      calculatedWidth = width;
      calculatedHeight = width / scale;
    }

    this.sizeData.width = calculatedWidth;
    this.sizeData.height = calculatedHeight;

    
    return this.sizeData;
  }

  onLayout (x, y, width, height) {
    this.displayObject.pivot.x = this.anchorX * width;
    this.displayObject.pivot.y = this.anchorY * height;
    
    this.displayObject.style.wordWrapWidth = width;
    
    this.displayObject.dirty = true;
  }
}
