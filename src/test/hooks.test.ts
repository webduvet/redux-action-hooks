import * as sinon from 'sinon';
import { createStore, applyMiddleware } from 'redux'

import Hooks from '../hooks'

import {
  ofType
} from '../implementation/oftype';

const mockAtcionCreator = () => ({
  type: 'sample',
  payload: { test: 'test' }
});

const reducer = (state: any = {}, action: any) => {
  return state;
}

// NOTE middleware wants any type

describe('Hooks test', function () {
  it('The hook should execute synchrounously', () => {
    const store = createStore(reducer, applyMiddleware(Hooks as any));
    let test = false
    ofType('sample', () => {
      test = true;
    });
    store.dispatch(mockAtcionCreator());
    sinon.assert.match(test, true);
  });

  it('should throw error if the hook is called without store', (done) => {
    let test = false
    const mockFn = () => false;
    try {
      ofType('sample', mockFn);
      done(false)
    } catch (e) {
      sinon.assert.match(e, "");
      done()
    }
  })
});
