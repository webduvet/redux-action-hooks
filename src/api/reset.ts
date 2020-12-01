import {
  _container
} from '../hooks'

/**
 * @desc
 * throws away all registered hooks
 * TODO perhaps we can have callback notification
 * or some other way of letting the subscribers to know
 */
export const reset = () => {
  if (_container.hooks) {
    _container.hooks = {};
  }
}
