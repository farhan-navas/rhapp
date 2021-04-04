import React from 'react'

import styled from 'styled-components'
import { StatusSymbol } from './StatusSymbol'
import tick from '../../assets/whiteTick.svg'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store/types'
import { setSelectedRestaurant } from '../../store/supper/action'

const CheckIcon = styled.img`
  margin-top: -4px;
`

const MainContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin: auto;
  justify-content: space-evenly;
  flex-wrap: wrap;
  width: 80vw;
`

type Props = {
  restaurantList: string[]
}

export const RestaurantBubbles = (props: Props) => {
  const DARK_BLUE = '#002642'
  const CHECK_ICON = <CheckIcon src={tick} alt="Check Icon" />

  const { selectedRestaurant } = useSelector((state: RootState) => state.supper)
  const dispatch = useDispatch()

  return (
    <MainContainer>
      {props.restaurantList.map((restaurant, index) => {
        if (selectedRestaurant === restaurant) {
          return (
            <StatusSymbol
              border={DARK_BLUE}
              color="white"
              borderWidth="1px"
              backgroundColor="bluegrey"
              shadow="0px 4px 4px 0px #6b6b6b"
              key={index}
              text={restaurant}
              rightIcon={CHECK_ICON}
              fontWeight={500}
              fontSize="14px"
            />
          )
        } else {
          return (
            <StatusSymbol
              onClick={() => {
                dispatch(setSelectedRestaurant(restaurant))
              }}
              border={DARK_BLUE}
              color={DARK_BLUE}
              borderWidth="1px"
              shadow="0px 4px 4px 0px #6b6b6b"
              key={index}
              text={restaurant}
              fontWeight={500}
              fontSize="14px"
            />
          )
        }
      })}
    </MainContainer>
  )
}
