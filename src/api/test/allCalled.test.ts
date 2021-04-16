import * as sinon from 'sinon';
import { createStore, applyMiddleware } from 'redux'

import Hooks from '../../hooks'

import {
  allCalled
} from '../allCalled';

const mockAtcionCreator = (type: string, payload: any) => ({
  type,
  payload
});

const reducer = (state: any = {}, action: any) => {
  return state;
}

// NOTE middleware wants any type

describe('allCalled', function () {
  it('should not trigger only when one action is triggered', () => {
    const store = createStore(reducer, applyMiddleware(Hooks as any));
    const mockedHook = sinon.spy();
    allCalled([ 'one', 'two' ], mockedHook);
    store.dispatch(mockAtcionCreator('one', 'action one' ));
    sinon.assert.match(mockedHook.called, false);
  });

  it('should trigger when all actions were triggered', () => {
    const store = createStore(reducer, applyMiddleware(Hooks as any));
    const mockedHook = sinon.spy();
    allCalled([ 'one', 'two' ], mockedHook);
    store.dispatch(mockAtcionCreator('one', 'action one' ));
    store.dispatch(mockAtcionCreator('two', 'action two' ));
    sinon.assert.match(mockedHook.calledOnce, true);
  });

  describe('cleanup config:', () => {
    it('reset the hook once all actions are triggered and hook in executed', () => {
      const store = createStore(reducer, applyMiddleware(Hooks as any));
      const mockedHook = sinon.spy();

      allCalled([ 'one', 'two' ], mockedHook, { cleanup: true });

      store.dispatch(mockAtcionCreator('one', 'action one' ));
      store.dispatch(mockAtcionCreator('two', 'action two' ));
      store.dispatch(mockAtcionCreator('two', 'action two' ));
      sinon.assert.match(mockedHook.calledOnce, true);
    });

    it('should in subsequent action trigger the hook once it was already triggered', () => {
      const store = createStore(reducer, applyMiddleware(Hooks as any));
      const mockedHook = sinon.spy();

      allCalled([ 'one', 'two' ], mockedHook, { cleanup: false });

      store.dispatch(mockAtcionCreator('one', 'action one' ));
      store.dispatch(mockAtcionCreator('two', 'action two' ));
      store.dispatch(mockAtcionCreator('two', 'action two' ));
      sinon.assert.match(mockedHook.calledTwice, true);
    });
  })
});
