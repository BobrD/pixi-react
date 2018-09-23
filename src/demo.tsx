import Application from "./elements/Application";
import {render} from "./render/render";
import * as React from "react";
import {SomeApp} from "./someApp";

const renderer = new PIXI.WebGLRenderer();

const stage = new PIXI.Container();

const app = new Application({stage, width: 800, height: 600});

render(<SomeApp />, app);

document.body.appendChild(renderer.view);

PIXI.ticker.shared.add(() => {
  renderer.render(stage);

  app.onTick();
});
