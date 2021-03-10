import axios from "axios"
import uniqBy from "lodash.uniqby"

import { Booking, Room } from "@/types"

const BOOKINGS_URL = "/reservations"

type BookingsResponse = {
  id: string
  start: string
  end: string
  room: {
    id: string
    name: string
    imageUrl: string
  }
}[]

const API = axios.create({
  baseURL: "https://cove-coding-challenge-api.herokuapp.com",
  headers: {
    "Content-Type": "application/json",
  },
})

export const fetchBookings = async () => {
  return API.get<{ bookings: Booking[]; rooms: Room[] }>(BOOKINGS_URL, {
    transformResponse: [
      (raw) => {
        const resp: BookingsResponse = JSON.parse(raw)

        const bookings = resp.map((r) => {
          return {
            id: r.id,
            start: r.start,
            end: r.end,
            roomId: r.room.id,
          }
        })

        const rooms = uniqBy(
          resp.map((r) => r.room),
          "id"
        )

        return { bookings, rooms }
      },
    ],
  })
}
