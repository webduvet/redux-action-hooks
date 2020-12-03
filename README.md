# redux-hooks
Simple middleware for side effects in redux

## Inspiration
If you simply need an existing action to trigger a side effect or to pipe action to any other action

```
ofType('ACCOUNT_TOPUP_REQUEST', ({ action, dispatch }) => {
  if(action.payload.amount > 100) {
    dispatch({
      type: 'ADD_DISCOUNT',
      payload: action.payload
    })
  }
})
```

or

```
export const topUpEffect = ({ action, dispatch }) => {
  if(action.payload.amount > 100) {
    api.post(URL, action.payload)
    .then((payload) => {
      dispatch({ type: SUCCESS, payload })
    })
  }
}

ofType('ACCOUNT_TOPUP_REQUEST', topUpEffect)
```
This simplifies testing and decouples any asnchronous code or third party logic
from the redux store

## How it works
This is [Redux middleware](https://redux.js.org/understanding/history-and-design/middleware)

This middleware calls `next(action)` as the first statement,
so your hook is executed AFTER any other middleware in the pipe which is added subsequently.

The tool is designed for side effects which are not dependent on the sequence how the middleware is executed.

This library is intended for application with single redux store

### API

#### ofType
```
import { ofType } from 'redux-action-hooks'

ofType(['action_type'], ({ action, getState, dispatch }) => {
  // can do something
  // action is direct reference to original action
  // so modifying the payload can result in undesired effects
  // getState and dispatch are methods from store
})
```

#### pipe
```
import { pipe } from 'redux-action-hooks'

pipe(['action_type1'], 'action_type2')
```

`pipe` simply dispatches another action with the identical payload to the first action

### reset
```
import { reset } from 'redux-action-hooks'

reset()
```

## Required
Redux is the only dependency.

## How to use it
### Installation
```
npm install redux-hooks
```
### Usage
if using [redux-thunk](https://github.com/reduxjs/redux-thunk)
this need to go after thunk in the pipeline
                                                                          
ideally hooks will sit in separate file
some-hooks.ts (some-hooks.js)
                                                                          
and will be called on the beginning of dedicated reducer
in MyReducer:
```
import './some-hooks'
```
which will hook the side effect to the action.
```
ofType([ActionTypes.PDF_DOCUMENT_FOLDER_SELECTED], ({ action: AnyAction, dispatch: Dispatch }) => {
  someSideEffectCode();
  dispatch({ type: 'other_action' })
})
```
It is possibe to hook to multiple actions at the same time.
e.g. if the app need to perform logout after security breach or after user logout action

```
ofType([SecurityTypes.INVALIDATE_SESSION, UserAction.LOGOUT], ({ action: AnyAction }) => {
  makeSessionInvalid();
  setLocation('/login');
})
```

### Testing
the effects are here to imporove the testability of the code
traditional approach - all the async logic is in action creator
```
const export myFetchAction = (url) => (dispatch, getState) => {
  dispatch(startFetch());
  myService.fetch(action.payload.url)
    .then((result) => {
      dispatch(successAction(result))
    })
    .catch((error) => {
      dispatch(errorAction(error))
    })
}
```

```
export const mySideEffect = ({ action, dispatch, getState }) => {
  myService.fetch(action.payload.url)
    .then((result) => {
      dispatch(successAction(result))
    })
    .catch((error) => {
      dispatch(errorAction(error))
    })
}

ofType([ EXAMPLE_START ], mySideEffect);
```
which looks already much better then packing all the async logic in the action creator.
Since the effect function is used only in one place we actually can take all the 3rd party
services outside of the function and inject them only when we need to use the effect.
```
export const mySideEffect = (service) => ({ action, dispatch }) => {
  service.fetch(action.payload.url)
    .then((result) => {
      dispatch(successAction(result))
    })
    .catch((error) => {
      dispatch(errorAction(error))
    })
}

ofType([ EXAMPLE_START ], mySideEffect(mySideEffectService));
```
in the unit test we can use very simple mock for our service, 3rd party library or store methods
like dispatch and getState.


# License

MIT
