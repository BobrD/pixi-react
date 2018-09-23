import * as ReactFiberReconciler from 'react-reconciler';
// @ts-ignore
import pkg from '../../package.json'
import {hostconfig} from './hostconfig'

export const ReactPixiLayout = ReactFiberReconciler(hostconfig);
export const VERSION = pkg.version;
export const PACKAGE_NAME = pkg.name;
