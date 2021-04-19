/*
 * 
*/

import {
  Store,
  AnyAction
} from 'redux';

import {
  Hooks,
  ActionHook,
  ActionHookEmpty
} from './types';

/**
 * @desc
 * singleton storing all the hooks
 */
export const _container: {[s: string]: Hooks} = { hooks: {} };

let counter = 0;
/**
 * @desc
 * redux middleware
 * execute each hook based on given action type
 *
 * @return void
 */
export default (store: Store) => {
  // reset the container whenever we applyMiddleware
  // NOTE: this supports only single store app
  _container.hooks = {};
  return (next: Function) => (action: AnyAction) => {
    // NOTE
    // by calling the action right here we execute the synchrounous flow BEFORE our hook
    // effectively triggering our hooks as last in the remaining queue
    next(action);
    (_container.hooks[action.type] || [])
    .forEach((hook: ActionHook) => {
      hook({ action, getState: store.getState, dispatch: store.dispatch });
    });
  };
}
