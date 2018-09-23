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

const noStyle = {};

export default abstract class BaseElement<T extends PIXI.DisplayObject = PIXI.DisplayObject> {

  private _layoutDirty = true;

  children = [];

  displayObject = this.createDisplayObject();

  layoutNode = Yoga.Node.create();

  onLayoutCallback = null;

  hitArea = new PIXI.Rectangle();

  cachedLayout = { left: 0, top: 0, width: 0, height: 0, x: 0, y: 0 };

  style: any = {};

  anchorX = 0.5;

  anchorY = 0.5;

  scaleX = 1;

  scaleY = 1;

  root;

  abstract hasChild (child);

  abstract addChild (child);

  abstract addChildAt (child, index);

  abstract removeChild (child);

  abstract removeChildAt (child, index);

  abstract setChildIndex(child, index);

  abstract getChildIndex (child);

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
          this.displayObject.removeListener(key, oldValue);
        }
        if (newValue) {
          this.displayObject.on(key, newValue);
        }
      }
    }

    
    this.displayObject.interactive = isInteractive;
    
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
    
    this.displayObject.alpha = this.parsePercentage(1, this.style.alpha);

    const { props, list, count } = this.constructor.defaultProps;

    for (let i = 0; i < count; i++) {
      const key = list[i];
      const newValue = this.style[key];
      const newValueIsUndefined = newValue === undefined;

      if (newValueIsUndefined || this.style[key] !== undefined) {
        this.displayObject[key] = newValueIsUndefined ? props[key] : newValue;
      }
    }

    let anchorX = this.parsePercentage(0.5, this.style.anchorX);

    let anchorY = this.parsePercentage(0.5, this.style.anchorY);

    let scaleX = this.parsePercentage(1, this.style.scaleX);

    let scaleY = this.parsePercentage(1, this.style.scaleY);

    const anchorsDirty = anchorX !== this.anchorX || anchorY !== this.anchorY || scaleX !== this.scaleX || scaleY !== this.scaleY;

    if (anchorsDirty) {
      this.anchorX = anchorX;
      this.anchorY = anchorY;
      
      this.displayObject.scale.x = this.scaleX = scaleX;
      
      this.displayObject.scale.y = this.scaleY = scaleY;
    }

    if (layoutDirty || anchorsDirty) {
      this.layoutDirty = true;
    }
  }

  applyLayout () {
    const newLayout = this.layoutNode.getComputedLayout();
    const cached = this.cachedLayout;

    const layoutDirty = (
      this.layoutDirty ||
      newLayout.left !== cached.left ||
      newLayout.top !== cached.top ||
      newLayout.width !== cached.width ||
      newLayout.height !== cached.height
    );

    if (layoutDirty) {
      
      cached.x = newLayout.left;
      cached.y = newLayout.top;
      cached.width = newLayout.width;
      cached.height = newLayout.height;

      this.hitArea.width = cached.width;
      this.hitArea.height = cached.height;

      const offsetX = this.anchorX * cached.width;
      const offsetY = this.anchorY * cached.height;

      
      this.displayObject.position.x = cached.x + offsetX;
      
      this.displayObject.position.y = cached.y + offsetY;

      
      this.onLayout(cached.x, cached.y, cached.width, cached.height);

      if (this.onLayoutCallback) {
        
        this.onLayoutCallback(cached.x, cached.y, cached.width, cached.height);
      }

      this.layoutDirty = false;
    }
  }

  abstract onLayout (x: number, y: number, width: number, height: number);

  destroy () {
    this.displayObject.destroy();
    this.displayObject = null;
    
    this.layoutNode.free();
    this.layoutNode = null;
  }

  createDisplayObject (): T {
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

    if (!this._defaultProps) {

      const props = this.listDefaultProps();
      const list = Object.keys(props);
      const count = list.length;


      this._defaultProps = { props, list, count };

      this._defaultProps.count = this._defaultProps.list.length;
    }


    return this._defaultProps;
  }

  private parsePercentage (defaultValue: number, value?: string | number): number {
    if (value === undefined) {
      return defaultValue;
    }

    if (typeof value === 'string') {
      return value.endsWith('%') ? Number(value.substring(1, 0)) * 0.01 : Number(value);
    }

    return value;
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
