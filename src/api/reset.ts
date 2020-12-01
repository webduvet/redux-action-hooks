import {
  _container
} from '../hooks'

export const reset = () => {
  if (_container.hooks) {
    delete _container.hooks;
  }
}
