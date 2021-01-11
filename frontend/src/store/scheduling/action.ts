import { isEmpty, last } from 'lodash'
import { userRhEventsDummy } from '../stubs'
import { Dispatch, GetState } from '../types'
import { ActionTypes, RHEvent, SCHEDULING_ACTIONS } from './types'

export const fetchUserRhEvents = () => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  const fetchedData = userRhEventsDummy
  const formattedEvents: RHEvent[] = []
  fetchedData.forEach((data) => {
    formattedEvents.push({
      eventName: data.eventName,
      location: data.location,
      day: getDayStringFromUNIX(data.startDateTime),
      date: getDate(data.startDateTime),
      endTime: getTimeStringFromUNIX(data.endDateTime),
      startTime: getTimeStringFromUNIX(data.startDateTime),
      hasOverlap: false,
    })
  })
  dispatch({
    type: SCHEDULING_ACTIONS.GET_RH_EVENTS,
    userRhEvents: transformInformationToTimetableFormat(formattedEvents),
    userEventsStartTime: Number(getTimetableStartTime(formattedEvents)),
    userEventsEndTime: Number(getTimetableEndTime(formattedEvents)),
  })
  dispatch(setIsLoading(false))
}

const sortEvents = (events: RHEvent[]) => {
  return events.sort((a, b) => {
    return a.startTime.localeCompare(b.startTime)
  })
}

const getDate = (eventStartTime: Date) => {
  return String(eventStartTime)
}

const getTimetableStartTime = (formattedEvents: RHEvent[]) => {
  const sortedEvents = sortEvents(formattedEvents)
  return sortedEvents[0]?.startTime
}

const getTimetableEndTime = (formattedEvents: RHEvent[]) => {
  const sortedEvents = sortEvents(formattedEvents)
  return last(sortedEvents)?.endTime
}

/**
 * Returns a 2d array containing arrays of respective days filled with RHEvents
 * [
 *    [Monday events],
 *    [Tuesday events], ..
 * ]
 *
 * @param formattedEvents events in RHEvent format (transformed from data retrieved from backend)
 */
const splitEventsByDay = (formattedEvents: RHEvent[]) => {
  const dayArr = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const eventsArr: RHEvent[][] = []
  dayArr.map((day, index) => {
    eventsArr[index] = formattedEvents.filter((indivEvent) => {
      return indivEvent.day === day
    })
  })
  return eventsArr
}

const arrangeEventsForWeek = (eventsArr: RHEvent[][]) => {
  return eventsArr.map((dayArr) => {
    return arrangeEventsWithinDay(dayArr)
  })
}

/**
 * Converts formatted events retrieved from backend into a 3d array arranged by day and rows
 * where events do not overlap
 * [
 *    [
 *      [monEvent1, monEvent2, ..],
 *      [monEvent10, monEvent20, ..], ..
 *    ],
 *    [
 *      [tueEvent1, tueEvent2, ..], ..
 *    ], ..
 * ]
 *
 * @param formattedEvents events in RHEvent format (transformed from data retrieved from backend)
 */
const transformInformationToTimetableFormat = (formattedEvents: RHEvent[]) => {
  const eventsArr = splitEventsByDay(formattedEvents)
  const transformedEventsArr = arrangeEventsForWeek(eventsArr)
  return transformedEventsArr
}

/**
 * Converts a flat array of events for ONE day into rows of events within that day row
 * to ensure no events overlap within each row of events
 * [event1, event2, ..] to
 * [
 *    [event1, event2, ..],
 *    [event10, event20, ..], ..
 * ]
 *
 * @param events array of events for a specific day
 */
const arrangeEventsWithinDay = (events: RHEvent[]) => {
  const rows: RHEvent[][] = []
  if (isEmpty(events)) {
    return rows
  }

  const sortedEvents = sortEvents(events)

  sortedEvents.forEach((event: RHEvent) => {
    for (let i = 0; i < rows.length; i++) {
      const rowEvents: RHEvent[] = rows[i]
      const previousEvents = last(rowEvents)
      if (!previousEvents || !doEventsOverlap(previousEvents, event)) {
        rowEvents.push(event)
        return
      } else {
        previousEvents.hasOverlap = true
        event.hasOverlap = true
      }
    }
    rows.push([event])
  })
  return rows
}

// Determines if two events overlap
const doEventsOverlap = (event1: RHEvent, event2: RHEvent) => {
  return event1.day === event2.day && event1.startTime < event2.endTime && event2.startTime < event1.endTime
}

// Converts a unix string into date format and returns the day in string
const getDayStringFromUNIX = (date: Date) => {
  const dayInInt = date.getDay()
  switch (dayInInt) {
    case 0:
      return 'Sunday'
    case 1:
      return 'Monday'
    case 2:
      return 'Tuesday'
    case 3:
      return 'Wednesday'
    case 4:
      return 'Thursday'
    case 5:
      return 'Friday'
    default:
      return 'Saturday'
  }
}

// Converts a date of Date type and returns the time of string type in 24hour format
const getTimeStringFromUNIX = (date: Date) => {
  const hours = '0' + date.getHours()
  const minutes = '0' + date.getMinutes()

  const formattedTime = hours.substr(-2) + minutes.substr(-2)

  return formattedTime
}

export const getShareSearchResults = (query: string) => (dispatch: Dispatch<ActionTypes>) => {
  console.log(query, dispatch)
  // Uncomment when endpoint for share search is obtained from backend
  // get(ENDPOINTS.SHARE_SEARCH).then((results) => {
  //   dispatch({
  //     type: SCHEDULING_ACTIONS.GET_SHARE_SEARCH_RESULTS,
  //     shareSearchResults: results,
  //   })
  // })
  dispatch(setIsLoading(false))
}

export const setIsLoading = (desiredState?: boolean) => (dispatch: Dispatch<ActionTypes>, getState: GetState) => {
  const { isLoading } = getState().scheduling
  dispatch({ type: SCHEDULING_ACTIONS.SET_IS_LOADING, isLoading: desiredState ? desiredState : !isLoading })
}

export const getSearchedEvents = (query: string) => (dispatch: Dispatch<ActionTypes>) => {
  console.log(query, dispatch)
  // Uncomment when endpoint for share search is obtained from backend
  // get(ENDPOINTS.SEARCH_EVENTS).then((results) => {
  //   dispatch({
  //     type: SCHEDULING_ACTIONS.GET_SEARCHED_EVENTS,
  //     searchedEvents: results,
  //   })
  // })
  dispatch(setIsLoading(false))
}
