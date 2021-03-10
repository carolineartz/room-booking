import {
  configureStore,
  Action,
  getDefaultMiddleware,
  combineReducers,
  AnyAction,
  CombinedState,
} from "@reduxjs/toolkit"
import { useDispatch } from "react-redux"
import { ThunkAction } from "redux-thunk"

import bookingsReducer from "@/slices/bookings"
import roomsReducer from "@/slices/rooms"

const combinedReducer = combineReducers({
  bookings: bookingsReducer,
  rooms: roomsReducer,
})

const rootReducer = (state: CombinedState<RootState> | undefined = undefined, action: AnyAction) => {
  if (action.type === "bookings/reset") state = undefined

  return combinedReducer(state, action)
}

export type RootState = ReturnType<typeof combinedReducer>

const middleware = getDefaultMiddleware({
  immutableCheck: {
    ignoredPaths: [],
  },
})

const store = configureStore({
  reducer: rootReducer,
  middleware,
  devTools: true,
  // devTools: env.EXPO_ENV !== "production"
})

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>() // Export a hook that can be reused to resolve types
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>

export { store }
