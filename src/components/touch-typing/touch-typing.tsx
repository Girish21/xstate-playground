import * as React from 'react'
import { useActor, useInterpret, useSelector } from '@xstate/react'
import clsx from 'clsx'
import { ActorRefFrom, InterpreterFrom } from 'xstate'
import { createCharacterMachine, createWordMachine, machine } from './machine'

function Character({
  actorRef,
  children,
}: {
  actorRef: ActorRefFrom<typeof createCharacterMachine>
  children: string
  index: number
}) {
  const [state] = useActor(actorRef)

  return (
    <span
      className={clsx(
        state.matches('ACTIVE')
          ? 'before:bg-blue-400 before:bg-opacity-10 after:bg-violet-500 dark:before:bg-blue-300 dark:before:bg-opacity-10 dark:after:bg-violet-800'
          : '',
        state.matches('ERROR')
          ? 'text-rose-900 before:bg-red-600 before:bg-opacity-10 after:bg-red-900 dark:text-rose-500 dark:before:bg-red-500 dark:before:bg-opacity-10 dark:after:bg-red-700'
          : '',
        'relative select-none whitespace-pre px-2 pt-2 pb-1 font-mono text-lg before:absolute before:inset-0 before:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:content-[""]',
      )}
    >
      {children}
    </span>
  )
}

function Word({
  service,
}: {
  service: ActorRefFrom<typeof createWordMachine>
}) {
  const characters = useSelector(service, state => state.context.characters)
  const active = useSelector(service, state => state.matches('ACTIVE'))

  return (
    <div
      className={clsx(
        `relative flex justify-center border-t-2 border-transparent`,
        active && 'rounded-md border-slate-600 dark:border-zinc-300',
      )}
    >
      {characters.map(({ character, ref }, index) => (
        <Character key={index} actorRef={ref} index={index}>
          {character}
        </Character>
      ))}
    </div>
  )
}

function Sentence({ service }: { service: InterpreterFrom<typeof machine> }) {
  const words = useSelector(service, state => state.context.words)

  return (
    <div className='flex max-w-[75ch] flex-wrap gap-1'>
      {words.map(({ word, ref }) => (
        <Word key={word} service={ref} />
      ))}
    </div>
  )
}

function Reset({ service }: { service: InterpreterFrom<typeof machine> }) {
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const showRest = useSelector(service, state => state.matches('END'))

  React.useEffect(() => {
    if (showRest && buttonRef.current) {
      buttonRef.current.focus()
    }
  }, [showRest])

  return (
    <button
      ref={buttonRef}
      onClick={() => service.send('RESET')}
      className={clsx(
        showRest ? 'visible' : 'invisible',
        'rounded bg-gray-200 px-4 py-1 shadow-md transition duration-150 ease-out hover:scale-110 active:scale-95 active:shadow-none dark:bg-slate-700 dark:shadow-black',
      )}
    >
      Rest
    </button>
  )
}

function PrimaryStatText({
  children,
  className,
  ...rest
}: { children: React.ReactNode } & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={clsx(
        'font-mono text-4xl font-bold italic text-gray-800 dark:text-gray-100',
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  )
}

function SecondaryStatText({
  children,
  className,
  ...rest
}: { children: React.ReactNode } & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={clsx(
        'text-sm text-gray-600 opacity-80 dark:text-gray-200 dark:opacity-75',
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  )
}

function WPM({ service }: { service: InterpreterFrom<typeof machine> }) {
  const wpm = useSelector(service, state => state.context.wpm)

  return (
    <p className='select-none'>
      <PrimaryStatText>{isNaN(wpm) ? 0 : wpm}</PrimaryStatText>{' '}
      <SecondaryStatText title='Words Per Minute'>w.p.m</SecondaryStatText>
    </p>
  )
}

function Accuracy({ service }: { service: InterpreterFrom<typeof machine> }) {
  const errors = useSelector(service, state => state.context.errors)
  const length = useSelector(service, state => state.context.length)

  return (
    <p className='select-none'>
      <PrimaryStatText>
        {100 - Math.floor((errors / length) * 100)}%
      </PrimaryStatText>
      <SecondaryStatText className='ml-2'>Accuracy</SecondaryStatText>
    </p>
  )
}

function Stats({ service }: { service: InterpreterFrom<typeof machine> }) {
  return (
    <div className='flex items-center gap-8'>
      <Accuracy service={service} />
      <WPM service={service} />
    </div>
  )
}

export function TouchTyping() {
  const service = useInterpret(machine, {
    context: {
      sentence: 'Moderate test sentence for calculating words per minute.',
    },
  })

  return (
    <div className='flex flex-col items-center justify-center gap-4'>
      <Sentence service={service} />
      <Stats service={service} />
      <Reset service={service} />
    </div>
  )
}
