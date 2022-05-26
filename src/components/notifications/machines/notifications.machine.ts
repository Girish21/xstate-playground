import { ActorRefFrom, assign, createMachine, spawn } from 'xstate'
import { createNotification, NotificationType } from './notification.machine'

export const machine = createMachine(
  {
    tsTypes: {} as import('./notifications.machine.typegen').Typegen0,
    schema: {
      context: {} as TContext,
      events: {} as TEvents,
    },
    context: {
      notifications: [],
    },
    id: 'notifications',
    initial: 'ready',
    states: {
      ready: {
        on: {
          NEW: {
            actions: ['newNotification'],
          },
          CLEAR: {
            actions: ['clearNotification'],
          },
        },
      },
    },
  },
  {
    actions: {
      newNotification: assign({
        notifications: (context, { notification, notificationType }) => {
          const id = window.crypto.randomUUID()
          return [
            ...context.notifications,
            {
              notification,
              id,
              ref: spawn(
                createNotification(id, notification, notificationType),
              ),
            },
          ]
        },
      }),
      clearNotification: assign({
        notifications: (context, { id }) => {
          return context.notifications.filter(
            ({ id: notificationId }) => notificationId !== id,
          )
        },
      }),
    },
  },
)

type TContext = {
  notifications: Array<{
    notification: string
    id: string
    ref: ActorRefFrom<typeof createNotification>
  }>
}

type TEvents =
  | {
      type: 'NEW'
      notification: string
      notificationType: NotificationType
    }
  | { type: 'CLEAR'; id: string }
