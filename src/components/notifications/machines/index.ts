import { machine } from './notifications.machine'
import { createNotification } from './notification.machine'

export { machine }

export type NotificationsMachine = typeof machine
export type NotificationMachine = typeof createNotification
