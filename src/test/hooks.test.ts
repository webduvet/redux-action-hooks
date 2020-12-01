import * as sinon from 'sinon';
import { createStore, applyMiddleware } from 'redux'

import Hooks from '../hooks'

import {
  ofType
} from '../api/oftype';

const mockAtcionCreator = () => ({
  type: 'sample',
  payload: { test: 'test' }
});

const reducer = (state: any = {}, action: any) => {
  return state;
}

// NOTE middleware wants any type

describe('Hooks test', function () {
  it('should throw error if the hook is called without store', (done) => {
    let test = false
    const mockFn = () => false;
    try {
      ofType('sample', mockFn);
    } catch (e) {
      sinon.assert.match(typeof e, Error);
      done();
    }
    sinon.assert.fail('It should throw error')
    done();
  })

  it('The hook should execute synchrounously', () => {
    const store = createStore(reducer, applyMiddleware(Hooks as any));
    let test = false
    ofType('sample', () => {
      test = true;
    });
    store.dispatch(mockAtcionCreator());
    sinon.assert.match(test, true);
  });
});
