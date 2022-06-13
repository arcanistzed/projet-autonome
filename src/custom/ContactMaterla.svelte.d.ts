import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
  props: {
    materials?: Material | null | undefined;
    contactMaterial?: ContactMaterial | undefined;
  };
  slots: {
    default: {};
  };
  getters: {
    ContactMaterial: any;
  };
  events: {};
};
export declare type ContactMaterialProps = typeof __propDef.props;
export declare type ContactMaterialEvents = typeof __propDef.events;
export declare type ContactMaterialSlots = typeof __propDef.slots;
export default class ContactMaterial extends SvelteComponentTyped<
  ContactMaterialProps,
  ContactMaterialEvents,
  ContactMaterialSlots
> {
  get ContactMaterial(): any;
}
export {};
