import TinyColor from '../util/TinyColor';
import Graphics from './Graphics';

// @ts-ignore
const DEFAULT_COLOR = new TinyColor(0);

export interface IProps {
  style: any
}

export default class Rectangle extends Graphics {

  _color = DEFAULT_COLOR;

  applyProps (oldProps, newProps) {
    super.applyProps(oldProps, newProps);
    // @ts-ignore
    this._color = this.style.color !== undefined
      // @ts-ignore
      ? new TinyColor(this.style.color)
      : DEFAULT_COLOR;
  }

  onLayout (x, y, width, height) {
    super.onLayout(x, y, width, height);
    const intColor = parseInt('0x' + this._color.toHex(), 16);
    // @ts-ignore
    this.displayObject.clear();
    // @ts-ignore
    this.displayObject.beginFill(intColor, this._color.getAlpha());
    // @ts-ignore
    this.displayObject.drawRect(0, 0, width, height);
    // @ts-ignore
    this.displayObject.endFill();
  }

};
