import {
  AnyAction
} from 'redux';

export type ActionHook = (action: AnyAction, getState?: () => any) => void;
export type ActionHookEmpty = () => void;

export type Hooks = {
  [desc: string]: ActionHook[]
}
