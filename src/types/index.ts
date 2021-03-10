export type Room = {
  id: string
  name: string
  imageUrl: string
}

export type Booking = {
  id: string
  start: string
  end: string
  roomId: string
}
