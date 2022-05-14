import { createMachine, assign } from 'xstate'

const context = {
  capsLock: false,
  keys: [] as string[],
  keyDown: false,
  shift: false,
  uppercase: false,
}

type TContext = typeof context
type TEvents =
  | { type: 'START' }
  | { type: 'KEYDOWN'; key: string }
  | { type: 'KEYUP'; key: string }
  | { type: 'SHIFT'; pressed: boolean }
  | { type: 'CAPS'; on: boolean }

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
              if (e.key === 'CapsLock' || e.getModifierState('CapsLock')) {
                cb({ type: 'CAPS', on: true })
              }
              if (e.key === 'Shift') {
                cb({ type: 'SHIFT', pressed: true })
              }
              cb({ type: 'KEYDOWN', key: e.key })
            }
            function keyUpHandler(e: KeyboardEvent) {
              if (e.key === 'CapsLock') {
                cb({ type: 'CAPS', on: false })
              }
              if (e.key === 'Shift') {
                cb({ type: 'SHIFT', pressed: false })
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
          CAPS: {
            actions: ['caps'],
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
          const keys = [...new Set(context.keys)]
          const index = keys.findIndex(
            key => (context.uppercase ? key : key.toLowerCase()) === event.key,
          )
          return [...keys.slice(0, index), ...keys.slice(index + 1)]
        },
        keyDown: _ => false,
      }),
      shift: assign((context, event) => {
        const shiftPressed = event.pressed
        const capsLockOn = context.capsLock
        return {
          ...context,
          shift: event.pressed,
          uppercase: capsLockOn ? (shiftPressed ? false : true) : shiftPressed,
        }
      }),
      caps: assign((context, event) => {
        const nextState = event.on
        return { ...context, uppercase: nextState, capsLock: nextState }
      }),
    },
    guards: {
      keyGuard: (_, event) =>
        event.key !== 'Shift' &&
        event.key !== 'Enter' &&
        event.key !== ' ' &&
        event.key !== 'CapsLock',
    },
  },
)
