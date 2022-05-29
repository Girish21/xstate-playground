import { useInterpret, useSelector } from '@xstate/react'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import * as React from 'react'
import { ActorRefFrom, InterpreterFrom } from 'xstate'
import { ButtonMachine, GameMachine, machine } from './machine'

function ButtonImpl({ buttonRef }: { buttonRef: ActorRefFrom<ButtonMachine> }) {
  const selected = useSelector(buttonRef, state => state.context.selected)
  const inExitState = useSelector(buttonRef, state => state.matches('exit'))

  return (
    <button
      className={clsx(
        'h-20 w-20 overflow-hidden rounded bg-green-400 text-5xl font-bold text-gray-700 dark:bg-green-600 dark:text-white',
      )}
      disabled={inExitState}
      onClick={() => {
        buttonRef.send({ type: 'CLICK' })
      }}
    >
      <AnimatePresence>
        <motion.span
          key={selected}
          initial={{ y: '20%', opacity: 0.5, rotateY: 90 }}
          animate={{ y: '0%', opacity: 1, rotateY: 0 }}
          exit={{ y: '150%', opacity: 0 }}
          className='block'
        >
          {selected}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
const Button = React.memo(ButtonImpl)

function Buttons({ service }: { service: InterpreterFrom<GameMachine> }) {
  const buttons = useSelector(service, state => state.context.buttons)

  return (
    <div className='grid grid-cols-3 gap-4 rounded bg-green-600 dark:bg-green-900'>
      {buttons.map(({ id, ref }) => (
        <Button key={id} buttonRef={ref} />
      ))}
    </div>
  )
}

function Message({ service }: { service: InterpreterFrom<GameMachine> }) {
  const player1Turn = useSelector(service, state =>
    state.matches('ready.player 1'),
  )
  const player2Turn = useSelector(service, state =>
    state.matches('ready.player 2'),
  )
  const player1Win = useSelector(service, state =>
    state.matches('ready.player 1 win'),
  )
  const player2Win = useSelector(service, state =>
    state.matches('ready.player 2 win'),
  )
  const draw = useSelector(service, state => state.matches('ready.draw'))

  if (player1Turn) {
    return <>Player 1</>
  }

  if (player2Turn) {
    return <>Player 2</>
  }

  if (player1Win) {
    return <>Player 1 wins!</>
  }

  if (player2Win) {
    return <>Player 2 wins!</>
  }

  if (draw) {
    return <>Draw!</>
  }

  return null
}

function GameMessage({ service }: { service: InterpreterFrom<GameMachine> }) {
  return (
    <h2 className='text-center text-4xl font-bold text-gray-900 dark:text-gray-200'>
      <Message service={service} />
    </h2>
  )
}

function ResetImpl({ clickHandler }: { clickHandler: () => void }) {
  return (
    <motion.button
      className='w-full rounded bg-slate-500 px-3 py-2 text-3xl font-bold'
      onClick={clickHandler}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      Reset
    </motion.button>
  )
}

function Reset({ service }: { service: InterpreterFrom<GameMachine> }) {
  const reset = useSelector(
    service,
    state =>
      state.matches('ready.draw') ||
      state.matches('ready.player 1 win') ||
      state.matches('ready.player 2 win'),
  )

  return (
    <div className='h-[52px]'>
      <AnimatePresence>
        {reset && <ResetImpl clickHandler={() => service.send('RESET')} />}
      </AnimatePresence>
    </div>
  )
}

export default function TicTacToe() {
  const service = useInterpret(machine)

  return (
    <div className='flex flex-col justify-center gap-4'>
      <GameMessage service={service} />
      <Buttons service={service} />
      <Reset service={service} />
    </div>
  )
}
