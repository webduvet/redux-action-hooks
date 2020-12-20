import {
  attach
} from '../internal/attach'

import {
  ActionHook,
  ActionHookEmpty
} from '../types'

const called = {};

/**
 * this need to create nested called function
 * and be called whenever any of the actions are called
 * once the final action is called then the actual hook is triggered
 */

export const allCalled = (types: string[], hook: ActionHook | ActionHookEmpty) => {
  types.forEach(attach(hook));
};
