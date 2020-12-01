# redux-hooks
Simple middleware for side effects in redux

## Inspiration
If you need any an existing action to trigger a side effect or to pipe action to any other action

## How it works
It works the same way asy any other Redux middleware.
This middleware calls next(action) as the first thing, so your hook is executed AFTER any other middleware in the pipe
The tool is designed for side effects which are not dependent on the sequence how the middleware is executed.
You can also dispatch another action from inside the hook.
It is not possible to cancel the action or to change the type or the payload of the action. It calls next(action)
as the first statement before any other user code is executed. If all the middleware piped after
the redux-action-hooks is synchronous the user side effect in the forme of functin provided into this hook
will be executed as last.
This is by design. This small library exists to manage side effects during the redux store update. Side effects
are by nature asynchronous hence to prevent any accidental damage to the action, the payload or the redux
state I decided to execute the code at the end of the middleware pipe.
If any other library uses the same approach the order of the middlewares matters.

## Required
Redux is the only dependency.

## How to use it
### Installation
```
npm install redux-hooks
```
### Usage
if using redux-thunk
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
ofType(ActionTypes.PDF_DOCUMENT_FOLDER_SELECTED, ({ action: AnyAction }) => {
  someSideEffectCode();
  orDispatch(newAction(action.payload.pick));
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
