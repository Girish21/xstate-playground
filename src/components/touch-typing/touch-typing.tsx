import { useActor, useInterpret, useSelector } from '@xstate/react'
import clsx from 'clsx'
import { ActorRefFrom, InterpreterFrom } from 'xstate'
import { characterMachine, machine } from './machine'

function Character({
  actorRef,
  children,
}: {
  actorRef: ActorRefFrom<typeof characterMachine>
  children: string
  index: number
}) {
  const [state] = useActor(actorRef)

  return (
    <span
      className={clsx(
        state.matches('active')
          ? 'before:bg-blue-400 before:bg-opacity-10 after:bg-violet-500 dark:before:bg-blue-300 dark:before:bg-opacity-10 dark:after:bg-violet-800'
          : '',
        state.matches('error')
          ? 'text-rose-900 before:bg-red-600 before:bg-opacity-10 after:bg-red-900 dark:text-rose-500 dark:before:bg-red-500 dark:before:bg-opacity-10 dark:after:bg-red-700'
          : '',
        'relative select-none whitespace-pre px-2 pt-2 pb-1 font-mono text-lg before:absolute before:inset-0 before:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:content-[""]',
      )}
    >
      {children}
    </span>
  )
}

function Characters({ service }: { service: InterpreterFrom<typeof machine> }) {
  const characters = useSelector(service, state => state.context.characters)

  return (
    <div>
      <div className='flex flex-wrap justify-center'>
        {characters.map(({ character, ref }, index) => (
          <Character key={index} actorRef={ref} index={index}>
            {character}
          </Character>
        ))}
      </div>
    </div>
  )
}

export function TouchTyping() {
  const service = useInterpret(machine, {
    context: {
      sentence: 'Moderate test sentence for calculating words per minute.',
    },
  })

  return <Characters service={service} />
}
