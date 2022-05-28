import { ActorRefFrom, assign, createMachine, spawn, send } from 'xstate'
import { createButtonMachine } from './button'

const winningStates = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

export const gameMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5RQIYFswDoCWEA2YAxIqAA4D2s2ALtuQHYkgAeiATGwAyYCcAjADYBbAKw8A7AJHCRAGhABPduIAcvfhI58VKyXwC+++agyYATmBQQFmUnhQKwZgAR9CAYQAyASXcBpJgoqWgYmVgQpPl5xABYAZh4BVTYBGMT5JQi4gUxOBKFtNnExPhjDY3QsCysbOwcnZzYPH39Ayho6RiQWRBFYzD6BFSK4zhU4tgkMxABaOPFeTh4YvljUgWWBAyMQEyrLa1t7Rxc+ZwB3bHpCACUAUQBlO4AVNuDOsMQVTijOGK0RGMhnwRHxpggYjEFuJ5jwxBwYn02OVdpVzAdascGmwLldbo8Xm8OqFuuFvr9-mwQUCVCCwYp2KJMDDxIlxJMxjw2HEUXt0TVMBAzChzvinq9ukFiV1QGSfrlKdSVMDQeDVmxMNkVMtdNkuDEVLy0dVrIQIAwsLBqChqFg+SbMmR2iEZT0EBxuPwhKIJFIZODuZ6NCpQWw0joRIYdvRyBA4Ew+bgCESXZ8IWwA0y4cqRHEoQUeMMjaYHUd6qcUx9SYhsjlIUlc3DSlSYuDITwBrnIXnlurthUSxiyydGpWSbKa6lMEUBHllXweAkfq2Ge6ip286DpH8udli-sBXUR2dLq6panqxFVMy+Hw2MMYhthJI22kN920it2f3UYPD1iXBxU8x1dcIkjUcRb3vMMnxnTMFhELst1nNJuQEfd+UOIURRAtNIN+ThpEQzhoKpOI1X6bRu1GQjvgNdCdntIcwHoCBcMvHh5VBJZihUFZON0eD3yEWkuVpeIMIddiJwQPNuBnOctkXTjSnBGZb09JZKVGSFlVifdpLdbQ1O0OJFmWKkRH+IRJCjfQgA */
  createMachine(
    {
      context: { buttons: [], currentPlayer: 'X', moves: 0 },
      tsTypes: {} as import('./game.typegen').Typegen0,
      schema: { context: {} as TContext, events: {} as TEvent },
      preserveActionOrder: true,
      id: 'game',
      initial: 'idle',
      states: {
        idle: {
          entry: 'initializeMachine',
          always: {
            target: 'ready',
          },
        },
        ready: {
          initial: 'player 1',
          states: {
            'player 1': {
              entry: ['player1Turn', 'dispathchCurrentPlayer'],
              on: {
                CLICK: {
                  actions: ['click', 'nextState'],
                },
                NEXT_STATE: [
                  {
                    cond: 'isPlayerWon',
                    target: 'player 1 win',
                  },
                  {
                    cond: 'isDraw',
                    target: 'draw',
                  },
                  {
                    target: 'player 2',
                  },
                ],
              },
            },
            'player 2': {
              entry: ['player2Turn', 'dispathchCurrentPlayer'],
              on: {
                CLICK: {
                  actions: ['click', 'nextState'],
                },
                NEXT_STATE: [
                  {
                    cond: 'isPlayerWon',
                    target: 'player 2 win',
                  },
                  {
                    cond: 'isDraw',
                    target: 'draw',
                  },
                  {
                    target: 'player 1',
                  },
                ],
              },
            },
            'player 1 win': {
              entry: 'gameEnd',
              on: {
                RESET: {
                  target: 'end',
                },
              },
            },
            'player 2 win': {
              entry: 'gameEnd',
              on: {
                RESET: {
                  target: 'end',
                },
              },
            },
            draw: {
              entry: 'gameEnd',
              on: {
                RESET: {
                  target: 'end',
                },
              },
            },
            end: {
              type: 'final',
            },
          },
          onDone: {
            target: 'idle',
          },
        },
      },
    },
    {
      actions: {
        initializeMachine: assign({
          buttons: _ =>
            Array.from({ length: 9 }, (_, i) => i).map(i => ({
              id: i,
              state: '',
              ref: spawn(createButtonMachine(i)),
            })),
          currentPlayer: _ => 'O' as const,
          moves: _ => 0,
        }),
        player1Turn: assign({ currentPlayer: _ => 'X' as const }),
        player2Turn: assign({ currentPlayer: _ => 'O' as const }),
        dispathchCurrentPlayer: ctx =>
          ctx.buttons.forEach(({ ref }) => {
            ref.send({
              type: 'DISPATCH_CURRENT_PLAYER',
              player: ctx.currentPlayer,
            })
          }),

        click: assign({
          moves: ctx => ctx.moves + 1,
          buttons: (ctx, event) => {
            return ctx.buttons.map(button =>
              button.id === event.id
                ? { ...button, state: ctx.currentPlayer }
                : button,
            )
          },
        }),
        nextState: send({ type: 'NEXT_STATE' }),
        gameEnd: ctx =>
          ctx.buttons.forEach(({ ref }) => ref.send({ type: 'EXIT' })),
      },
      guards: {
        isDraw: ctx => ctx.moves === ctx.buttons.length,
        isPlayerWon: ctx => {
          return winningStates.some(
            ([a, b, c]) =>
              ctx.currentPlayer === ctx.buttons[a].state &&
              ctx.buttons[a].state === ctx.buttons[b].state &&
              ctx.buttons[a].state === ctx.buttons[c].state,
          )
        },
      },
    },
  )

type TContext = {
  currentPlayer: 'X' | 'O'
  buttons: Array<{
    id: number
    state: string
    ref: ActorRefFrom<typeof createButtonMachine>
  }>
  moves: number
}

type TEvent =
  | { type: 'CLICK'; id: number }
  | { type: 'NEXT_STATE' }
  | { type: 'RESET' }
