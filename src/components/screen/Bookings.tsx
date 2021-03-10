/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable unused-imports/no-unused-imports */
import React from "react"
import { View, Dimensions } from "react-native"

import { useHeaderHeight } from "@react-navigation/stack"
import chroma from "chroma-js"
import Color from "color"
import constant from "lodash.constant"
import findKey from "lodash.findkey"
import groupBy from "lodash.groupby"
import times from "lodash.times"
import uniq from "lodash.uniq"
import moment from "moment"
import { Agenda, DateObject, ExpandableCalendar, CalendarProvider } from "react-native-calendars"
import EventCalendar from "react-native-events-calendar"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import { useSelector } from "react-redux"
import styled from "styled-components/native"

import { Text } from "@/components/shared/Text"

import { useAppDispatch } from "@/config/store"
import { loadBookings, bookingsSelector } from "@/slices/bookings"
import { roomsSelector } from "@/slices/rooms"
import { Booking } from "@/types"

const DEFAULT_COLOR = "rgba(0, 253, 255, 1.0)"
const COLOR_OPTIONS = ["rgba(254, 48, 147, 1.0)", DEFAULT_COLOR]

const DATE_SCROLL_HEIGHT = 110
const HOUR_HEIGHT = 85
const HOUR_TEXT_WIDTH = 45

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }): string => theme.background};
  align-items: center;
  justify-content: center;
`

export const Bookings = () => {
  const renderedMoment = React.useMemo(() => moment(new Date()), [])
  const { height, width } = Dimensions.get("screen")
  const bookings = useSelector(bookingsSelector.selectAll)
  const dispatch = useAppDispatch()
  const rooms = useSelector(roomsSelector.selectAll)

  const roomColorMap = React.useMemo(() => {
    return rooms.reduce((colorMap, room, i) => {
      colorMap[room.id] = COLOR_OPTIONS[i] || DEFAULT_COLOR
      return colorMap
    }, {} as Record<string, string>)
  }, [rooms])

  const allLoadedBookingData = React.useMemo(() => {
    return bookings.map((b) => {
      const startMoment = moment(b.start)
      return {
        id: b.id,
        color: chroma(roomColorMap[b.roomId]).hex(),
        dateString: startMoment.format("YYYY-MM-DD"),
        roomId: b.roomId,
        start: moment(b.start).format("YYYY-MM-DD HH:MM:SS"),
        end: moment(b.end).format("YYYY-MM-DD HH:MM:SS"),
        summary: b.id,
      }
    })
  }, [bookings, roomColorMap])

  const markedDates = React.useMemo(() => {
    const dots = rooms.reduce((dotMap, room, i) => {
      dotMap[room.id] = {
        key: room.id,
        color: COLOR_OPTIONS[i] || DEFAULT_COLOR,
        selectedDotColor: COLOR_OPTIONS[i] || DEFAULT_COLOR,
      }
      return dotMap
    }, {} as Record<string, { key: string; color: string; selectedDotColor: string }>)

    const groupedByDate = groupBy(allLoadedBookingData, "dateString")
    return Object.fromEntries(
      Object.entries(groupedByDate).map(([k, v]) => {
        return [k, { dots: uniq(v.map((v) => v.roomId)).map((rId) => dots[rId]) }]
      })
    )
  }, [rooms, allLoadedBookingData])

  React.useEffect(() => {
    dispatch(loadBookings())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <CalendarProvider>
      <ExpandableCalendar firstDay={1} markingType="multi-dot" markedDates={markedDates} />
    </CalendarProvider>
  )
}

const Hour = ({ label }: { label: string }) => {
  return (
    <View
      style={{ height: HOUR_HEIGHT, flexDirection: "row", justifyContent: "center", alignItems: "center" }}
    >
      <Text size={14} style={{ marginRight: 10, textAlign: "right", width: HOUR_TEXT_WIDTH }}>
        {label}
      </Text>
      <View style={{ flex: 1, borderBottomColor: "#BEBEBE", borderBottomWidth: 1 }} />
    </View>
  )
}

type BookingItemData = {
  id: string
  isPlaceholder: boolean
  weekNumberString: string
  dateString: string
  firstOfMonthString: string
  monthString: string
  roomId: string
  start: Date
  end: Date
}

type RoomAgendaProps = {
  data: BookingItemData[]
  color: string // color string
}

const getOffset = (date: Date) =>
  moment.duration(moment(date).diff(moment(date).startOf("day"))).asHours() * HOUR_HEIGHT + HOUR_HEIGHT / 2

const RoomAgenda = ({ data, color: colorString }: RoomAgendaProps) => {
  const color = chroma(colorString)
  const agendaRef = React.useRef<ScrollView>(null)

  React.useEffect(() => {
    if (agendaRef.current && data[0]) {
      agendaRef.current.scrollTo({ x: 0, y: getOffset(data[0].start) - 10, animated: false })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ScrollView
      ref={agendaRef}
      style={{ borderLeftColor: colorString, borderLeftWidth: 5, flex: 1, position: "relative" }}
    >
      <HourSegments />
      {data.map((item, i) => {
        const startPosition = getOffset(item.start)
        const endPosition = getOffset(item.end)
        return (
          <View
            key={`${item.id}-${i}`}
            style={{
              position: "absolute",
              width: "100%",
              marginLeft: HOUR_TEXT_WIDTH + 10,
              top: startPosition,
              height: endPosition - startPosition,
              backgroundColor: color.alpha(0.25).css(),
              borderRadius: 5,
              borderLeftColor: color.hex(),
              borderLeftWidth: 5,
            }}
          >
            <Text color={color.darken(1.5).css()} weight="bold">
              {moment(item.start).format("LT")} - {moment(item.end).format("LT")} Room {item.roomId}
            </Text>
          </View>
        )
      })}
    </ScrollView>
  )
}

const HourSegments = React.memo(() => {
  const hourItems: (string | undefined)[] = ["12 AM", ...times(23, constant(undefined)), "12 AM"]

  return (
    <View>
      {hourItems.map((item, i) => {
        return <Hour key={i} label={item || (i < 12 ? `${i} AM` : `${i === 12 ? i : i - 12} PM`)} />
      })}
    </View>
  )
})
