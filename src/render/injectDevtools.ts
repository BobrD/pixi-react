import {PACKAGE_NAME, ReactPixiLayout, VERSION} from "../reconciler/reconciler";

/**
 * Inject into React Devtools
 */
export const injectDevtools = () => {
  ReactPixiLayout.injectIntoDevTools({
    // @ts-ignore
    bundleType: process.env.NODE_ENV !== 'production' ? 1 : 0,
    version: VERSION,
    rendererPackageName: PACKAGE_NAME,
    findHostInstanceByFiber: ReactPixiLayout.findHostInstance,
  })
};
