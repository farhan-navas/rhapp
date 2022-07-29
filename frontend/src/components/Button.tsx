import React from 'react'
import styled from 'styled-components'

const Button = styled.button<{ state: 'primary' | 'secondary' }>`
  height: 2.2rem;
  width: 10rem;
  border-radius: 100rem;
  border: solid 0.1rem transparent;
  background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)),
    linear-gradient(to left, #72ba75, #58b994);
  box-shadow: ${(props) => (props.state === 'primary' ? `0px` : `2px 1000px 1px #fff inset`)};
  color: ${(props) => (props.state === 'primary' ? `white` : `#58B994`)};

  &:active {
    background: ${(props) => (props.state === 'primary' ? '#D8E6DF' : '#8B8B8B')};
    color: #8b8b8b;
    transform: scale(0.95);
  }

  &:disabled {
    color: #bfbfbf;
    border-color: #bfbfbf;
    background: white;
  }
`

type Props = {
  state: 'primary' | 'secondary'
  text: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset' | undefined
  onClick: React.MouseEventHandler<HTMLButtonElement>
}

function ButtonComponent(prop: Props) {
  return (
    <Button onClick={prop.onClick} state={prop.state} disabled={prop.disabled} type={prop.type ?? 'button'}>
      {prop.text}
    </Button>
  )
}

export default ButtonComponent
