import Container from './Container';
import * as _ from 'lodash';

export default class Application extends Container {

  constructor (props) {
    super();

    this.displayObject = props.stage;

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
      this.layoutDirty = true;
    }

    const newStyle = Array.isArray(style) ? _.merge(...style) : { ...style };

    newStyle.width = width;
    newStyle.height = height;
    nextProps.style = newStyle;

    super.applyProps(oldProps, nextProps);
  }

  onTick () {
    if (this.layoutDirty) {
      this.layoutNode.calculateLayout();
      this.applyLayout();
    }
  }
};
