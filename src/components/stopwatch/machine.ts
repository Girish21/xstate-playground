import { assign, createMachine } from 'xstate'

const context = {
  startTime: 0,
  offset: 0,
  duration: 0,
}

export const machine = createMachine(
  {
    tsTypes: {} as import('./machine.typegen').Typegen0,
    id: 'stopwatch',
    initial: 'idle',
    context,
    states: {
      idle: {
        entry: ['reset'],
        on: {
          START: {
            target: 'running',
            actions: ['setCurrentTime'],
          },
        },
      },
      running: {
        invoke: {
          id: 'tick',
          src: _ => cb => {
            const interval = setInterval(() => {
              cb('TICK')
            }, 1000 / 60)

            return () => clearInterval(interval)
          },
        },
        entry: 'setCurrentTime',
        on: {
          TICK: {
            actions: ['updateTick'],
          },
          STOP: {
            target: 'stop',
          },
          PAUSE: {
            target: 'pause',
            actions: ['addOffset'],
          },
        },
      },
      stop: {
        on: {
          RESET: {
            target: 'idle',
          },
        },
      },
      pause: {
        on: {
          RESUME: {
            target: 'running',
          },
          STOP: {
            target: 'stop',
          },
        },
      },
    },
  },
  {
    actions: {
      addOffset: assign({
        offset: context => context.offset + Date.now() - context.startTime,
      }),
      reset: assign({ duration: _ => 0, offset: _ => 0 }),
      setCurrentTime: assign({ startTime: _ => Date.now() }),
      updateTick: assign({
        duration: context => Date.now() - context.startTime + context.offset,
      }),
    },
  },
)
