/* eslint-disable unused-imports/no-unused-imports */
import React from "react"
import { View, Dimensions } from "react-native"

import { useHeaderHeight } from "@react-navigation/stack"
import chroma from "chroma-js"
import Color from "color"
import constant from "lodash.constant"
import groupBy from "lodash.groupby"
import times from "lodash.times"
import moment from "moment"
import { Agenda } from "react-native-calendars"
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

type BookingItemData = {
  id: string
  weekNumberString: string
  dateString: string
  firstOfMonthString: string
  roomId: string
  start: Date
  end: Date
}

export const Bookings = () => {
  const renderedMoment = React.useMemo(() => moment(new Date()), [])
  const { height, width } = Dimensions.get("screen")
  const dispatch = useAppDispatch()
  const bookings = useSelector(bookingsSelector.selectAll)
  const rooms = useSelector(roomsSelector.selectAll)
  const headerHeight = useHeaderHeight()
  const aboveAgendaHeight = height - (headerHeight + DATE_SCROLL_HEIGHT)
  const [firstOfMonthShownString, setFirstOfMonthShownString] = React.useState(
    renderedMoment.format("YYYY-MM-01")
  )
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
        weekNumberString: startMoment.format("w"),
        dateString: startMoment.format("YYYY-MM-DD"),
        firstOfMonthString: startMoment.format("YYYY-MM-01"),
        roomId: b.roomId,
        start: new Date(b.start),
        end: new Date(b.end),
      }
    })
  }, [bookings])

  const byDay = React.useMemo(() => {
    return groupBy(allLoadedBookingData, "dateString")
  }, [allLoadedBookingData])

  const monthBookingDataByDay = React.useMemo(() => {
    return groupBy(
      allLoadedBookingData.filter((d) => d.firstOfMonthString === firstOfMonthShownString),
      "dateString"
    )
  }, [allLoadedBookingData, firstOfMonthShownString])

  React.useEffect(() => {}, [allLoadedBookingData])

  React.useEffect(() => {
    dispatch(loadBookings())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <Container>
      <Agenda
        // The list of items that have to be displayed in agenda. If you want to render item as empty date
        // the value of date key has to be an empty array []. If there exists no value for date key it is
        // considered that the date in question is not yet loaded
        items={monthBookingDataByDay}
        // Callback that gets called when items for a certain month should be loaded (month became visible)
        loadItemsForMonth={(month) => {
          // month.dateString
          // console.log("trigger items loading")

          setFirstOfMonthShownString(moment(month.dateString, "YYYY-MM-DD").format("YYYY-MM-01"))
        }}
        renderItem={(_item, _firstItemInDay) => {
          return null
        }}
        renderDay={(day, item) => {
          if (day) {
            console.log("***************")
            console.log("day", day)
            console.log("first item", item)
            console.log("***************")
            const firstItemDay = moment(item.start)
            const agendaForDay = monthBookingDataByDay[day.dateString]
            const agendaByRoom = groupBy(agendaForDay, "roomId")
            return (
              <View style={{ width, backgroundColor: "white" }}>
                <View
                  style={{
                    flex: 1,
                    paddingHorizontal: 5,
                    height: aboveAgendaHeight,
                    width,
                    position: "relative",
                  }}
                >
                  {/* heading */}
                  <View style={{ marginBottom: 10 }}>
                    <Text weight="extra-bold" size={30}>
                      {firstItemDay.format("MMMM D,")}{" "}
                      <Text size={30} weight="regular">
                        {firstItemDay.format("YYYY")}
                      </Text>
                    </Text>
                    <Text weight="regular" size={20}>
                      {firstItemDay.format("dddd")}
                    </Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    {rooms.map((r) => {
                      return (
                        <RoomAgenda
                          key={`${r.id}-${day.dateString}`}
                          data={agendaByRoom[r.id] || []}
                          color={roomColorMap[r.id]}
                        />
                      )
                    })}
                  </View>
                </View>
              </View>
            )
          } else {
            return null
          }
        }}
        renderEmptyDate={() => {
          return (
            <View>
              <Text>This is empty date!</Text>
            </View>
          )
        }}
        renderEmptyData={() => {
          return <Text>No bookings for today!</Text>
        }}
        rowHasChanged={(r1, r2) => {
          return r1.weekNumberString !== r2.weekNumberString
        }}
        refreshing={false}
        // If provided, a standard RefreshControl will be added for "Pull to Refresh" functionality. Make sure to also set the refreshing prop correctly.
        onRefresh={() => console.log("refreshing...")}
        theme={{}}
        style={{
          width: "100%",
          minWidth: 350,
        }}
      />
    </Container>
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
