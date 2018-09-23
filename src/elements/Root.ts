import Container from './Container';

export class Root extends Container {

  constructor() {
    super();
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
}
