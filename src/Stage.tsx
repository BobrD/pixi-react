import * as React from 'react';
import * as PropTypes from 'prop-types';
import { ReactPixiLayout } from './index';
import Application from './elements/Application';

export default class Stage extends React.Component {

  static propTypes = {
    antialias: PropTypes.bool,
    autoStart: PropTypes.bool,
    backgroundColor: PropTypes.number,
    clearBeforeRender: PropTypes.bool,
    forceCanvas: PropTypes.bool,
    forceFXAA: PropTypes.bool,
    legacy: PropTypes.bool,
    powerPreference: PropTypes.string,
    preserveDrawingBuffer: PropTypes.bool,
    resolution: PropTypes.number,
    roundPixels: PropTypes.bool,
    sharedLoader: PropTypes.bool,
    sharedTicker: PropTypes.bool,
    transparent: PropTypes.bool,
    children: PropTypes.node,
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    style: PropTypes.object
  };

  componentDidMount() {
    // @ts-ignore
    const props = { view: this._canvas, ...this.props };

    // @ts-ignore
    this._applicationElement = new Application(props);
    // @ts-ignore
    this._applicationContainer = ReactPixiLayout.createContainer(this._applicationElement);

    // @ts-ignore
    ReactPixiLayout.updateContainer(this.props.children, this._applicationContainer, this);
  }

  componentDidUpdate (prevProps, prevState) {
    // @ts-ignore
    this._applicationElement.applyProps(prevProps, this.props);
    // @ts-ignore
    ReactPixiLayout.updateContainer(this.props.children, this._applicationContainer, this);
  }

  componentWillUnmount () {
    // @ts-ignore
    ReactPixiLayout.updateContainer(null, this._applicationContainer, this);
    // @ts-ignore
    this._applicationElement.destroy();
    // @ts-ignore
    this._applicationElement = null;
    // @ts-ignore
    this._applicationContainer = null;
  }

  render () {
    // @ts-ignore
    return <canvas ref={ ref => this._canvas = ref } />;
  }

};
