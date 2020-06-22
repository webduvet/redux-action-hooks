# redux-hooks
Simple middleware for side effects in redux

## Inspiration
If you need any existing action to trigger a side effect or to trigger other action.

## How it works
It works the same way asy any other Redux middleware.
This middleware calls next(action) as the first thing, so your hook is executed AFTER any other middleware in the pipe
The tool is designed for side effects which are not dependent on the sequence how the middleware is executed.
You can also dispatch another action from inside the hook.
It is not possible to cancel the action or to change the type or the payload of the action.

## Required
Redux

## How to use it
### Installation
```
npm install redux-hooks
```
### Usage
if using redux-thunk
this need to go after thunk in the pipeline
                                                                          
ideally hooks will sit in separate file
hooks.ts (hooks.js)
                                                                          
and will be called on the beginning of dedicated reducer
in reducer:
```
import './hooks'
```
which will execute the hooks once.
```
ofType(ActionTypes.PDF_DOCUMENT_FOLDER_SELECTED, (action: AnyAction) => {
  someSideEffectCode();
  orDispatch(newAction(action.payload.pick));
})
```
