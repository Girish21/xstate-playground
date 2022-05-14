import { createMachine, assign } from 'xstate'

const context = {
  keys: [] as string[],
  shift: false,
  keyDown: false,
}

type TContext = typeof context
type TEvents =
  | { type: 'START' }
  | { type: 'KEYDOWN'; key: string }
  | { type: 'KEYUP'; key: string }
  | { type: 'SHIFT'; pressed: boolean }

export const machine = createMachine(
  {
    tsTypes: {} as import('./machine.typegen').Typegen0,
    id: 'keyboard',
    schema: {
      context: {} as TContext,
      events: {} as TEvents,
    },
    context,
    initial: 'IDLE',
    states: {
      IDLE: {
        always: {
          target: 'START',
        },
      },
      START: {
        invoke: {
          id: 'keyboard handler',
          src: _ => cb => {
            function keyDownHandler(e: KeyboardEvent) {
              if (e.key === 'Shift') {
                cb({ type: 'SHIFT', pressed: e.shiftKey })
              }
              cb({ type: 'KEYDOWN', key: e.key })
            }
            function keyUpHandler(e: KeyboardEvent) {
              if (e.key === 'Shift') {
                cb({ type: 'SHIFT', pressed: e.shiftKey })
              }
              cb({ type: 'KEYUP', key: e.key })
            }

            window.addEventListener('keydown', keyDownHandler)
            window.addEventListener('keyup', keyUpHandler)

            return () => {
              window.removeEventListener('keydown', keyDownHandler)
              window.removeEventListener('keyup', keyUpHandler)
            }
          },
        },
        on: {
          KEYDOWN: {
            cond: 'keyGuard',
            actions: ['keydown'],
          },
          KEYUP: {
            cond: 'keyGuard',
            actions: ['keyup'],
          },
          SHIFT: {
            actions: ['shift'],
          },
        },
      },
    },
  },
  {
    actions: {
      keydown: assign({
        keys: (context, event) => [...context.keys, event.key],
        keyDown: _ => true,
      }),
      keyup: assign({
        keys: (context, event) => {
          const index = context.keys.findIndex(key => key === event.key)
          return [
            ...context.keys.slice(0, index),
            ...context.keys.slice(index + 1),
          ]
        },
        keyDown: _ => false,
      }),
      shift: assign({ shift: (_, event) => event.pressed }),
    },
    guards: {
      keyGuard: (context, event) =>
        event.type === 'KEYDOWN' && context.keyDown === true
          ? false
          : event.key !== 'Shift' && event.key !== 'Enter' && event.key !== ' ',
    },
  },
)
