/*
 * @desc
 * simple side effects for redux
 * this effect pass all the actions further in the pipe
 * it also triggers the hook when the action type matches
 * the one registered
 * in the side effect the callback has access to dispatch and getState
 * the middleware is synchrounous only
 * as first think it calls next(action) which synchrounously run the rest of the middleware
 * and will update the store.
 * so getState function will return only the next state not previous.
 *
 * when dispatching an action from this middleware it will be dispatched
 * only after the action to which the effected is hooked is finalized
 *
 * usage:
 * if using redux-thunk
 * this need to go after thunk in the pipeline
 * if you use middleware to manage async action this need to go after
 * in the pipeline
 *
 * ideally hooks will sit in separate file
 * hooks.ts (hooks.js)
 *
 * and will be called on the beginning of dedicated reducer
 * in reducer:
 * import './hooks'
 * which will execute the hooks once.
 *
 * ofType(ActionTypes.PDF_DOCUMENT_FOLDER_SELECTED, (action: AnyAction) => {
 *   dispatch(newAction(action.payload.pick));
 * })
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

export const _container: {[s: string]: Hooks} = { hooks: {} };

export default (store: Store) => {
  // new hook object when creating middleware
  return (next: Function) => (action: AnyAction) => {
    // NOTE
    // never swallow the action as there could be other middleware designed to do it or expecting
    // the action
    // by calling the action right here we execute the synchrounous flow BEFORE or hook
    // effectively making our hooks as last in queue
    next(action);
    (_container.hooks[action.type] || [])
    .forEach((hook: ActionHook) => {
      hook({ action, getState: store.getState, dispatch: store.dispatch });
    });
  };
}
