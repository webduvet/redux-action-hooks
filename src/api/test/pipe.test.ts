import * as sinon from 'sinon';
import { createStore, applyMiddleware } from 'redux'

import Hooks from '../../hooks'

import {
  pipe
} from '../pipe';

describe('pipe', function () {
  let store: any;
  beforeEach(() => {
    const reducer = (state: any = {}, action: any) => {
      switch (action.type) {
        case 'type2': {
          return {
            ...state,
            worked: action.payload
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

  it('should pipe single action to other action', () => {
    const mockType1 = 'type1';
    const mockType2 = 'type2';

    pipe(mockType1, mockType2);

    store.dispatch({
      type: mockType1,
      payload: 'test'
    });

    const state = store.getState();

    sinon.assert.match(state.worked, 'test');
  });

  it('should pipe any action in given array to other action', () => {
    const mockType1 = 'type1';
    const mockType2 = 'type2';

    pipe([mockType1], mockType2);

    store.dispatch({
      type: mockType1,
      payload: 'test'
    });

    const state = store.getState();

    sinon.assert.match(state.worked, 'test');
  });
});
