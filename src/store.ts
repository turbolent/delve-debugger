import {
  createStore as createReduxStore,
  applyMiddleware,
  Store,
  compose,
  AnyAction,
} from "redux"
import { State } from "./state"
import { reducer } from "./reducer"
import thunkMiddleware, { ThunkAction } from "redux-thunk"

const composeEnhancers =
  // eslint-disable-next-line
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export default function createStore(): Store<State> & {
  dispatch(action: ThunkAction<void, State, void, AnyAction>): void
} {
  return createReduxStore(
    reducer,
    new State(),
    composeEnhancers(applyMiddleware(thunkMiddleware))
  )
}
