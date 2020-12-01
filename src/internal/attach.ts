import {
  ActionHook
} from '../types'

import {
  _container
} from '../hooks'

export const attach = (hook: ActionHook) => (type: any) => {
  if (typeof _container.hooks === 'undefined') {
    throw Error('No middleware attached, first attach Hooks middleware to store.')
  }
  if (_container.hooks[type]) {
    _container.hooks[type].push(hook);
  } else {
    _container.hooks[type] = [ hook ]
  }
}
