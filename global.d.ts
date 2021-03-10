import "react-native-calendars"

declare type PropsOf<TComponent> = TComponent extends React.ComponentType<infer P> ? P : never

declare module "react-native-events-calendar"
declare module "react-native-calendar-strip"

declare module "react-native-calendars" {
  export const ExpandableCalendar
  export const AgendaList
  export const CalendarProvider
  export const WeekCalendar
}
