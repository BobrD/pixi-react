// @ts-ignore
import * as PIXI from 'pixi.js';
import Container from './Container';
import * as _ from 'lodash';

const optionKeys = [    
  'antialias',
  'autoStart',
  'autoResize',
  'backgroundColor',
  'clearBeforeRender',
  'forceCanvas',
  'forceFXAA',
  'height',
  'legacy',
  'powerPreference',
  'preserveDrawingBuffer',
  'resolution',
  'roundPixels',
  'sharedLoader',
  'sharedTicker',
  'transparent',
  'view',
  'width'
];

export default class Application<T> extends Container<T> {

  constructor (props) {
    super();
    const options = _.pick(props, optionKeys);
    // @ts-ignore
    this._application = new PIXI.Application(options);
    // @ts-ignore
    this._application.ticker.add(this.onTick, this);
    // @ts-ignore
    this.displayObject = this._application.stage;
    this.applyProps(props, props);
  }

  createDisplayObject () {
    // Don't use default display object creation
    return null;
  }

  applyProps (oldProps, newProps) {
    const { width, height } = newProps;
    const { style, ...nextProps } = newProps;

    if (oldProps.width !== width || oldProps.height !== height) {
      // @ts-ignore
      this._application.renderer.resize(width, height);
      this.layoutDirty = true;
    }

    const newStyle = Array.isArray(style) ? _.merge(...style) : { ...style };

    newStyle.width = width;
    newStyle.height = height;
    nextProps.style = newStyle;

    super.applyProps(oldProps, nextProps);
  }

  onTick (e) {
    if (this.layoutDirty) {
      this.layoutNode.calculateLayout();
      this.applyLayout();
    }
  }

};
