import * as React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Wrapper, Fallback } from './components'

const IndexPage = React.lazy(() => import('./Pages'))
const Stopwatch = React.lazy(() => import('./Pages/stopwatch'))
const Keyboard = React.lazy(() => import('./Pages/keyboard'))
const VirtualKeyboard = React.lazy(
  () => import('./Pages/keyboard/virtual-keyboard'),
)
const TouchTyping = React.lazy(() => import('./Pages/keyboard/touch-typing'))
const Notifications = React.lazy(() => import('./Pages/notifications'))
const TicTacToe = React.lazy(() => import('./Pages/tic-tac-toe'))

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Wrapper />}>
          <Route
            index
            element={
              <React.Suspense fallback={<Fallback />}>
                <IndexPage />
              </React.Suspense>
            }
          />
          <Route
            path='stopwatch'
            element={
              <React.Suspense fallback={<Fallback />}>
                <Stopwatch />
              </React.Suspense>
            }
          />
          <Route
            path='notifications'
            element={
              <React.Suspense fallback={<Fallback />}>
                <Notifications />
              </React.Suspense>
            }
          />
          <Route
            path='keyboard'
            element={
              <React.Suspense fallback={<Fallback />}>
                <Keyboard />
              </React.Suspense>
            }
          >
            <Route
              path='virtual-keyboard'
              element={
                <React.Suspense fallback={<Fallback />}>
                  <VirtualKeyboard />
                </React.Suspense>
              }
            />
            <Route
              path='touch-typing'
              element={
                <React.Suspense fallback={<Fallback />}>
                  <TouchTyping />
                </React.Suspense>
              }
            />
            <Route index element={<Navigate to='virtual-keyboard' replace />} />
          </Route>
          <Route
            path='tic-tac-toe'
            element={
              <React.Suspense fallback={<Fallback />}>
                <TicTacToe />
              </React.Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
