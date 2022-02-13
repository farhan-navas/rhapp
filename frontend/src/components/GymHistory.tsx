import React from 'react'
import { gymHistory } from '../store/stubs'
import { unixToFormattedTimeNoSeconds } from '../common/unixToFormattedTimeNoSeconds'
import { unixToFullDate } from '../common/unixToFullDate'
import styled from 'styled-components'

const Container = styled.div`
  padding: 30px;
`

const Date = styled.div`
  font-family: Lato;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 22px;
  display: flex;
  align-items: center;
  letter-spacing: -0.015em;

  color: #000000;

  padding-top: 1em;
`

const Content = styled.div`
  font-family: Lato;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 22px;
  display: flex;
  align-items: center;
  letter-spacing: -0.015em;

  color: #000000;

  padding: 1.25em 1em 1em 0;
`

const ContentRow = styled.div`
  display: flex;
  align-items: center;
`

const Status = styled.div<{ status: string }>`
  width: 4px;
  height: 49px;
  background: ${(props) => (props.status == 'open' ? `#58b994` : props.status == 'closed' ? `#F37562` : `transparent`)};
  border-radius: 2px;
  margin-top: 0.5em;
  margin-right: 1em;
`

const GymHistory = () => {
  return (
    <Container>
      {gymHistory.map((entry) => (
        <>
          <Date>{unixToFullDate(entry.date)}</Date>
          {entry.users.map((user) => (
            <ContentRow key={user.userDetails}>
              <Content>{unixToFormattedTimeNoSeconds(user.time)}</Content>
              <Status status={user.gymStatus} />
              <Content>{user.userDetails}</Content>
            </ContentRow>
          ))}
        </>
      ))}
    </Container>
  )
}

export default GymHistory
