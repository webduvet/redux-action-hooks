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
export const pipe = (types: any, pipeTo: string | string[]) => {
  let t;
  let s: string[];
  if (Array.isArray(types)) {
    t = types;
  } else {
    t = [ types ]
  }

  if (Array.isArray(pipeTo)) {
    s = pipeTo;
  } else {
    s = [ pipeTo ]
  }
  t.forEach(function(type) {
    ofType(type, ({ action, dispatch }) => {
      s.forEach((pipeToType) => {
        dispatch({
          type: pipeToType,
          payload: action.payload
        });
      })
    })
  });
};
