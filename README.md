# redux-hooks
Simple middleware for side effects in redux

## Inspiration
This is inspired by Angular's side effects  based on RXJS without all rx library.
Redux already has ability to observe the incoming redux actions and exposes the middleware
for side effects.<br>
This creates very simple api how to tap to the redux action flow and create
simple clear and testable logic.

example
```js
export const topUpEffect = ({ action, dispatch }) => {
  if(action.payload.amount > 100) {
    api.post(URL, action.payload)
    .then((payload) => {
      dispatch(topUpSuccess(payload))
    })
  }
}

ofType('ACCOUNT_TOPUP_REQUEST', topUpEffect)
```
This simplifies testing and decouples any asnchronous code or third party logic
from the redux flow from **action creator** to **reducer**

## How it works
This is [Redux middleware](https://redux.js.org/understanding/history-and-design/middleware)

This middleware calls `next(action)` as the first statement, so your hook is
executed AFTER any other middleware in the pipe which is added subsequently.<br>
However, this tool is designed for side effects which are not dependent on the
sequence how the middleware is executed.

This library is intended for application with **single redux store** or if the application has
more then one redux store, it will work only with one of them.

### Examples

#### ofType
Observes the type of the action and allows to execute extra logic if the action is in the
redux flow.

NOTE - modifying action is not recommended. It can yield unexpected results.

```js
import { ofType } from 'redux-action-hooks'

ofType('action_type_one', ({ action, getState, dispatch }) => {
  // can do something
  // action is direct reference to original action
  // so modifying the payload can result in undesired effects
  // getState and dispatch are methods from store
})

ofType(['action_type_one', 'action_type_two'], ({ action, getState, dispatch }) => {
  // can do something
  // action is direct reference to original action
  // so modifying the payload can result in undesired effects
  // getState and dispatch are methods from store
})
```

#### pipe
`pipe` simply dispatches another action with the identical payload to the first action(s)

```js
import { pipe } from 'redux-action-hooks'

pipe(['action_type1'], 'action_type2')
```

#### allCalled
oberves all action given in the array, and exectues the side effects only after
all of them had been called at least once.
The hook takes opional parameter in the form of `{ cleanup: boolean }` which indicates
whether we cleanup the call history once the side effect is run. If not given or set to false
the side offect will run on every subseqent call of any given action passed into the hook.
```js
import { allCalled } from 'redux-action-hooks'

allCalled(['action_A', 'action_B'], someSideEffectCode, { cleanup: true })
```

## Required
`Redux` is the only dependency. More specifically it is `@types/redux` (or types from redux if
supplied), However if you are not using typescript, there is no 3rd party dependency besides
it is expected to be used with Redux middleware.

## How to use it
### Installation
```sh
npm install redux-action-hooks
```
### Usage
if using [redux-thunk](https://github.com/reduxjs/redux-thunk)
this need to go after thunk in the pipeline
                                                                          
ideally hooks will sit in separate file
`some-hooks.ts` (some-hooks.js) along the other redux files (reducers, action creators)
                                                                          
and will be called in the beginning of dedicated reducer

in MyReducer:
```js
import './some-hooks'
```
which will hook the side effect to the action.
```js
ofType([ActionTypes.PDF_DOCUMENT_FOLDER_SELECTED], ({ action: AnyAction, dispatch: Dispatch }) => {
  someSideEffectCode();
  dispatch({ type: 'other_action' })
})
```
It is possibe to hook to multiple actions at the same time.
e.g. if the app need to perform logout after security breach or after user logout action

```js
ofType([SecurityTypes.INVALIDATE_SESSION, UserAction.LOGOUT], ({ action: AnyAction }) => {
  makeSessionInvalid();
  setLocation('/login');
})
```

### Testing
the effects are here to imporove the testability of the code
traditional approach - all the async logic is in action creator
```js
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

```js
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
```js
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

ISC
