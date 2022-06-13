/** @typedef {typeof __propDef.props}  DirectionalPerspectiveCameraProps */
/** @typedef {typeof __propDef.events}  DirectionalPerspectiveCameraEvents */
/** @typedef {typeof __propDef.slots}  DirectionalPerspectiveCameraSlots */
import type { Vector3 } from "three";
export default class DirectionalPerspectiveCamera extends SvelteComponentTyped<
  {
    position?: number[];
    target?: number[];
    fov?: number;
    near?: number;
    far?: number;
    zoom?: number;
    direction?: Vector3;
    viewOffset?: {
      fullWidth: number;
      fullHeight: number;
      x: number;
      y: number;
      width: number;
      height: number;
    };
  },
  {
    [evt: string]: CustomEvent<any>;
  },
  {}
> {}
export type DirectionalPerspectiveCameraProps = typeof __propDef.props;
export type DirectionalPerspectiveCameraEvents = typeof __propDef.events;
export type DirectionalPerspectiveCameraSlots = typeof __propDef.slots;
import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
  props: {
    position?: number[];
    target?: number[];
    fov?: number;
    near?: number;
    far?: number;
    zoom?: number;
    direction?: Vector3;
    viewOffset?: {
      fullWidth: number;
      fullHeight: number;
      x: number;
      y: number;
      width: number;
      height: number;
    };
  };
  events: {
    [evt: string]: CustomEvent<any>;
  };
  slots: {};
};
export {};
