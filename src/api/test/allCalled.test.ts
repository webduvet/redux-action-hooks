import * as sinon from 'sinon';
import { createStore, applyMiddleware } from 'redux'

import Hooks from '../../hooks'

import {
  ofType
} from '../allCalled';

const mockAtcionCreator = (type, payload) => ({
  type,
  payload
});

const reducer = (state: any = {}, action: any) => {
  return state;
}

// NOTE middleware wants any type

describe('ofType', function () {
  it('should not trigger only when one action is triggered', () => {
    const store = createStore(reducer, applyMiddleware(Hooks as any));
    let test = false
    store.dispatch(mockAtcionCreator('one', 'action one' ));
    sinon.assert.match(test, false);
  });

  it('should when both actions were triggered', () => {
    const store = createStore(reducer, applyMiddleware(Hooks as any));
    let test = false
    allCalled([ 'one', 'two' ], () => {
      test = true;
    });
    store.dispatch(mockAtcionCreator('one', 'action one' ));
    store.dispatch(mockAtcionCreator('two', 'action two' ));
    sinon.assert.match(test, true);
  });
});
