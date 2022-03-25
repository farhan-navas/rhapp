import React from 'react'
import styled from 'styled-components'
import Avatar from '../../assets/Avatar_4x.png'
import { openUserTelegram } from '../../common/telegramMethods'
import { LAPTOP_VIEW } from '../../common/breakpoints'

const Header = styled.div`
  font-family: Lato;
  font-style: normal;
  font-weight: bold;
  font-size: 22px;
  line-height: 20px;
  text-align: center;
  color: #000000;
  padding: 30px;
`

const InfoArea = styled.div`
  font-family: Lato;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  letter-spacing: -0.015em;
  color: #191919;
`

const Container = styled.div`
  padding-top: 20px;
  margin-bottom: 20px;
`

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  ${LAPTOP_VIEW} {
    img {
      width: 120px;
    }
  }
`

interface Props {
  name: string
  handle: string
  avatar?: string
}

function GymKeyWith(props: Props) {
  return (
    <>
      <Header>Key With</Header>
      <ImageContainer>
        <img
          src={props.avatar === '' ? Avatar : props.avatar}
          style={{ height: 100, width: 100, objectFit: 'cover', borderRadius: 100 / 2 }}
          alt="Avatar"
          width="20%"
        />
      </ImageContainer>
      <Container>
        <InfoArea> {props.name} </InfoArea>
        <InfoArea onClick={() => openUserTelegram(props.handle)}>{'@' + props.handle}</InfoArea>
      </Container>
    </>
  )
}

GymKeyWith.defaultProps = {
  avatar: '',
}

export default GymKeyWith
