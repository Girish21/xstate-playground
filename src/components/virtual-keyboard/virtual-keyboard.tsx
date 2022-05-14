import { InterpreterFrom } from 'xstate'
import { useInterpret, useSelector } from '@xstate/react'
import * as Keyboard from '../keyboard'
import { machine } from './machine'

function Key({
  children,
  service,
}: {
  children: string
  service: InterpreterFrom<typeof machine>
}) {
  const active = useSelector(service, state => state.context.key === children)

  return <Keyboard.Key active={active}>{children}</Keyboard.Key>
}

export function VirtualKeyboard() {
  const service = useInterpret(machine)

  return (
    <Keyboard.Container>
      {Keyboard.keys.map((row, rowIndex) => (
        <Keyboard.Row key={rowIndex} rowIndex={rowIndex}>
          {row.map(key => (
            <Key key={key} service={service}>
              {key}
            </Key>
          ))}
        </Keyboard.Row>
      ))}
    </Keyboard.Container>
  )
}
