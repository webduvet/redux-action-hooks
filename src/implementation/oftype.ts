import {
  attach
} from '../hooks'

import {
  ActionHook,
  ActionHookEmpty
} from '../types'

export const ofType = (types: any, hook: ActionHook | ActionHookEmpty) => {
  let t;
  if (Array.isArray(types)) {
    t = types;
  } else {
    t = [ types ]
  }
  t.forEach(attach(hook));
};
