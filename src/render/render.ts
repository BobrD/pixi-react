import {ReactPixiLayout} from "../reconciler/reconciler";
import {injectDevtools} from "./injectDevtools";

export function render(element, container, callback = undefined) {
  const root = ReactPixiLayout.createContainer(container);

  // schedules a top level update
  ReactPixiLayout.updateContainer(element, root, undefined, callback);

  injectDevtools();

  // return the root instance
  return ReactPixiLayout.getPublicRootInstance(root)
}
