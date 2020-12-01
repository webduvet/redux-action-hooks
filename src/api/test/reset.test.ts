import * as sinon from 'sinon';
import { createStore, applyMiddleware } from 'redux'

import Hooks from '../../hooks'

import {
  reset,
  pipe
} from '../';

describe('reset', function () {
  const mockType1 = 'type1';
  const mockType2 = 'type2';

  let store: any;
  beforeEach(() => {
    const reducer = (state: any = { test: true }, action: any) => {
      switch (action.type) {
        case mockType2: {
          return {
            ...state,
            test: action.payload
          }
        }
        default: {
          return state
        }
      }
      return state;
    }
    store = createStore(reducer, applyMiddleware(Hooks as any));
  })

  it('should reset all hooks', () => {
    pipe(mockType1, mockType2);

    reset();

    store.dispatch({
      type: mockType1,
      payload: false
    });

    const state = store.getState();

    sinon.assert.match(state.test, true);
  });
});
