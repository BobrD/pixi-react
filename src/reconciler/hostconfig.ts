import * as Animated from 'animated';
import * as Easing from 'animated/lib/Easing';

import * as invariant from 'fbjs/lib/invariant';
import ContainerElement from '../elements/Container';
import SpriteElement from '../elements/Sprite';
import NineSliceSpriteElement from '../elements/NineSliceSprite';
import TilingSpriteElement from '../elements/TilingSprite';
import GraphicsElement from '../elements/Graphics';
import RectangleElement from '../elements/Rectangle';
import TextElement from '../elements/Text';
import Stage from '../Stage';
import BaseElement from "../elements/BaseElement";
import Application from "../elements/Application";
import * as React from "react";

const _registeredElements: {[name: string]: new() => BaseElement} = {};

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

function insertBefore (parent: BaseElement, child: BaseElement, beforeChild: BaseElement) {
  invariant(child !== beforeChild, 'PixiFiber cannot insert node before itself');

  const childExists = parent.children.indexOf(child) !== -1;

  const index = parent.getChildIndex(beforeChild);

  childExists ? parent.setChildIndex(child, index) : parent.addChildAt(child, index)
}

export const hostconfig = {

  getRootHostContext (rootContainerInstance: Application) {
    return rootContainerInstance;
  },

  getChildHostContext(parentHostContext: BaseElement, type, rootContainerInstance: Application) {
    return rootContainerInstance;
  },

  getPublicInstance(instance) {
    return instance;
  },

  prepareForCommit() {
    // noop
  },

  resetAfterCommit() {
    // noop
  },

  createInstance(type: string, props: {}, internalInstanceHandle) {
    const ctor = _registeredElements[type];

    invariant(ctor, 'ReactPixiLayout does not support the type: `%s`.', type);

    const instance = new ctor();

    instance.root = internalInstanceHandle;

    instance.applyProps({}, props);

    return instance;
  },

  appendInitialChild: appendChild,


  finalizeInitialChildren(pixiElement, type, props, rootContainerInstance) {
    return false;
  },

  prepareUpdate(pixiElement, type, oldProps, newProps, rootContainerInstance, hostContext) {
    return {};
  },

  shouldSetTextContent(type, props) {
    return false;
  },

  shouldDeprioritizeSubtree(_, props) {
    const isAlphaVisible = typeof props.alpha === 'undefined' || props.alpha > 0;
    const isRenderable = typeof props.renderable === 'undefined' || props.renderable === true;
    const isVisible = typeof props.visible === 'undefined' || props.visible === true;

    return !(isAlphaVisible && isRenderable && isVisible)
  },

  createTextInstance(text, rootContainerInstance, internalInstanceHandle) {
    invariant(false, 'ReactPixiLayout does not support text instances. Use Text component instead.');
  },

  now() {
    return Date.now();
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

  commitUpdate (instance: BaseElement, updatePayload, type, oldProps, newProps, internalInstanceHandle) {
    instance.applyProps(oldProps, newProps);
  },

  commitMount(instance, updatePayload, type, oldProps, newProps) {
    // noop
  },

  commitTextUpdate(textInstance, oldText, newText) {
    // noop
  },

  resetTextContent(pixiElement) {
    // noop
  },
};

function registerElement <P, T extends BaseElement>(name, element: T): React.ComponentClass<P> {
  _registeredElements[name] = element;
  return name;
}

export const Container = registerElement('Container', ContainerElement);
export const Text = registerElement('Text', TextElement);
export const Sprite = registerElement('Sprite', SpriteElement);
export const TilingSprite = registerElement('TilingSprite', TilingSpriteElement);
export const NineSliceSprite = registerElement('NineSliceSprite', NineSliceSpriteElement);
export const Graphics = registerElement('Graphics', GraphicsElement);
export const Rectangle = registerElement('Rectangle', RectangleElement);

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

export { Stage, animatedExport as Animated };
