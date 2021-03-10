export type Room = {
  id: string
  name: string
  imageUrl: string
}

export type Booking = {
  id: string
  start: Date
  end: Date
  roomId: string
}
