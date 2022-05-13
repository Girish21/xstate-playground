import { useInterpret, useSelector } from '@xstate/react'
import clsx from 'clsx'
import * as React from 'react'
import { InterpreterFrom } from 'xstate'

import './stopwatch.css'
import { machine } from './machine'

function pad(time: number, maxLength = 2) {
  return String(time).padStart(maxLength, '0')
}

function getMsAndSec(timeElapsed: number) {
  return [timeElapsed % 1000, timeElapsed / 1000]
}

function getMinutes(timeElapsed: number) {
  const [_, s] = getMsAndSec(timeElapsed)

  return pad(Math.floor(s / 60))
}

function getSeconds(timeElapsed: number) {
  const [_, s] = getMsAndSec(timeElapsed)

  return pad(Math.floor(s % 60))
}

function getMillis(timeElapsed: number) {
  const [ms] = getMsAndSec(timeElapsed)

  return pad(ms, 3)
}

const Display = ({ service }: { service: InterpreterFrom<typeof machine> }) => {
  const timeElapsed = useSelector(service, state => state.context.duration)

  return (
    <div className='font-mono bg-lime-400 text-gray-900 dark:text-gray-900 p-6 rounded-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
      <div className='flex items-end'>
        <span className='text-2xl italic'>{getMinutes(timeElapsed)}</span>
        <span className='text-2xl italic'>:</span>
        <span className='text-2xl italic'>{getSeconds(timeElapsed)}</span>
        <span className='italic'>{getMillis(timeElapsed)}</span>
      </div>
    </div>
  )
}

const Button: React.FC<
  { children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ children, className, onClick, ...rest }) => {
  const ref = React.useRef<HTMLButtonElement>(null)

  const clickHandler: React.MouseEventHandler<HTMLButtonElement> = event => {
    /**
     * #hack
     * https://css-tricks.com/restart-css-animation/#aa-update-another-javascript-method-to-restart-a-css-animation
     */
    ref.current?.classList.remove('stopwatch--button__animate')
    void ref.current?.offsetWidth
    ref.current?.classList.add('stopwatch--button__animate')

    onClick?.(event)
  }

  return (
    <button
      ref={ref}
      className={clsx(
        className,
        'text-neutral-900 text-xs origin-[50%_115px] absolute top-0 left-1/2 -translate-x-1/2 isolate z-20 after:content-[""] after:w-4 after:h-5 after:bg-gray-400 after:absolute after:-top-4 after:left-1/2 after:-translate-x-1/2 after:z-[-1] before:content-[""] before:rounded before:w-8 before:h-5 before:bg-gray-300 before:absolute before:-top-8 before:left-1/2 before:-translate-x-1/2',
      )}
      onClick={clickHandler}
      {...rest}
    >
      <span className='z-20'>{children}</span>
    </button>
  )
}

const Actions = ({ service }: { service: InterpreterFrom<typeof machine> }) => {
  const idle = useSelector(service, state => state.matches('idle'))
  const running = useSelector(service, state => state.matches('running'))
  const paused = useSelector(service, state => state.matches('pause'))
  const stopped = useSelector(service, state => state.matches('stop'))

  const handleStartStopClick = () => {
    if (idle) {
      service.send('START')
      return
    }
    if (paused) {
      service.send('RESUME')
      return
    }
    service.send('STOP')
  }

  const handlePauseReset = () => {
    if (running) {
      service.send('PAUSE')
      return
    }
    if (stopped) {
      service.send('RESET')
      return
    }
  }

  return (
    <div className='absolute inset-0'>
      <Button
        onClick={handleStartStopClick}
        disabled={stopped}
        className='rotate-45'
      >
        Start/Stop
      </Button>
      <Button
        onClick={handlePauseReset}
        disabled={idle || paused}
        className='-rotate-45'
      >
        Pause/Reset
      </Button>
    </div>
  )
}

export function Stopwatch() {
  const service = useInterpret(machine)

  return (
    <section>
      <div className='w-64 h-64 rounded-[100%] bg-neutral-900 relative isolate after:content-[""] after:absolute after:inset-0 z-10 after:bg-transparent after:border-[24px] after:border-gray-400 after:rounded-[100%]'>
        <Display service={service} />
        <Actions service={service} />
      </div>
    </section>
  )
}
