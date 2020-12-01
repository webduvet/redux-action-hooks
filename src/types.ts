import {
  AnyAction
} from 'redux';

export type HookParams = {
  action: AnyAction,
  getState: (...a: any) => any,
  dispatch: (...a: any) => any
}

export type ActionHook = (h: HookParams) => void;
export type ActionHookEmpty = () => void;

export type Hooks = {
  [desc: string]: ActionHook[]
}
