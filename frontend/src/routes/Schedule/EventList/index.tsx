import React, { ReactElement, useEffect, useState } from 'react'
import { LeftOutlined } from '@ant-design/icons'
import { useHistory } from 'react-router-dom'
import { format } from 'date-fns'

import styled from 'styled-components'
import ImageDescriptionCard from '../../../components/Mobile/ImageDescriptionCard'
import SearchBar from '../../../components/Mobile/SearchBar'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import BottomNavBar from '../../../components/Mobile/BottomNavBar'
import Button from '../../../components/Mobile/Button'
import 'antd/dist/antd.css'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../store/types'
// import { searchedEvents } from '../../../store/stubs'
import { editUserEvents, fetchAllEvents, fetchUserEvents, getSearchedEvents } from '../../../store/scheduling/action'
import { PATHS } from '../../Routes'
import { SchedulingEvent } from '../../../store/scheduling/types'

const Background = styled.div`
  background-color: #fafaf4;
  height: 100vh;
  width: 100vw;
`
const NoEventDataText = styled.text`
  font-family: Inter;
  color: black;
  font-size: 20px;
  display: flex;
  justify-content: center;
`

type CurrentEvents = {
  avatar?: string
  title: string
  dateTime: string
  description: string
  bottomElement: ReactElement
}

const testData: CurrentEvents[] = [
  {
    avatar: 'https://i.pravatar.cc/150?img=3',
    title: 'Block 7 Christmas Event',
    dateTime: '08-dec-20 01:00',
    description: 'Only for block 7 members! Follow us @block7 to find out more!',
    bottomElement: (
      <Button
        hasSuccessMessage={true}
        buttonIsPressed={true}
        stopPropagation={true}
        defaultButtonDescription={'Add to Schedule'}
        updatedButtonDescription={'Remove from Schedule'}
      />
    ),
  },
  {
    title: 'dummyEvent',
    dateTime: 'dd-mm-yyyy hh:mm',
    description: 'description description description description description description',
    bottomElement: (
      <Button
        hasSuccessMessage={true}
        stopPropagation={true}
        defaultButtonDescription={'Add to Schedule'}
        updatedButtonDescription={'Remove from Schedule'}
      />
    ),
  },
]

export default function EventList({ currentEvents }: { currentEvents: SchedulingEvent[] }) {
  const history = useHistory()
  const dispatch = useDispatch()

  const { userEventsList, allEvents } = useSelector((state: RootState) => state.scheduling)

  const [searchValue, setSearchValue] = useState('')
  const searchedEvents = useSelector((state: RootState) => state.scheduling.searchedEvents)

  useEffect(() => {
    dispatch(fetchUserEvents())
    dispatch(fetchAllEvents())
  }, [dispatch])

  const formatDate = (eventStartTime: number) => {
    const date = new Date(eventStartTime * 1000)
    return format(date, 'dd-MMM-yy kk:mm')
  }

  const eventsToCards = (events) => {
    return events.map((result, index) => {
      return (
        <ImageDescriptionCard
          key={index}
          title={result.eventName}
          dateTime={formatDate(result.startDateTime)}
          description={result.description}
          bottomElement={
            <Button
              buttonIsPressed={
                userEventsList.filter((event) => {
                  return event.eventID === result.eventID
                }).length !== 0
              } //check if event is already in schedule
              hasSuccessMessage={true}
              stopPropagation={true}
              defaultButtonDescription={'Add to Schedule'}
              updatedButtonDescription={'Remove from Schedule'}
              onButtonClick={(buttonIsPressed) => {
                if (
                  userEventsList.filter((event) => {
                    return event.eventID === result.eventID
                  }).length !== 0
                ) {
                  if (buttonIsPressed) {
                    // event is in list and button is pressed
                    // remove event from list
                    console.log('remove ' + result.eventName + ' from list')
                    dispatch(editUserEvents('remove', result))
                  } else {
                    // event is in list, button is un-pressed
                    console.log('add ' + result.eventName + ' to list')
                    dispatch(editUserEvents('add', result))
                  }
                } else if (
                  userEventsList.filter((event) => {
                    return event.eventID === result.eventID
                  }).length === 0
                ) {
                  if (buttonIsPressed) {
                    // event is not in list, button is un-pressed
                    console.log('remove ' + result.eventName + ' from list')
                    dispatch(editUserEvents('remove', result))
                  } else {
                    // event is not in list and button is pressed
                    // add event to list
                    console.log('add ' + result.eventName + ' to list')
                    dispatch(editUserEvents('add', result))
                  }
                }
                return
              }}
            />
          }
        />
      )
    })
  }

  const data = testData //eventsToCards(allEvents)

  const renderResults = () => {
    if (searchValue) {
      return searchedEvents ? (
        searchedEvents.length === 0 ? (
          <NoEventDataText>No Events Found</NoEventDataText>
        ) : (
          eventsToCards(searchedEvents)
        )
      ) : (
        <NoEventDataText>No Events Found</NoEventDataText>
      )
    } else {
      console.log(allEvents)
      return eventsToCards(allEvents)
      // return data ? (
      //   data.map((event, index) => {
      //     return (
      //       <ImageDescriptionCard
      //         key={index}
      //         avatar={event.avatar}
      //         title={event.title}
      //         dateTime={event.dateTime}
      //         description={event.description}
      //         bottomElement={event.bottomElement}
      //       />
      //     )
      //   })
      // ) : (
      //   <>
      //     <NoEventDataText>No Upcoming Events</NoEventDataText>
      //   </>
      // )
    }
  }

  const onChange = (input: string) => {
    setSearchValue(input)
    input && dispatch(getSearchedEvents(input))
    console.log(searchValue)
  }

  const leftIcon = (
    <LeftOutlined
      style={{ color: 'black', padding: '0 10px' }}
      onClick={() => {
        history.push(PATHS.SCHEDULE_PAGE)
      }}
    />
  )
  console.log(searchedEvents)
  return (
    <Background>
      <TopNavBar title={'Events'} leftIcon={true} leftIconComponent={leftIcon} />
      <SearchBar placeholder={'Search event'} value={searchValue} onChange={onChange} />
      {renderResults()}
      <BottomNavBar />
    </Background>
  )
}
