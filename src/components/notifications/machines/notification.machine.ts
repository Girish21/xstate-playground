import { createMachine } from 'xstate'
import { sendParent } from 'xstate/lib/actions'

export const notificationTypes = ['success', 'info', 'warn', 'error'] as const
export type NotificationType = typeof notificationTypes[number]

export const createNotification = (
  id: string,
  text: string,
  type: NotificationType,
) =>
  createMachine(
    {
      tsTypes: {} as import('./notification.machine.typegen').Typegen0,
      schema: {
        context: {} as TContext,
        events: {} as TEvents,
      },
      context: {
        text,
        type,
      },
      id,
      initial: 'idle',
      states: {
        idle: {
          always: 'active',
        },
        active: {
          invoke: {
            id: 'notification timer',
            src: _ => cb => {
              const timeoutId = setTimeout(() => {
                cb({ type: 'DONE' })
              }, 5000)

              return () => {
                clearTimeout(timeoutId)
              }
            },
          },
          on: {
            DONE: {
              target: 'clear',
            },
          },
        },
        clear: {
          always: {
            actions: ['clearNotification'],
            target: 'exit',
          },
        },
        exit: {},
      },
    },
    { actions: { clearNotification: sendParent({ type: 'CLEAR', id }) } },
  )

type TContext = {
  type: NotificationType
  text: string
}

type TEvents = { type: 'DONE' }
