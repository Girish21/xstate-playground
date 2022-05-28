import { assign, createMachine, sendParent } from 'xstate'

export const createButtonMachine = (id: number) =>
  createMachine(
    {
      tsTypes: {} as import('./button.typegen').Typegen0,
      context: { currentPlayer: 'X', selected: null },
      schema: { context: {} as TContext, events: {} as TEvent },
      id: `button-${id}`,
      initial: 'ready',
      states: {
        ready: {
          on: {
            DISPATCH_CURRENT_PLAYER: {
              actions: 'setCurrentActivePlayer',
            },
            CLICK: {
              actions: ['setSelected', 'notifyParent'],
              target: 'exit',
            },
            EXIT: {
              target: 'exit',
            },
          },
        },
        exit: {
          type: 'final',
        },
      },
    },
    {
      actions: {
        setCurrentActivePlayer: assign({
          currentPlayer: (_, event) => event.player,
        }),
        notifyParent: sendParent(_ => ({ type: 'CLICK', id })),
        setSelected: assign({ selected: ctx => ctx.currentPlayer }),
      },
    },
  )

type TContext = {
  currentPlayer: 'X' | 'O'
  selected: 'X' | 'O' | null
}

type TEvent =
  | {
      type: 'DISPATCH_CURRENT_PLAYER'
      player: 'X' | 'O'
    }
  | { type: 'CLICK' }
  | { type: 'EXIT' }
