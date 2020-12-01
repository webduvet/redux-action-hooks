import * as sinon from 'sinon';
import { createStore, applyMiddleware } from 'redux'

import Hooks from '../../hooks'

import {
  ofType
} from '../oftype';

const mockAtcionCreator = () => ({
  type: 'sample',
  payload: { test: 'test' }
});

const reducer = (state: any = {}, action: any) => {
  return state;
}

// NOTE middleware wants any type

describe('ofType', function () {
  it('should execute synchrounously', () => {
    const store = createStore(reducer, applyMiddleware(Hooks as any));
    let test = false
    ofType('sample', () => {
      test = true;
    });
    store.dispatch(mockAtcionCreator());
    sinon.assert.match(test, true);
  });
});
