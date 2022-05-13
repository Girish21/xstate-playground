import * as React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Wrapper, Fallback } from './components'

const IndexPage = React.lazy(() => import('./Pages'))
const Stopwatch = React.lazy(() => import('./Pages/stopwatch'))
const Keyboard = React.lazy(() => import('./Pages/keyboard'))

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
            path='keyboard'
            element={
              <React.Suspense fallback={<Fallback />}>
                <Keyboard />
              </React.Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
