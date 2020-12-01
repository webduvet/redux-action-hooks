import {
  attach
} from '../internal/attach'

import {
  ofType
} from './oftype'

import {
  ActionHook,
  ActionHookEmpty
} from '../types'

/**
 * @desc
 * pipes the action or array of actions to any other action
 * or array of actions with the same payload
 */
export const pipe = (types: any, pipeTo: string) => {
  let t;
  if (Array.isArray(types)) {
    t = types;
  } else {
    t = [ types ]
  }
  t.forEach(function(type) {
    ofType(type, ({ action, dispatch }) => {
      dispatch({
        type: pipeTo,
        payload: action.payload
      });
    })
  });
};
