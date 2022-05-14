import { createMachine, assign } from 'xstate'

const context = {
  key: '',
}

type TContext = typeof context
type TEvents =
  | { type: 'START' }
  | { type: 'KEYDOWN'; key: string }
  | { type: 'KEYUP' }

export const machine = createMachine(
  {
    tsTypes: {} as import('./machine.typegen').Typegen0,
    id: 'keyboard',
    schema: { context: {} as TContext, events: {} as TEvents },
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
              cb({ type: 'KEYDOWN', key: e.key })
            }
            function keyUpHandler() {
              cb('KEYUP')
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
            actions: ['keydown'],
          },
          KEYUP: {
            actions: ['keyup'],
          },
        },
      },
    },
  },
  {
    actions: {
      keydown: assign({ key: (_, event) => event.key.toLowerCase() }),
      keyup: assign({ key: _ => '' }),
    },
  },
)
