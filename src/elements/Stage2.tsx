import * as React from 'react';
import { ReactPixiLayout } from '../index';
import { Root } from './Root';

export interface IStageProps {
  renderer: PIXI.WebGLRenderer;
  ticker: PIXI.ticker.Ticker;
  mountNode: HTMLElement;
}

export class Stage2 extends React.Component<IStageProps> {
  private rootElement: Root;

  private rootContainer;

  componentDidMount() {
    const props = {...this.props};

    this.rootElement = new Root(props);

    this.rootContainer = ReactPixiLayout.createContainer(this.rootElement);

    ReactPixiLayout.updateContainer(this.props.children, this.rootContainer, this);
  }

  componentDidUpdate (prevProps, prevState) {
    this.rootElement.applyProps(prevProps, this.props);

    ReactPixiLayout.updateContainer(this.props.children, this.rootContainer, this);
  }

  componentWillUnmount () {
    ReactPixiLayout.updateContainer(null, this.rootContainer, this);

    this.rootElement.destroy();

    this.rootElement = undefined;

    this.rootContainer = undefined;
  }

  render() {
    return null;
  }
}