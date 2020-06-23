import sinon from 'sinon';
import { createStore, applyMiddleware } from 'redux'

import Hooks, {
  ofType
} from '../hooks';

const mockAtcionCreator = () => ({
  type: 'sample',
  payload: { test: 'test' }
});

const reducer = (state: any = {}, action: any) => {
  return state;
}

// NOTE middleware wants any type
const store = createStore(reducer, applyMiddleware(Hooks as any));

describe('Hooks test', function () {
  it('The hook should execute synchrounously', () => {
    let test = false
    ofType('sample', () => {
      test = true;
    });
    store.dispatch(mockAtcionCreator());
    sinon.assert.match(test, true);
  });
});
