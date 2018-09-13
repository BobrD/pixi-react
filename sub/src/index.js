import { TYPES, PixiComponent } from './utils/element'
import { render } from './render/index'
import Stage from './stage/index'
import { PixiFiber } from './reconciler/index'
import { Provider, withPixiApp } from './stage/provider'

/**
 * -------------------------------------------
 * Public API
 * -------------------------------------------
 */

export { render, Stage, Provider, withPixiApp, PixiComponent, PixiFiber }

export const BitmapText = TYPES.BitmapText
export const Container = TYPES.Container
export const Graphics = TYPES.Graphics
export const NineSlicePlane = TYPES.NineSlicePlane
export const ParticleContainer = TYPES.ParticleContainer
export const Sprite = TYPES.Sprite
export const Text = TYPES.Text
export const TilingSprite = TYPES.TilingSprite
export const Mesh = TYPES.Mesh
export const Rope = TYPES.Rope
