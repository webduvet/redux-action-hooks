/*
 *
*/

import {
  _attach
} from './internal/attach'

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
//export const _container: {[s: string]: Hooks} = { hooks: {} };
export const _container = new WeakMap();

function middlewareFactory(hooks: Object) {
  return function (store: Store) {
    // reset the container whenever we applyMiddleware
    // NOTE: this supports only single store app
    _container.set(store, {});
    return (next: Function) => (action: AnyAction) => {
      // NOTE
      // by calling the action right here we execute the synchrounous flow BEFORE our hook
      // effectively triggering our hooks as last in the remaining queue
      next(action);
      (_container.get(store).hooks[action.type] || [])
      .forEach((hook: ActionHook) => {
        hook({ action, getState: store.getState, dispatch: store.dispatch });
      });
    };
  }
}

/**
 * @desc
 * redux middleware
 * execute each hook based on given action type
 *
 * @return void
 */

export default function Hooks() {
  const _container = {};
  return {
    middleware: middlewareFactory(_container),
    attach: _attach(_container)
  }
}

/*
export default (store: Store) => {
  // reset the container whenever we applyMiddleware
  // NOTE: this supports only single store app
  _container.set(store, {});
  return (next: Function) => (action: AnyAction) => {
    // NOTE
    // by calling the action right here we execute the synchrounous flow BEFORE our hook
    // effectively triggering our hooks as last in the remaining queue
    next(action);
    (_container.get(store).hooks[action.type] || [])
    .forEach((hook: ActionHook) => {
      hook({ action, getState: store.getState, dispatch: store.dispatch });
    });
  };
}
*/
