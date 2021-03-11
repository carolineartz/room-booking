import React from "react"
import { View, Dimensions, SafeAreaView } from "react-native"

import { useHeaderHeight } from "@react-navigation/stack"
import chroma from "chroma-js"
import constant from "lodash.constant"
import groupBy from "lodash.groupby"
import times from "lodash.times"
import uniq from "lodash.uniq"
import moment from "moment"
import { ExpandableCalendar, CalendarProvider } from "react-native-calendars"
import { FlatList, ScrollView } from "react-native-gesture-handler"
import { useSelector } from "react-redux"

import { Text } from "@/components/shared/Text"

import { useAppDispatch } from "@/config/store"
import { loadBookings, bookingsSelector } from "@/slices/bookings"
import { roomsSelector } from "@/slices/rooms"

const DEFAULT_COLOR = "rgba(0, 253, 255, 1.0)"
const COLOR_OPTIONS = ["rgba(254, 48, 147, 1.0)", DEFAULT_COLOR]

const DATE_SCROLL_HEIGHT = 140
const HOUR_HEIGHT = 85
const HOUR_TEXT_WIDTH = 45

export const Bookings = () => {
  const headerHeight = useHeaderHeight()
  const { height, width } = Dimensions.get("screen")
  const aboveAgendaHeight = height - (headerHeight + DATE_SCROLL_HEIGHT)
  const renderedMoment = React.useMemo(() => moment(new Date()), [])
  const bookings = useSelector(bookingsSelector.selectAll)
  const dispatch = useAppDispatch()
  const rooms = useSelector(roomsSelector.selectAll)
  // const [viewingDay, setViewingDay] = React.useState(renderedMoment.format("YYYY-MM-DD"))
  const [viewingMonth, setViewingMonth] = React.useState(renderedMoment.format("YYYY-MM"))
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
        monthString: startMoment.format("YYYY-MM"),
        roomId: b.roomId,
        start: new Date(b.start),
        end: new Date(b.end),
        summary: b.id,
      }
    })
  }, [bookings, roomColorMap])

  const monthsDataToDisplay = React.useMemo(() => {
    const prevMonth = moment(viewingMonth).subtract("1", "M").format("YYYY-MM")
    const nextMonth = moment(viewingMonth).add("1", "M").format("YYYY-MM")

    return allLoadedBookingData.filter((d) => [prevMonth, viewingMonth, nextMonth].includes(d.monthString))
  }, [allLoadedBookingData, viewingMonth])

  const markedDates = React.useMemo(() => {
    const dots = rooms.reduce((dotMap, room, i) => {
      dotMap[room.id] = {
        key: room.id,
        color: COLOR_OPTIONS[i] || DEFAULT_COLOR,
        selectedDotColor: COLOR_OPTIONS[i] || DEFAULT_COLOR,
      }
      return dotMap
    }, {} as Record<string, { key: string; color: string; selectedDotColor: string }>)

    const groupedByDate = groupBy(monthsDataToDisplay, "dateString")

    return Object.fromEntries(
      Object.entries(groupedByDate).map(([k, v]) => {
        return [k, { dots: uniq(v.map((v) => v.roomId)).map((rId) => dots[rId]) }]
      })
    )
  }, [rooms, monthsDataToDisplay])

  React.useEffect(() => {
    dispatch(loadBookings())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fullMonthsDataByDay = React.useMemo(() => {
    const groupedByDate = groupBy(monthsDataToDisplay, "dateString")
    const monthStrings = Object.keys(groupBy(monthsDataToDisplay, "monthString"))

    return monthStrings.flatMap((ms) => {
      const monthMoment = moment(ms)
      return Array.from({ length: monthMoment.daysInMonth() }, (v, k) => {
        const dateString = ms + "-" + `${k + 1}`.padStart(2, "0")
        return {
          dateString,
          agendaItems: groupedByDate[dateString] || [],
        }
      })
    })
  }, [monthsDataToDisplay])

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <CalendarProvider date={renderedMoment.format("YYYY-MM-DD")}>
        <ExpandableCalendar
          firstDay={1}
          style={{
            shadowOpacity: 0,
          }}
          markingType="multi-dot"
          markedDates={markedDates}
          // onDayPress={(day) => setViewingDay(day.dateString)}
          // onDayChange={(day) => setViewingDay(day.dateString)}
          onMonthChange={(month) => setViewingMonth(moment(month.dateString).format("YYYY-MM"))}
        />
        <SafeAreaView style={{ flex: 1 }}>
          <FlatList
            horizontal
            data={fullMonthsDataByDay}
            contentInsetAdjustmentBehavior="never"
            snapToAlignment="end"
            pagingEnabled
            decelerationRate="fast"
            automaticallyAdjustContentInsets={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={1}
            snapToInterval={width}
            keyExtractor={(item, index) => `${index}-${item}`}
            renderItem={({ item: { dateString, agendaItems } }) => {
              const dayMoment = moment(dateString)
              const agendaByRoom = groupBy(agendaItems, "roomId")
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
                    <View style={{ marginBottom: 10 }}>
                      <Text weight="extra-bold" size={30}>
                        {dayMoment.format("MMMM D,")}{" "}
                        <Text size={30} weight="regular">
                          {dayMoment.format("YYYY")}
                        </Text>
                      </Text>
                      <Text weight="regular" size={20}>
                        {dayMoment.format("dddd")}
                      </Text>
                    </View>

                    <View style={{ flex: 1 }}>
                      {rooms.map((r, i) => {
                        return (
                          <>
                            <RoomAgenda
                              key={`${r.id}-${dateString}`}
                              data={agendaByRoom[r.id] || []}
                              color={roomColorMap[r.id]}
                            />
                            {i < rooms.length && (
                              <View key={`${r.id}-spacer-${i}`} style={{ marginTop: 20 }} />
                            )}
                          </>
                        )
                      })}
                    </View>
                  </View>
                </View>
              )
            }}
          />
        </SafeAreaView>
      </CalendarProvider>
    </View>
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
  data: { start: Date; end: Date; roomId: string; id: string }[]
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
