import * as Animated from 'animated';
import * as Easing from 'animated/lib/Easing';
import * as ReactFiberReconciler from 'react-reconciler';
import * as invariant from 'fbjs/lib/invariant';
import ContainerElement from './elements/Container';
import SpriteElement from './elements/Sprite';
import NineSliceSpriteElement from './elements/NineSliceSprite';
import TilingSpriteElement from './elements/TilingSprite';
import GraphicsElement from './elements/Graphics';
import RectangleElement from './elements/Rectangle';
import TextElement from './elements/Text';
import Stage from './Stage';

const UPDATE_SIGNAL = {};
// @ts-ignore
const performance = window.performance || window.msPerformance || window.webkitPerformance;
const _registeredElements = {};

function appendChild (parent, child) {
  if (parent.addChild) {
    parent.addChild(child);

    if (typeof child.didMount === 'function') {
      child.didMount.call(child, child, parent)
    }
  }
}

function removeChild (parent, child) {
  if (typeof child.willUnmount === 'function') {
    child.willUnmount.call(child, child, parent)
  }

  parent.removeChild(child);
  child.destroy()
}

function insertBefore (parent, child, beforeChild) {
  invariant(child !== beforeChild, 'PixiFiber cannot insert node before itself');

  const childExists = parent.children.indexOf(child) !== -1;
  const index = parent.getChildIndex(beforeChild);

  childExists ? parent.setChildIndex(child, index) : parent.addChildAt(child, index)

}

function commitUpdate (instance, updatePayload, type, oldProps, newProps, internalInstanceHandle) {
  instance.applyProps(oldProps, newProps);
}

const ReactPixiLayout = ReactFiberReconciler({

  getRootHostContext: function (rootContainerInstance) {
    return {root: rootContainerInstance};
  },

  getChildHostContext: function () {
    return {};
  },

  getPublicInstance: function (inst) {
    return inst;
  },

  prepareForCommit: function () {
    // Noop
  },

  resetAfterCommit: function () {
    // Noop
  },

  createInstance: function (type, props, internalInstanceHandle, hostContext) {
    const ctor = _registeredElements[type];
    invariant(ctor, 'ReactPixiLayout does not support the type: `%s`.', type);
    const instance = new ctor();
    instance.root = hostContext.root;
    instance.applyProps({}, props);
    return instance;
  },

  appendInitialChild: appendChild,


  finalizeInitialChildren: function (pixiElement, type, props, rootContainerInstance) {
    return false;
  },

  prepareUpdate: function (pixiElement, type, oldProps, newProps, rootContainerInstance, hostContext) {
    return UPDATE_SIGNAL;
  },

  shouldSetTextContent: function (type, props) {
    return false;
  },

  shouldDeprioritizeSubtree: function (type, props) {
    const isAlphaVisible = typeof props.alpha === 'undefined' || props.alpha > 0;
    const isRenderable = typeof props.renderable === 'undefined' || props.renderable === true;
    const isVisible = typeof props.visible === 'undefined' || props.visible === true;

    return !(isAlphaVisible && isRenderable && isVisible)
  },

  createTextInstance: function (text, rootContainerInstance, internalInstanceHandle) {
    invariant(false, 'ReactPixiLayout does not support text instances. Use Text component instead.');
  },

  now: function () {
    return performance.now();
  },

  isPrimaryRenderer: false,

  supportsMutation: true,

  /**
   * -------------------------------------------
   * Mutation
   * -------------------------------------------
   */

  appendChild,

  appendChildToContainer: appendChild,

  removeChild,

  removeChildFromContainer: removeChild,

  insertBefore,

  insertInContainerBefore: insertBefore,

  commitUpdate,

  commitMount(instance, updatePayload, type, oldProps, newProps) {
    // noop
  },

  commitTextUpdate: function (textInstance, oldText, newText) {
    // Noop
  },

  resetTextContent: function (pixiElement) {
    // Noop
  },
});

export function registerElement (name, element) {
  _registeredElements[name] = element;
  return name;
}

export const Container: any = 'Container';
export const Text: any = 'Text';
export const Sprite: any = 'Sprite';
export const TilingSprite: any = 'TilingSprite';
export const NineSliceSprite: any = 'NineSliceSprite';
export const Graphics: any = 'Graphics';
export const Rectangle: any = 'Rectangle';

registerElement(Container, ContainerElement);
registerElement(Text, TextElement);
registerElement(Sprite, SpriteElement);
registerElement(TilingSprite, TilingSpriteElement);
registerElement(NineSliceSprite, NineSliceSpriteElement);
registerElement(Graphics, GraphicsElement);
registerElement(Rectangle, RectangleElement);

const animatedExport = {
  Container: Animated.createAnimatedComponent(Container),
  Text: Animated.createAnimatedComponent(Text),
  Sprite: Animated.createAnimatedComponent(Sprite),
  TilingSprite: Animated.createAnimatedComponent(TilingSprite),  
  NineSliceSprite: Animated.createAnimatedComponent(NineSliceSprite),  
  Graphics: Animated.createAnimatedComponent(Graphics),
  Rectangle: Animated.createAnimatedComponent(Rectangle),
  Easing,
  ...Animated
};

export { ReactPixiLayout, Stage, animatedExport as Animated };
