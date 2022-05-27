import { useActor, useInterpret, useSelector } from '@xstate/react'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { ActorRefFrom } from 'xstate'
import close from '../../assets/close.svg'
import { machine, NotificationMachine, NotificationsMachine } from './machines'
import { NotificationType } from './machines/notification.machine'

const NOTIFICATIONS: Array<{
  notification: string
  notificationType: NotificationType
}> = [
  {
    notification: 'orem ipsum dolor sit amet.',
    notificationType: 'error',
  },
  {
    notification: 'Sed pulvinar tortor sed sapien.',
    notificationType: 'info',
  },
  {
    notification: 'Nam elit dolor, suscipit id.',
    notificationType: 'success',
  },
  {
    notification: 'Donec varius maximus enim, at.',
    notificationType: 'warn',
  },
]

function Notification({
  service,
}: {
  service: ActorRefFrom<NotificationMachine>
}) {
  const [state, send] = useActor(service)

  return (
    <motion.li
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      layout
      className='relative block p-1'
    >
      <button
        onClick={() => {
          send({ type: 'DONE' })
        }}
        className='absolute top-0 right-0 rounded-full bg-gray-800 bg-opacity-25 p-0.5 dark:bg-gray-600'
      >
        <svg className='h-3 w-3 text-white'>
          <use href={`${close}#close`} />
        </svg>
      </button>
      <div
        className={clsx(
          'rounded-md p-3 text-lg text-white',
          state.context.type === 'success' && 'bg-green-500 dark:bg-green-900',
          state.context.type === 'info' && 'bg-blue-500 dark:bg-blue-900',
          state.context.type === 'warn' && 'bg-amber-500 dark:bg-amber-900',
          state.context.type === 'error' && 'bg-red-500 dark:bg-pink-900',
        )}
      >
        {state.context.text}
      </div>
    </motion.li>
  )
}

function NotificationList({
  service,
}: {
  service: ActorRefFrom<NotificationsMachine>
}) {
  const notifications = useSelector(
    service,
    state => state.context.notifications,
    (prev, next) => {
      if (prev.length !== next.length) {
        return false
      }
      const prevIdSet = new Set(prev.map(({ id }) => id))
      return next.every(({ id }) => prevIdSet.has(id))
    },
  )

  return (
    <div className='fixed right-2 top-2 overflow-hidden'>
      <ol className='flex flex-col-reverse gap-2'>
        <AnimatePresence>
          {notifications.map(({ id, ref }) => (
            <Notification key={id} service={ref} />
          ))}
        </AnimatePresence>
      </ol>
    </div>
  )
}

export default function Notifications() {
  const service = useInterpret(machine)

  return (
    <div>
      <NotificationList service={service} />
      <button
        onClick={() => {
          service.send({
            type: 'NEW',
            ...NOTIFICATIONS[Math.floor(Math.random() * 4)],
          })
        }}
      >
        Send Notification
      </button>
    </div>
  )
}
