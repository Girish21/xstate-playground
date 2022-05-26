import * as React from 'react'

export * from './wrapper'
export * from './fallback'
export * from './page-wrapper'
export const Stopwatch = React.lazy(() => import('./stopwatch'))
export const VirtualKeyboard = React.lazy(() => import('./virtual-keyboard'))
export const KeyboardSubnav = React.lazy(() => import('./keyboard-subnav'))
export const TouchTyping = React.lazy(() => import('./touch-typing'))
export const Notifications = React.lazy(() => import('./notifications'))
