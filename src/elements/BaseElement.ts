import * as PIXI from 'pixi.js';
import * as Yoga from 'yoga-layout';
import invariant from 'fbjs/lib/invariant';
import * as _ from 'lodash';
import applyLayoutProperties from '../applyLayoutProperties';

const interactiveProps = {
  pointerdown: 'onDown',
  pointermove: 'onMove',
  pointerup: 'onUp',
  pointerupoutside: 'onUpOutside',
  pointertap : 'onClick',
  pointerout: 'onOut',
  pointerover: 'onOver',
  pointercancel: 'onCancel'
};

const interactivePropList = Object.keys(interactiveProps);
const interactivePropCount = interactivePropList.length;

const childNotSupported = () => invariant(false, 'Element does not support children.');
const noStyle = {};

// @ts-ignore
export default class BaseElement {

  _layoutDirty = true;
  displayObject = this.createDisplayObject();
  layoutNode = Yoga.Node.create();
  onLayoutCallback = null;
  hitArea = new PIXI.Rectangle();
  cachedLayout = { left: 0, top: 0, width: 0, height: 0 };
  style = {};
  anchorX = 0.5;
  anchorY = 0.5;
  scaleX = 1;
  scaleY = 1;
  root = null;

  hasChild (child) {
    childNotSupported();
  }

  addChild (child) {
    childNotSupported();
  }

  addChildAt (child, index) {
    childNotSupported();
  }

  removeChild (child) {
    childNotSupported();
  }

  removeChildAt (child, index) {
    childNotSupported();
  }

  setChildIndex(child, index) {
    childNotSupported();
  }

  getChildIndex (child) {
    childNotSupported();
  }

  applyInteractiveListeners (oldProps, newProps) {
    let isInteractive = false;

    for (let i = 0; i < interactivePropCount; i++) {
      const key = interactivePropList[i];
      const propName = interactiveProps[key];
      const oldValue = oldProps[propName];
      const newValue = newProps[propName];

      isInteractive = isInteractive || !!newValue;

      if (oldValue !== newValue) {
        if (oldValue) {
          // @ts-ignore
          this.displayObject.removeListener(key, oldValue);
        }
        if (newValue) {
          // @ts-ignore
          this.displayObject.on(key, newValue);
        }
      }
    }

    // @ts-ignore
    this.displayObject.interactive = isInteractive;
    // @ts-ignore
    this.displayObject.hitArea = isInteractive ? this.hitArea : null;
  }

  applyProps (oldProps, newProps) {
    this.applyInteractiveListeners(oldProps, newProps);
    this.onLayoutCallback = newProps.onLayout || null;

    let newStyle = newProps.style || noStyle;

    if (Array.isArray(newStyle)) {
      newStyle = _.merge({}, ...newStyle);
    }

    let layoutDirty = applyLayoutProperties(this.layoutNode, this.style, newStyle);

    this.style = newStyle;
    // @ts-ignore
    this.displayObject.alpha = this.parsePercentage(this.style.alpha, 1);

    // @ts-ignore
    const { props, list, count } = this.constructor.defaultProps;

    for (let i = 0; i < count; i++) {
      const key = list[i];
      const newValue = this.style[key];
      const newValueIsUndefined = newValue === undefined;

      if (newValueIsUndefined || this.style[key] !== undefined) {
        this.displayObject[key] = newValueIsUndefined ? props[key] : newValue;
      }
    }

    // @ts-ignore
    let anchorX = this.parsePercentage(this.style.anchorX, 0.5);
    // @ts-ignore
    let anchorY = this.parsePercentage(this.style.anchorY, 0.5);
    // @ts-ignore
    let scaleX = this.parsePercentage(this.style.scaleX, 1);
    // @ts-ignore
    let scaleY = this.parsePercentage(this.style.scaleY, 1);

    const anchorsDirty = anchorX !== this.anchorX || anchorY !== this.anchorY || scaleX !== this.scaleX || scaleY !== this.scaleY;

    if (anchorsDirty) {
      this.anchorX = anchorX;
      this.anchorY = anchorY;
      // @ts-ignore
      this.displayObject.scale.x = this.scaleX = scaleX;
      // @ts-ignore
      this.displayObject.scale.y = this.scaleY = scaleY;
    }

    if (layoutDirty || anchorsDirty) {
      this.layoutDirty = true;
    }
  }

  applyLayout () {
    const newLayout = this.layoutNode.getComputedLayout();
    const cached = this.cachedLayout;

    const layoutDirty = this.layoutDirty || newLayout.left !== cached.left || newLayout.top !== cached.top ||
      newLayout.width !== cached.width || newLayout.height !== cached.height;

    if (layoutDirty) {
      // @ts-ignore
      cached.x = newLayout.left;
      // @ts-ignore
      cached.y = newLayout.top;
      cached.width = newLayout.width;
      cached.height = newLayout.height;

      this.hitArea.width = cached.width;
      this.hitArea.height = cached.height;

      const offsetX = this.anchorX * cached.width;
      const offsetY = this.anchorY * cached.height;

      // @ts-ignore
      this.displayObject.position.x = cached.x + offsetX;
      // @ts-ignore
      this.displayObject.position.y = cached.y + offsetY;

      // @ts-ignore
      this.onLayout(cached.x, cached.y, cached.width, cached.height);

      if (this.onLayoutCallback) {
        // @ts-ignore
        this.onLayoutCallback(cached.x, cached.y, cached.width, cached.height);
      }

      this.layoutDirty = false;
    }
  }

  onLayout (x, y, width, height) {
  }

  parsePercentage (value, defaultValue) {
    if (value === undefined) {
      return defaultValue;
    }

    if (typeof value === 'string') {
      return value.endsWith('%') ? Number(value.substring(1, 0)) * 0.01 : Number(value);
    }

    return value;
  }

  destroy () {
    // @ts-ignore
    this.displayObject.destroy();
    this.displayObject = null;
    this.layoutNode.free();
    this.layoutNode = null;
  }

  createDisplayObject (): PIXI.Container {
    invariant(false, 'Cannot instantiate base class');

    return void 0;
  }

  get layoutDirty () {
    return this._layoutDirty;
  }

  set layoutDirty (value) {
    this._layoutDirty = value;

    if (!value) {
      return;
    }

    if (this.root && this.root !== this) {
      this.root.layoutDirty = true;
    }
  }

  static get defaultProps () {
    // @ts-ignore
    if (!this._defaultProps) {

      const props = this.listDefaultProps();
      const list = Object.keys(props);
      const count = list.length;

      // @ts-ignore
      this._defaultProps = { props, list, count };
      // @ts-ignore
      this._defaultProps.count = this._defaultProps.list.length;
    }

    // @ts-ignore
    return this._defaultProps;
  }

  static listDefaultProps () {
    return {
      buttonMode: false,
      cacheAsBitmap: false,
      cursor: 'auto',
      filterArea: null,
      filters: null,
      mask: null,
      renderable: true,
      rotation: 0,
      visible: true,
      tint: 0xffffff
    };
  }

}
