import { createEntityAdapter, createSlice, PayloadAction } from "@reduxjs/toolkit"

import { RootState } from "@/config/store"
import { Room } from "@/types"

export const roomsAdapter = createEntityAdapter<Room>()
export const roomsSelector = roomsAdapter.getSelectors((state: RootState) => state.rooms)

export const initialState = roomsAdapter.getInitialState<{ loading: boolean; error?: string }>({
  loading: false
})

export const roomsSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    load: (
      state,
      {
        payload
      }: PayloadAction<{
        rooms: Room[]
      }>
    ) => {
      roomsAdapter.setAll(state, payload.rooms)
    }
  }
})

export const { load } = roomsSlice.actions

export default roomsSlice.reducer
