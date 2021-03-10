import React from "react"
import { Text, View } from "react-native"

import { useSelector } from "react-redux"

import { useAppDispatch } from "@/config/store"
import { loadBookings, bookingsSelector } from "@/slices/bookings"
import { roomsSelector } from "@/slices/rooms"

export const Bookings = () => {
  const dispatch = useAppDispatch()
  const bookings = useSelector(bookingsSelector.selectAll)
  const rooms = useSelector(roomsSelector.selectAll)

  React.useEffect(() => {
    dispatch(loadBookings())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <View>
      <Text>Hello World</Text>
      <Text>Rooms: {rooms.map((r) => r.name).join(", ")}</Text>
      <Text>Bookings: {bookings.map((b) => b.roomId).join(", ")}</Text>
    </View>
  )
}
