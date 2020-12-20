import {
  attach
} from '../internal/attach'

import {
  ActionHook,
  ActionHookEmpty
} from '../types'

const called: { [d: string]: boolean } = {};

/**
 * this need to create nested called function
 * and be called whenever any of the actions are called
 * once the final action is called then the actual hook is triggered
 *
 * the hard part is that they can be triggered in any order
 * TODO
 * perhaps they can be triggered in that particular order in some other version
 */

const callThisHook = (hook) => ({ dispatch }) => {
  Obje
}

export const allCalled = (types: string[], hook: ActionHook | ActionHookEmpty) => {
  if (types.length === 0) {
    // action type need to be passed
    // TODO perhaps throw the exception?
    return;
  }
  types.forEach((type: string) => {
    if (called[type]) {
      throw Error('all action types need to be unique')
    }
    called[type] = false;
  })
  types.forEach(attach(hook));
};
