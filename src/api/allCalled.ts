import {
  attach
} from '../internal/attach'

import {
  ActionHook,
  ActionHookEmpty,
  HookParams
} from '../types'

// the actions are sotred here.
let _called: { [d: string]: boolean } = {};

/**
 * this need to create nested called function
 * and be called whenever any of the actions are called
 * once the final action is called then the actual hook is triggered
 *
 * the hard part is that they can be triggered in any order
 * TODO
 * perhaps they can be triggered in that particular order in some other version
 */

const _cleanup = () => {
  Object.keys(_called).forEach((key) => _called[key] = false);
}

const callThisHook = (hook: Function, config: Config ): ActionHook => (params: HookParams) => {
  const { cleanup } = config;
  const { action } = params;

  // setting the called value to true
  _called[action.type] = true;

  // evaluea if all all called or not
  if (Object.values(_called).every((value) => value)) {
    if (cleanup) {
      _cleanup()
    }
    // need to reset the hook
    return hook(params);
  }
}

type Config = {
  cleanup?: boolean,
}

/**
 * @desc
 * takes array of actions
 * when all actions in the array are called at least once then the hook is triggered
 * the intention of this hooks is to notify of this action
 * inspection of the payload of actions in the array is not available
 */
export const allCalled =
  (types: string[], hook: ActionHook | ActionHookEmpty, config: Config = {}) => {

  if (types.length === 0) {
    // action type need to be passed
    // TODO perhaps throw the exception?
    return;
  }
  // allCalled is meant to be called once in the life cycle of the app,
  // but for testing purposes and general realiability discard old action object and create new.
  _called = {};

  types.forEach((type: string) => {
    // TODO revise if it is needed
    //if (_called[type]) {
      //throw Error('all action types need to be unique')
    //}
    _called[type] = false;
  })
  types.forEach(attach(callThisHook(hook, config)));
};
