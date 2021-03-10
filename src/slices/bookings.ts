import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit"

import { load as loadRooms } from "./rooms"

import * as api from "@/apis/api"
import { RootState } from "@/config/store"
import { Booking } from "@/types"

export const bookingsAdapter = createEntityAdapter<Booking>()
export const bookingsSelector = bookingsAdapter.getSelectors((state: RootState) => state.bookings)

export const initialState = bookingsAdapter.getInitialState<{ loading: boolean; error?: string }>({
  loading: false,
})

export const loadBookings = createAsyncThunk<Booking[], void, { state: RootState; rejectValue: string }>(
  "bookings/load",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const {
        data: { bookings, rooms },
      } = await api.fetchBookings()

      dispatch(loadRooms({ rooms }))

      return bookings
    } catch (e) {
      return rejectWithValue(e.toString())
    }
  }
)

export const bookingsSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadBookings.fulfilled, (state, action) => {
        state.loading = false
        bookingsAdapter.setAll(state, action.payload)
      })
      .addCase(loadBookings.pending, (state, _) => {
        state.loading = true
      })
      .addCase(loadBookings.rejected, (state, payload) => {
        state.error = payload.error.message
      })
  },
})

export default bookingsSlice.reducer
