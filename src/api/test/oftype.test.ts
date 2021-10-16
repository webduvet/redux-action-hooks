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
/*
 * how about monadic approach?
 *
 * ofType(Action).pipe(AnotherAction)
 *
 * or
 *
 * function doAsync(({ payload }) => fetch(payload.url, payload.data))
 *
 * ofType(Action)
 * .then(doAsync)
 * .then(pipe(Action))
 * .catch(pipe(Action))
 *
 * or
 *
 * ofType(Action, function({ dispatch, state }))
 *
 */

// NOTE middleware wants any type

describe('ofType', function () {
  it('should execute hook on action', () => {
    const store = createStore(reducer, applyMiddleware(Hooks as any));
    let test = false
    ofType('sample', () => {
      test = true;
    });
    store.dispatch(mockAtcionCreator());
    sinon.assert.match(test, true);
  });

  it('should have access to store.dispatch', () => {
    const store = createStore(reducer, applyMiddleware(Hooks as any));
    let test = false
    ofType('sample', ({ dispatch }) => {
      test = typeof dispatch === 'function';
    });
    store.dispatch(mockAtcionCreator());
    sinon.assert.match(test, true);
  });

  it('should have access to state', () => {
    const store = createStore(reducer, applyMiddleware(Hooks as any));
    let test = false
    ofType('sample', ({ getState }) => {
      test = getState() === store.getState();
    });
    store.dispatch(mockAtcionCreator());
    sinon.assert.match(test, true);
  });

  it('should be able to dispatch other synchrounous actions in order', () => {
    const sampleReducer = (state: any = { test: undefined }, action: any) => {
      switch (action.type) {
        case 'one': return {
          test: 'one'
        }
        case 'two': return {
          test: 'two'
        }
        default: return state;
      }
    }
    const store = createStore(sampleReducer, applyMiddleware(Hooks as any));
    let test = false
    ofType('one', ({ dispatch, getState }) => {
      console.log(getState())
      dispatch({ type: 'two' })
      console.log(getState())
    });
    store.dispatch({ type: 'one' });
    const newState = store.getState();
    sinon.assert.match(newState.test, 'two');
  })
});
