import styled from 'styled-components'

export const CountdownContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

export const CountdownTitle = styled.div`
  text-align: center;
  color: rgba(255, 255, 255, 0.75);
`

export const CountdownTimeBoxContainer = styled.div`
  display: flex;
  gap: 5px;
  font-size: 14px;
`

export const CountdownTimeBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const CountdownTimeBoxValueContainer = styled.div`
  position: relative;
  padding: 0.8em 1em;

  &::before {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 50%;
    background-color: hsl(237, 20%, 21%);
    z-index: -1;
    border-radius: 9px;
  }

  &::after {
    content: '';
    display: block;
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 50%;
    background-color: hsl(236, 21%, 26%);
    z-index: -1;
    border-radius: 9px;
    box-shadow: 0 7px 2px rgba(0, 0, 0, 0.5);
  }
`

export const CountdownTimeBoxValue = styled.div`
  color: hsl(345, 95%, 68%);
  font-size: 30px;
  font-family: 'Ubuntu Sans Mono', monospace;
  text-align: center;
`

export const CountdownTimeBoxTitle = styled.div`
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.75);
  text-align: center;
  font-size: 10px;
`
